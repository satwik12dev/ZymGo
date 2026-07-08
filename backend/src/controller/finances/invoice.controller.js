const db = require("../../config/pool");
const crypto = require("crypto");
const { sendInvoiceEmail } = require("../../utils/sendInvoiceEmail");

// =====================================================
// HELPERS
// =====================================================
const formatMoney = (amount) => Number(amount || 0).toFixed(2);

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();

  const [rows] = await db.query(
    `
      SELECT invoice_number
      FROM invoices
      WHERE invoice_number LIKE ?
      ORDER BY id DESC
      LIMIT 1
    `,
    [`INV-${year}-%`]
  );

  let nextNumber = 1;

  if (rows.length > 0) {
    const parts = String(rows[0].invoice_number).split("-");
    const lastNumber = Number(parts[2]);

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `INV-${year}-${String(nextNumber).padStart(4, "0")}`;
};

const ensurePublicToken = async (invoice) => {
  if (invoice.public_token) {
    return invoice.public_token;
  }

  const publicToken = crypto.randomBytes(32).toString("hex");

  await db.query(
    `
      UPDATE invoices
      SET
        public_token = ?,
        public_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
      WHERE id = ?
    `,
    [publicToken, invoice.id]
  );

  return publicToken;
};

// =====================================================
// GET INVOICE SUMMARY
// GET /api/invoices/summary
// =====================================================
const getInvoiceSummary = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        COUNT(*) AS total_invoices,

        COALESCE(
          SUM(
            CASE
              WHEN status NOT IN ('void', 'cancelled') THEN total
              ELSE 0
            END
          ),
          0
        ) AS total_invoiced,

        COALESCE(
          SUM(
            CASE
              WHEN status NOT IN ('void', 'cancelled')
              THEN total - balance_due
              ELSE 0
            END
          ),
          0
        ) AS collected_amount,

        COALESCE(
          SUM(
            CASE
              WHEN status IN ('sent', 'partially_paid', 'overdue')
              THEN balance_due
              ELSE 0
            END
          ),
          0
        ) AS outstanding_amount,

        COUNT(CASE WHEN status = 'overdue' THEN 1 END) AS overdue_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid_count

      FROM invoices
    `);

    const summary = rows[0];

    return res.status(200).json({
      success: true,
      message: "Invoice summary fetched successfully",
      data: {
        total: Number(summary.total_invoices || 0),
        invoiced: Number(summary.total_invoiced || 0),
        collected: Number(summary.collected_amount || 0),
        outstanding: Number(summary.outstanding_amount || 0),
        overdue: Number(summary.overdue_count || 0),
        paid: Number(summary.paid_count || 0),
      },
    });
  } catch (error) {
    console.error("Get invoice summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice summary",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL INVOICES
// GET /api/invoices?page=1&limit=20&search=&status=&from_date=&to_date=
// =====================================================
const getInvoices = async (req, res) => {
  try {
    let {
      search = "",
      status = "",
      from_date = "",
      to_date = "",
      page = 1,
      limit = 20,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    const offset = (page - 1) * limit;
    const whereConditions = [];
    const params = [];

    if (search && String(search).trim()) {
      const searchValue = `%${String(search).trim()}%`;

      whereConditions.push(`
        (
          i.invoice_number LIKE ?
          OR i.gym_id LIKE ?
          OR u.name LIKE ?
          OR u.email LIKE ?
          OR u.mobile LIKE ?
          OR gm.gym_name LIKE ?
          OR sp.plan_name LIKE ?
        )
      `);

      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    if (status && status !== "all") {
      whereConditions.push("i.status = ?");
      params.push(status);
    }

    if (from_date) {
      whereConditions.push("DATE(i.issue_date) >= ?");
      params.push(from_date);
    }

    if (to_date) {
      whereConditions.push("DATE(i.issue_date) <= ?");
      params.push(to_date);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [countRows] = await db.query(
      `
        SELECT COUNT(*) AS total
        FROM invoices i
        LEFT JOIN users u ON u.id = i.owner_id
        LEFT JOIN gym_management gm ON gm.gym_id = i.gym_id
        LEFT JOIN subscription_plans sp ON sp.id = i.subscription_plan_id
        ${whereClause}
      `,
      params
    );

    const totalRecords = Number(countRows[0].total || 0);
    const totalPages = Math.ceil(totalRecords / limit);

    const [invoices] = await db.query(
      `
        SELECT
          i.id,
          i.invoice_number,
          i.owner_id,
          i.gym_id,
          i.subscription_id,
          i.subscription_plan_id,
          i.status,
          i.currency,
          i.issue_date,
          i.due_date,
          i.subtotal,
          i.tax_total,
          i.discount_total,
          i.total,
          i.balance_due,
          i.notes,
          i.sales_person_id,
          i.public_token,
          i.public_expires_at,
          i.pdf_url,
          i.created_at,
          i.updated_at,

          u.name AS owner_name,
          u.email AS owner_email,
          u.mobile AS owner_mobile,

          gm.gym_name,

          sp.plan_name,
          sp.plan_code,
          sp.plan_duration AS duration,
          sp.plan_price

        FROM invoices i
        LEFT JOIN users u ON u.id = i.owner_id
        LEFT JOIN gym_management gm ON gm.gym_id = i.gym_id
        LEFT JOIN subscription_plans sp ON sp.id = i.subscription_plan_id

        ${whereClause}

        ORDER BY i.id DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const formattedInvoices = invoices.map((invoice) => {
      const total = Number(invoice.total || 0);
      const balanceDue = Number(invoice.balance_due || 0);

      return {
        ...invoice,
        subtotal: Number(invoice.subtotal || 0),
        tax_total: Number(invoice.tax_total || 0),
        discount_total: Number(invoice.discount_total || 0),
        total,
        balance_due: balanceDue,
        plan_price: Number(invoice.plan_price || 0),
        amount_paid: total - balanceDue,
        is_overdue:
          !["paid", "void", "cancelled"].includes(invoice.status) &&
          invoice.due_date &&
          new Date(invoice.due_date) < new Date(),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data: formattedInvoices,
      pagination: {
        total_records: totalRecords,
        total_pages: totalPages,
        current_page: page,
        per_page: limit,
        showing_from: totalRecords === 0 ? 0 : offset + 1,
        showing_to: Math.min(offset + limit, totalRecords),
      },
    });
  } catch (error) {
    console.error("Get invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE INVOICE
// GET /api/invoices/:id
// =====================================================
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          i.*,

          u.name AS owner_name,
          u.email AS owner_email,
          u.mobile AS owner_mobile,

          gm.gym_name,
          gm.address AS gym_address,
          gm.city AS gym_city,
          gm.mobile AS gym_mobile,
          gm.email AS gym_email,

          sp.plan_name,
          sp.plan_code,
          sp.plan_duration AS duration,
          sp.plan_price

        FROM invoices i
        LEFT JOIN users u ON u.id = i.owner_id
        LEFT JOIN gym_management gm ON gm.gym_id = i.gym_id
        LEFT JOIN subscription_plans sp ON sp.id = i.subscription_plan_id

        WHERE i.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = rows[0];

    invoice.subtotal = Number(invoice.subtotal || 0);
    invoice.tax_total = Number(invoice.tax_total || 0);
    invoice.discount_total = Number(invoice.discount_total || 0);
    invoice.total = Number(invoice.total || 0);
    invoice.balance_due = Number(invoice.balance_due || 0);
    invoice.plan_price = Number(invoice.plan_price || 0);
    invoice.amount_paid = invoice.total - invoice.balance_due;

    return res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE INVOICE
// POST /api/invoices
// =====================================================
const createInvoice = async (req, res) => {
  try {
    const {
      owner_id,
      gym_id,
      subscription_id = null,
      subscription_plan_id,
      status = "draft",
      currency = "INR",
      issue_date,
      due_date = null,
      tax_total = 0,
      discount_total = 0,
      notes = null,
      sales_person_id = null,
    } = req.body;

    if (!owner_id || !gym_id || !subscription_plan_id || !issue_date) {
      return res.status(400).json({
        success: false,
        message:
          "owner_id, gym_id, subscription_plan_id and issue_date are required",
      });
    }

    const [planRows] = await db.query(
      `
        SELECT id, plan_name, plan_price, plan_duration
        FROM subscription_plans
        WHERE id = ? AND is_active = 1
        LIMIT 1
      `,
      [subscription_plan_id]
    );

    if (planRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found or inactive",
      });
    }

    const plan = planRows[0];
    const subtotal = Number(plan.plan_price || 0);
    const tax = Number(tax_total || 0);
    const discount = Number(discount_total || 0);
    const total = subtotal + tax - discount;
    const balanceDue = status === "paid" ? 0 : total;

    const invoiceNumber = await generateInvoiceNumber();

    const [result] = await db.query(
      `
        INSERT INTO invoices (
          invoice_number,
          owner_id,
          gym_id,
          subscription_id,
          subscription_plan_id,
          status,
          currency,
          issue_date,
          due_date,
          subtotal,
          tax_total,
          discount_total,
          total,
          balance_due,
          notes,
          sales_person_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        invoiceNumber,
        owner_id,
        gym_id,
        subscription_id,
        subscription_plan_id,
        status,
        currency,
        issue_date,
        due_date,
        subtotal,
        tax,
        discount,
        total,
        balanceDue,
        notes,
        sales_person_id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: {
        id: result.insertId,
        invoice_number: invoiceNumber,
        plan_name: plan.plan_name,
        duration: plan.plan_duration,
        subtotal,
        tax_total: tax,
        discount_total: discount,
        total,
        balance_due: balanceDue,
      },
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE INVOICE
// PUT /api/invoices/:id
// =====================================================
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      issue_date,
      due_date,
      subtotal,
      tax_total,
      discount_total,
      balance_due,
      notes,
      pdf_url,
    } = req.body;

    const [existingRows] = await db.query(
      "SELECT * FROM invoices WHERE id = ? LIMIT 1",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const oldInvoice = existingRows[0];

    const finalSubtotal =
      subtotal !== undefined
        ? Number(subtotal)
        : Number(oldInvoice.subtotal || 0);

    const finalTax =
      tax_total !== undefined
        ? Number(tax_total)
        : Number(oldInvoice.tax_total || 0);

    const finalDiscount =
      discount_total !== undefined
        ? Number(discount_total)
        : Number(oldInvoice.discount_total || 0);

    const total = finalSubtotal + finalTax - finalDiscount;
    const finalStatus = status || oldInvoice.status;

    let finalBalanceDue =
      balance_due !== undefined
        ? Number(balance_due)
        : Number(oldInvoice.balance_due || 0);

    if (finalStatus === "paid") {
      finalBalanceDue = 0;
    }

    await db.query(
      `
        UPDATE invoices
        SET
          status = ?,
          issue_date = ?,
          due_date = ?,
          subtotal = ?,
          tax_total = ?,
          discount_total = ?,
          total = ?,
          balance_due = ?,
          notes = ?,
          pdf_url = ?
        WHERE id = ?
      `,
      [
        finalStatus,
        issue_date || oldInvoice.issue_date,
        due_date !== undefined ? due_date : oldInvoice.due_date,
        finalSubtotal,
        finalTax,
        finalDiscount,
        total,
        finalBalanceDue,
        notes !== undefined ? notes : oldInvoice.notes,
        pdf_url !== undefined ? pdf_url : oldInvoice.pdf_url,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE INVOICE STATUS
// PATCH /api/invoices/:id/status
// =====================================================
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, balance_due } = req.body;

    const allowedStatuses = [
      "draft",
      "sent",
      "partially_paid",
      "paid",
      "overdue",
      "void",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice status",
      });
    }

    const [invoiceRows] = await db.query(
      "SELECT total, balance_due FROM invoices WHERE id = ? LIMIT 1",
      [id]
    );

    if (invoiceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = invoiceRows[0];

    let finalBalanceDue =
      balance_due !== undefined
        ? Number(balance_due)
        : Number(invoice.balance_due || 0);

    if (status === "paid") {
      finalBalanceDue = 0;
    }

    if (status === "sent" && balance_due === undefined) {
      finalBalanceDue = Number(invoice.total || 0);
    }

    await db.query(
      `
        UPDATE invoices
        SET status = ?, balance_due = ?
        WHERE id = ?
      `,
      [status, finalBalanceDue, id]
    );

    return res.status(200).json({
      success: true,
      message: "Invoice status updated successfully",
    });
  } catch (error) {
    console.error("Update invoice status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice status",
      error: error.message,
    });
  }
};

// =====================================================
// SEND INVOICE EMAIL
// POST /api/invoices/:id/send-email
// =====================================================
const sendInvoiceByEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          i.*,
          u.name AS owner_name,
          u.email AS owner_email,
          gm.gym_name,
          sp.plan_name,
          sp.plan_duration AS duration
        FROM invoices i
        LEFT JOIN users u ON u.id = i.owner_id
        LEFT JOIN gym_management gm ON gm.gym_id = i.gym_id
        LEFT JOIN subscription_plans sp ON sp.id = i.subscription_plan_id
        WHERE i.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = rows[0];

    if (!invoice.owner_email) {
      return res.status(400).json({
        success: false,
        message: "Owner email is not available",
      });
    }

    const publicToken = await ensurePublicToken(invoice);

    invoice.public_token = publicToken;

    await sendInvoiceEmail({
      to: invoice.owner_email,
      ownerName: invoice.owner_name,
      invoice,
    });

    if (invoice.status === "draft") {
      await db.query(
        "UPDATE invoices SET status = 'sent' WHERE id = ?",
        [id]
      );
    }

    return res.status(200).json({
      success: true,
      message: `Invoice sent successfully to ${invoice.owner_email}`,
    });
  } catch (error) {
    console.error("Send invoice email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send invoice email",
      error: error.message,
    });
  }
};

// =====================================================
// GENERATE WHATSAPP LINK
// POST /api/invoices/:id/send-whatsapp
// =====================================================
const sendInvoiceByWhatsApp = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          i.*,
          u.name AS owner_name,
          u.mobile AS owner_mobile,
          gm.gym_name,
          sp.plan_name,
          sp.plan_duration AS duration
        FROM invoices i
        LEFT JOIN users u ON u.id = i.owner_id
        LEFT JOIN gym_management gm ON gm.gym_id = i.gym_id
        LEFT JOIN subscription_plans sp ON sp.id = i.subscription_plan_id
        WHERE i.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = rows[0];

    if (!invoice.owner_mobile) {
      return res.status(400).json({
        success: false,
        message: "Owner mobile number is not available",
      });
    }

    let phone = String(invoice.owner_mobile).replace(/\D/g, "");

    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    const publicToken = await ensurePublicToken(invoice);

    const invoiceLink = `${process.env.FRONTEND_URL}/invoice/${publicToken}`;

    const message = `
Hello ${invoice.owner_name || "Customer"},

Your invoice has been generated.

Invoice No: ${invoice.invoice_number}
Gym: ${invoice.gym_name || "-"}
Plan: ${invoice.plan_name || "-"} (${invoice.duration || 0} Months)
Total Amount: ₹${formatMoney(invoice.total)}
Balance Due: ₹${formatMoney(invoice.balance_due)}
Due Date: ${invoice.due_date || "Not specified"}

View Invoice:
${invoiceLink}

Thank you,
ZymGo CRM
    `.trim();

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    if (invoice.status === "draft") {
      await db.query(
        "UPDATE invoices SET status = 'sent' WHERE id = ?",
        [id]
      );
    }

    return res.status(200).json({
      success: true,
      message: "WhatsApp link generated successfully",
      data: {
        whatsapp_url: whatsappUrl,
        phone,
        invoice_number: invoice.invoice_number,
      },
    });
  } catch (error) {
    console.error("Send invoice WhatsApp error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate WhatsApp invoice link",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE INVOICE
// DELETE /api/invoices/:id
// =====================================================
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM invoices WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
};

module.exports = {
  getInvoiceSummary,
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  sendInvoiceByEmail,
  sendInvoiceByWhatsApp,
  deleteInvoice,
};