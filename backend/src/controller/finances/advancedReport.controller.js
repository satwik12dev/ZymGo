// controllers/advancedFinanceReportController.js

const db = require("../../config/pool");

/*
  GET /api/admin/reports/advanced-finance
  Query params:
  - fromDate=2026-02-01
  - toDate=2026-07-31
*/
const getAdvancedFinanceReport = async (req, res) => {
  try {
    const { fromDate, toDate, gymId } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    const startDate = String(fromDate).trim();
    const endDate = String(toDate).trim();

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be greater than to date",
      });
    }

    /*
      Important table relations used:

      invoices.gym_id = gym_management.gym_id
      payments.invoice_id = invoices.id
      logs.gym_id = gym_management.gym_id
      logs.invoice_id = invoices.id

      Invoice statuses expected:
      draft, sent, paid, partially_paid, overdue, cancelled
    */

    const gymInvoiceFilter = gymId ? " AND i.gym_id = ? " : "";
    const gymPaymentFilter = gymId ? " AND i.gym_id = ? " : "";
    const gymLogFilter = gymId ? " AND l.gym_id = ? " : "";

    const invoiceParams = [startDate, endDate];
    if (gymId) invoiceParams.push(gymId);

    const paymentParams = [startDate, endDate];
    if (gymId) paymentParams.push(gymId);

    const logParams = [];
    if (gymId) logParams.push(gymId);

    // ---------------------------------------------------------
    // 1. Dashboard cards
    // ---------------------------------------------------------

    const [invoiceSummaryRows] = await db.query(
      `
      SELECT
        COUNT(CASE WHEN i.status = 'paid' THEN 1 END) AS paidInvoices,

        COUNT(
          CASE
            WHEN i.status IN ('sent', 'partially_paid', 'overdue')
            THEN 1
          END
        ) AS unpaidInvoices,

        COALESCE(
          SUM(
            CASE
              WHEN i.status IN ('sent', 'partially_paid', 'overdue')
              THEN i.balance_due
              ELSE 0
            END
          ),
          0
        ) AS outstandingAmount

      FROM invoices i
      WHERE DATE(i.issue_date) BETWEEN ? AND ?
      ${gymInvoiceFilter}
      AND i.status != 'cancelled'
      `,
      invoiceParams
    );

    const [paymentSummaryRows] = await db.query(
      `
      SELECT
        COALESCE(SUM(p.amount), 0) AS collectedRevenue
      FROM payments p
      INNER JOIN invoices i ON i.id = p.invoice_id
      WHERE DATE(p.paid_at) BETWEEN ? AND ?
      AND p.status = 'completed'
      ${gymPaymentFilter}
      `,
      paymentParams
    );

    const invoiceSummary = invoiceSummaryRows[0] || {};
    const paymentSummary = paymentSummaryRows[0] || {};

    // ---------------------------------------------------------
    // 2. Monthly Revenue Trend
    // Revenue is based on successful payment transactions.
    // ---------------------------------------------------------

    const monthlyParams = [startDate, endDate];
    if (gymId) monthlyParams.push(gymId);

    const [monthlyRevenueRows] = await db.query(
      `
      SELECT
        DATE_FORMAT(p.paid_at, '%b %Y') AS month,
        DATE_FORMAT(p.paid_at, '%Y-%m') AS monthKey,

        COUNT(DISTINCT p.invoice_id) AS payments,

        COALESCE(SUM(p.amount), 0) AS collectedAmount

      FROM payments p
      INNER JOIN invoices i ON i.id = p.invoice_id

      WHERE DATE(p.paid_at) BETWEEN ? AND ?
      AND p.status = 'completed'
      ${gymPaymentFilter}

      GROUP BY
        DATE_FORMAT(p.paid_at, '%Y-%m'),
        DATE_FORMAT(p.paid_at, '%b %Y')

      ORDER BY monthKey ASC
      `,
      monthlyParams
    );

    // ---------------------------------------------------------
    // 3. Gym-Wise Recovery Report
    // Billed      = invoice total
    // Collected   = completed payment sum
    // Outstanding = invoice balance_due
    // Recovery %  = collected / billed * 100
    // ---------------------------------------------------------
    const gymRecoveryParams = [startDate, endDate];

if (gymId) {
  gymRecoveryParams.push(gymId);
}

