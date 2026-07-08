// src/controller/finances/payment.controller.js

const db = require("../../config/pool");

const normalizeStatus = (status) => {
  if (!status) return "";

  const value = String(status).trim().toLowerCase();

  const map = {
    completed: "completed",
    success: "completed",
    paid: "completed",

    pending: "pending",
    initiated: "pending",

    failed: "failed",
    failure: "failed",

    refunded: "refunded",
  };

  return map[value] || "";
};

const getPayments = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      method = "",
      fromDate = "",
      toDate = "",
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;

    const normalizedStatus = normalizeStatus(status);

    const where = [];
    const params = [];

    if (search.trim()) {
      const keyword = `%${search.trim()}%`;

      where.push(`
        (
          p.txnid LIKE ?
          OR i.invoice_number LIKE ?
          OR u.name LIKE ?
          OR u.email LIKE ?
          OR u.mobile LIKE ?
          OR gm.gym_name LIKE ?
          OR gm.gym_id LIKE ?
        )
      `);

      params.push(
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword
      );
    }

    if (normalizedStatus) {
      where.push(`LOWER(p.status) = ?`);
      params.push(normalizedStatus);
    }

    if (method.trim()) {
      where.push(`LOWER(p.method) = ?`);
      params.push(method.trim().toLowerCase());
    }

    if (fromDate) {
      where.push(`DATE(p.created_at) >= ?`);
      params.push(fromDate);
    }

    if (toDate) {
      where.push(`DATE(p.created_at) <= ?`);
      params.push(toDate);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    /*
      Change these joins only if your column names differ:

      payments.invoice_id -> invoices.id
      invoices.gym_id -> gym_management.gym_id
      invoices.owner_id -> users.id

      If gym_id columns have different collations, COLLATE avoids
      the "Illegal mix of collations" MySQL error.
    */
    const baseJoinSql = `
      FROM payments p
      LEFT JOIN invoices i
        ON i.id = p.invoice_id

      LEFT JOIN users u
        ON u.id = i.owner_id

      LEFT JOIN gym_management gm
        ON gm.gym_id COLLATE utf8mb4_0900_ai_ci =
           i.gym_id COLLATE utf8mb4_0900_ai_ci
    `;

    // Total matching payment rows
    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      ${baseJoinSql}
      ${whereSql}
      `,
      params
    );

    const totalPayments = Number(countRows[0]?.total || 0);
    const totalPages = Math.ceil(totalPayments / pageSize);

    // Payment table data
    const [paymentRows] = await db.query(
      `
      SELECT
        p.id,
        p.txnid AS transactionId,
        p.invoice_id AS invoiceId,
        p.amount,
        p.method,
        p.status,
        p.created_at AS createdAt,
        p.paid_at AS paidAt,

        i.invoice_number AS invoiceNumber,
        i.total AS invoiceTotal,
        i.balance_due AS balanceDue,

        u.id AS payerId,
        COALESCE(u.name, 'Customer') AS payerName,
        u.email AS payerEmail,
        u.mobile AS payerPhone,

        gm.gym_id AS gymId,
        gm.gym_name AS gymName

      ${baseJoinSql}
      ${whereSql}

      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pageSize, offset]
    );

    // Summary cards should not use search/date filters.
    // They show global payment numbers, like your screenshot.
    const [summaryRows] = await db.query(`
      SELECT
        COUNT(*) AS totalPayments,

        COUNT(
          CASE
            WHEN LOWER(status) IN ('completed', 'success', 'paid')
            THEN 1
          END
        ) AS completedPayments,

        COUNT(
          CASE
            WHEN LOWER(status) IN ('pending', 'initiated')
            THEN 1
          END
        ) AS pendingPayments,

        COUNT(
          CASE
            WHEN LOWER(status) IN ('failed', 'failure')
            THEN 1
          END
        ) AS failedPayments,

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(status) IN ('completed', 'success', 'paid')
              AND YEAR(created_at) = YEAR(CURDATE())
              AND MONTH(created_at) = MONTH(CURDATE())
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS thisMonthAmount,

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(status) IN ('completed', 'success', 'paid')
              AND DATE(created_at) = CURDATE()
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS todayAmount

      FROM payments
    `);

    const summary = summaryRows[0] || {};

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",

      summary: {
        total: Number(summary.totalPayments || 0),
        completed: Number(summary.completedPayments || 0),
        pending: Number(summary.pendingPayments || 0),
        failed: Number(summary.failedPayments || 0),
        thisMonth: Number(summary.thisMonthAmount || 0),
        today: Number(summary.todayAmount || 0),
      },

      filters: {
        search,
        status: normalizedStatus || null,
        method: method || null,
        fromDate: fromDate || null,
        toDate: toDate || null,
      },

      pagination: {
        page: currentPage,
        limit: pageSize,
        totalPayments,
        totalPages,
        showingFrom: totalPayments === 0 ? 0 : offset + 1,
        showingTo: Math.min(offset + pageSize, totalPayments),
      },

      payments: paymentRows.map((payment) => ({
        id: payment.id,
        transactionId: payment.transactionId,
        amount: Number(payment.amount || 0),
        method: payment.method || "N/A",
        status: payment.status || "pending",
        createdAt: payment.createdAt,
        paidAt: payment.paidAt,

        invoice: {
          id: payment.invoiceId,
          invoiceNumber: payment.invoiceNumber || "N/A",
          total: Number(payment.invoiceTotal || 0),
          balanceDue: Number(payment.balanceDue || 0),
        },

        payer: {
          id: payment.payerId,
          name: payment.payerName,
          email: payment.payerEmail || "N/A",
          phone: payment.payerPhone || "N/A",
        },

        gym: {
          id: payment.gymId || "N/A",
          name: payment.gymName || "N/A",
        },
      })),
    });
  } catch (error) {
    console.error("getPayments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch payments",
      error: error.message,
    });
  }
};

const exportPaymentsCSV = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      method = "",
      fromDate = "",
      toDate = "",
    } = req.query;

    const normalizedStatus = normalizeStatus(status);

    const where = [];
    const params = [];

    if (search.trim()) {
      const keyword = `%${search.trim()}%`;

      where.push(`
        (
          p.txnid LIKE ?
          OR i.invoice_number LIKE ?
          OR u.name LIKE ?
          OR u.email LIKE ?
          OR u.mobile LIKE ?
          OR gm.gym_name LIKE ?
          OR gm.gym_id LIKE ?
        )
      `);

      params.push(
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword
      );
    }

    if (normalizedStatus) {
      where.push(`LOWER(p.status) = ?`);
      params.push(normalizedStatus);
    }

    if (method.trim()) {
      where.push(`LOWER(p.method) = ?`);
      params.push(method.trim().toLowerCase());
    }

    if (fromDate) {
      where.push(`DATE(p.created_at) >= ?`);
      params.push(fromDate);
    }

    if (toDate) {
      where.push(`DATE(p.created_at) <= ?`);
      params.push(toDate);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await db.query(
      `
      SELECT
        p.txnid AS transactionId,
        i.invoice_number AS invoiceNumber,
        COALESCE(u.name, 'Customer') AS payerName,
        u.email AS payerEmail,
        u.mobile AS payerPhone,
        gm.gym_id AS gymId,
        gm.gym_name AS gymName,
        p.method,
        p.amount,
        p.status,
        p.created_at AS paymentDate

      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN users u ON u.id = i.owner_id
      LEFT JOIN gym_management gm
        ON gm.gym_id COLLATE utf8mb4_0900_ai_ci =
           i.gym_id COLLATE utf8mb4_0900_ai_ci

      ${whereSql}
      ORDER BY p.created_at DESC
      `,
      params
    );

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";

      const text = String(value).replace(/"/g, '""');
      return `"${text}"`;
    };

    const headers = [
      "Transaction ID",
      "Invoice Number",
      "Payer Name",
      "Email",
      "Phone",
      "Gym ID",
      "Gym Name",
      "Method",
      "Amount",
      "Status",
      "Payment Date",
    ];

    const csvRows = rows.map((row) =>
      [
        row.transactionId,
        row.invoiceNumber,
        row.payerName,
        row.payerEmail,
        row.payerPhone,
        row.gymId,
        row.gymName,
        row.method,
        row.amount,
        row.status,
        row.paymentDate,
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csv = [headers.map(escapeCSV).join(","), ...csvRows].join("\n");

    const fileName = `payments-${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("exportPaymentsCSV error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to export payments CSV",
      error: error.message,
    });
  }
};

module.exports = {
  getPayments,
  exportPaymentsCSV,
};