const [gymRecoveryRows] = await db.query(
  `
  SELECT
    i.gym_id AS gymId,

    COALESCE(
      MAX(gm.gym_name),
      CONCAT("Gym ", i.gym_id)
    ) AS gymName,

    COUNT(DISTINCT i.id) AS invoices,

    COALESCE(SUM(i.total), 0) AS billed,

    COALESCE(SUM(paymentTotals.collectedAmount), 0) AS collected,

    COALESCE(SUM(i.balance_due), 0) AS outstanding,

    CASE
      WHEN COALESCE(SUM(i.total), 0) = 0 THEN 0
      ELSE ROUND(
        (
          COALESCE(SUM(paymentTotals.collectedAmount), 0)
          / SUM(i.total)
        ) * 100,
        2
      )
    END AS recoveryPercentage

  FROM invoices i

  LEFT JOIN gym_management gm
    ON gm.gym_id COLLATE utf8mb4_0900_ai_ci =
       i.gym_id COLLATE utf8mb4_0900_ai_ci

  LEFT JOIN (
    SELECT
      p.invoice_id,
      COALESCE(SUM(p.amount), 0) AS collectedAmount
    FROM payments p
    WHERE p.status = 'completed'
    GROUP BY p.invoice_id
  ) paymentTotals
    ON paymentTotals.invoice_id = i.id

  WHERE DATE(i.issue_date) BETWEEN ? AND ?
  AND i.status != 'cancelled'
  ${gymId ? "AND i.gym_id = ?" : ""}

  GROUP BY i.gym_id

  ORDER BY outstanding DESC, billed DESC
  `,
  gymRecoveryParams
);

    // ---------------------------------------------------------
    // 4. Recent Automation Events
    // Comes from your existing logs table.
    // ---------------------------------------------------------

    const [recentAutomationRows] = await db.query(
  `
  SELECT
    l.id,
    l.action,
    l.module,
    l.description,
    l.status,
    l.created_at AS createdAt,

    gm.gym_id AS gymId,
    gm.gym_name AS gymName,

    i.id AS invoiceId,
    i.invoice_number AS invoiceNumber,
    i.balance_due AS balanceDue

  FROM logs l

  LEFT JOIN gym_management gm
    ON gm.gym_id COLLATE utf8mb4_0900_ai_ci =
       l.gym_id COLLATE utf8mb4_0900_ai_ci

  LEFT JOIN invoices i
    ON i.id = l.invoice_id

  WHERE l.action IN (
    'INVOICE_CREATED',
    'INVOICE_PAID',
    'INVOICE_OVERDUE',
    'PAYMENT_LINK_SENT',
    'RENEWAL_REMINDER_SENT',
    'DUNNING_REMINDER_SENT',
    'SUBSCRIPTION_RENEWED'
  )

  ${gymLogFilter}

  ORDER BY l.created_at DESC
  LIMIT 10
  `,
  logParams
);

    // ---------------------------------------------------------
    // Final API response
    // ---------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Advanced finance report fetched successfully",

      filters: {
        fromDate: startDate,
        toDate: endDate,
        gymId: gymId || null,
      },

      summary: {
        collectedRevenue: Number(paymentSummary.collectedRevenue || 0),
        paidInvoices: Number(invoiceSummary.paidInvoices || 0),
        unpaidInvoices: Number(invoiceSummary.unpaidInvoices || 0),
        outstandingAmount: Number(invoiceSummary.outstandingAmount || 0),
      },

      monthlyRevenueTrend: monthlyRevenueRows.map((item) => ({
        month: item.month,
        payments: Number(item.payments || 0),
        collectedAmount: Number(item.collectedAmount || 0),
      })),

      gymWiseRecoveryReport: gymRecoveryRows.map((item) => ({
        gymId: item.gymId,
        gymName: item.gymName,
        invoices: Number(item.invoices || 0),
        billed: Number(item.billed || 0),
        collected: Number(item.collected || 0),
        outstanding: Number(item.outstanding || 0),
        recoveryPercentage: Number(item.recoveryPercentage || 0),
      })),

      recentAutomationEvents: recentAutomationRows.map((item) => ({
        id: item.id,
        action: item.action,
        module: item.module || "FINANCE",
        description: item.description || "No description available",
        status: item.status,
        createdAt: item.createdAt,

        gym: {
          gymId: item.gymId || null,
          gymName: item.gymName || "Unknown Gym",
        },

        invoice: item.invoiceId
          ? {
              id: item.invoiceId,
              invoiceNumber: item.invoiceNumber,
              balanceDue: Number(item.balanceDue || 0),
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("getAdvancedFinanceReport error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch advanced finance report",
      error: error.message,
    });
  }
};

module.exports = {
  getAdvancedFinanceReport,
};