const db = require("../../config/pool");

const num = (value) => Number(value || 0);

const getReportsDashboard = async (req, res) => {
  try {
    const [
      totalGymsResult,
      activeGymsResult,
      totalOwnersResult,
      subscriptionsResult,
      collectedResult,
      pendingDuesResult,
      revenueTrendResult,
      gymGrowthResult,
      gymsByStateResult,
      gymTypesResult,
      subscriptionStatusResult,
      topCitiesResult,
      subscriptionPlansResult,
      approvalStatusResult,
      invoiceBreakdownResult,
      recentGymsResult,
      ownerStatsResult,
      ownerStateResult,
      verifiedGymsResult,
      paymentMethodResult,
      paymentStatusResult,
      recentPaymentsResult,
    ] = await Promise.all([
      // 1. Total gyms
      db.query(`
        SELECT COUNT(*) AS totalGyms
        FROM gym_management
      `),

      // 2. Active gyms
      db.query(`
        SELECT COUNT(*) AS activeGyms
        FROM gym_management
        WHERE admin_approval_status = 'approved'
          AND status = '1'
      `),

      // 3. Total owners
      db.query(`
        SELECT COUNT(DISTINCT owner_id) AS totalOwners
        FROM gym_management
        WHERE owner_id IS NOT NULL
          AND owner_id != ''
      `),

      // 4. Active subscriptions
      db.query(`
        SELECT COUNT(*) AS totalSubscriptions
        FROM gym_subscriptions
        WHERE status = 'active'
      `),

      // 5. Total collected revenue
      db.query(`
        SELECT COALESCE(SUM(amount), 0) AS collectedAmount
        FROM payments
        WHERE status = 'completed'
      `),

      // 6. Pending dues
      db.query(`
        SELECT COALESCE(SUM(balance_due), 0) AS pendingDues
        FROM invoices
        WHERE status IN ('sent', 'partially_paid', 'overdue')
      `),

      // 7. Revenue trend
      db.query(`
        SELECT
          revenue_data.monthKey,
          MAX(revenue_data.monthLabel) AS month,
          COALESCE(SUM(revenue_data.invoiced), 0) AS invoiced,
          COALESCE(SUM(revenue_data.collected), 0) AS collected
        FROM (
          SELECT
            DATE_FORMAT(i.issue_date, '%Y-%m') AS monthKey,
            DATE_FORMAT(i.issue_date, '%b %Y') AS monthLabel,
            COALESCE(SUM(i.total), 0) AS invoiced,
            CAST(0 AS DECIMAL(12, 2)) AS collected
          FROM invoices i
          WHERE i.issue_date IS NOT NULL
            AND i.status NOT IN ('void', 'cancelled')
          GROUP BY
            DATE_FORMAT(i.issue_date, '%Y-%m'),
            DATE_FORMAT(i.issue_date, '%b %Y')

          UNION ALL

          SELECT
            DATE_FORMAT(p.paid_at, '%Y-%m') AS monthKey,
            DATE_FORMAT(p.paid_at, '%b %Y') AS monthLabel,
            CAST(0 AS DECIMAL(12, 2)) AS invoiced,
            COALESCE(SUM(p.amount), 0) AS collected
          FROM payments p
          WHERE p.paid_at IS NOT NULL
            AND p.status = 'completed'
          GROUP BY
            DATE_FORMAT(p.paid_at, '%Y-%m'),
            DATE_FORMAT(p.paid_at, '%b %Y')
        ) AS revenue_data
        GROUP BY revenue_data.monthKey
        ORDER BY revenue_data.monthKey ASC
        LIMIT 12
      `),

      // 8. Gym growth
      db.query(`
        SELECT
          DATE_FORMAT(gm.created_at, '%Y-%m') AS monthKey,
          DATE_FORMAT(gm.created_at, '%b %Y') AS month,
          COUNT(*) AS gymsAdded
        FROM gym_management gm
        WHERE gm.created_at IS NOT NULL
        GROUP BY
          DATE_FORMAT(gm.created_at, '%Y-%m'),
          DATE_FORMAT(gm.created_at, '%b %Y')
        ORDER BY monthKey ASC
        LIMIT 12
      `),

      // 9. Gyms by state
      db.query(`
        SELECT
          COALESCE(state, 'Unknown') AS state,
          COUNT(*) AS gymCount
        FROM gym_management
        GROUP BY COALESCE(state, 'Unknown')
        ORDER BY gymCount DESC
        LIMIT 10
      `),

      // 10. Gym types
      db.query(`
        SELECT
          COALESCE(gym_type, 'Gym') AS type,
          COUNT(*) AS count
        FROM gym_management
        GROUP BY COALESCE(gym_type, 'Gym')
        ORDER BY count DESC
      `),

      // 11. Subscription status
      db.query(`
        SELECT
          COALESCE(status, 'unknown') AS status,
          COUNT(*) AS count
        FROM gym_subscriptions
        GROUP BY COALESCE(status, 'unknown')
        ORDER BY count DESC
      `),

      // 12. Top cities
      db.query(`
        SELECT
          COALESCE(city, 'Unknown') AS city,
          COUNT(*) AS gymCount
        FROM gym_management
        GROUP BY COALESCE(city, 'Unknown')
        ORDER BY gymCount DESC
        LIMIT 10
      `),

      // 13. Subscription plan usage
      db.query(`
        SELECT
          sp.plan_name,
          COUNT(gs.id) AS gymCount
        FROM subscription_plans sp
        LEFT JOIN gym_subscriptions gs
          ON gs.subscription_plan_id = sp.id
        GROUP BY sp.id, sp.plan_name
        ORDER BY gymCount DESC
      `),

      // 14. Approval status
      db.query(`
        SELECT
          COALESCE(admin_approval_status, 'pending') AS status,
          COUNT(*) AS count
        FROM gym_management
        GROUP BY COALESCE(admin_approval_status, 'pending')
        ORDER BY count DESC
      `),

      // 15. Invoice breakdown
      db.query(`
        SELECT
          status,
          COUNT(*) AS count,
          COALESCE(SUM(total), 0) AS totalAmount,
          COALESCE(SUM(balance_due), 0) AS balanceDue
        FROM invoices
        GROUP BY status
        ORDER BY count DESC
      `),

      // 16. Recently added gyms
      // No users table join because owner_id is VARCHAR in gym_management
      db.query(`
        SELECT
          gm.id,
          gm.gym_id,
          gm.gym_name,
          gm.owner_id,
          gm.city,
          gm.state,
          gm.email AS owner_email,
          gm.mobile AS owner_mobile,
          gm.created_at,
          gm.admin_approval_status,
          gm.status AS gym_status,
          sp.plan_name AS subscription_name
        FROM gym_management gm
        LEFT JOIN gym_subscriptions gs
          ON CAST(gs.gym_id AS CHAR) = CAST(gm.id AS CHAR)
          AND gs.status = 'active'
        LEFT JOIN subscription_plans sp
          ON sp.id = gs.subscription_plan_id
        ORDER BY gm.created_at DESC
        LIMIT 10
      `),

      // 17. Owner analytics
      db.query(`
        SELECT
          COUNT(DISTINCT owner_id) AS totalOwners,

          COUNT(DISTINCT CASE
            WHEN admin_approval_status = 'approved'
              AND status = '1'
            THEN owner_id
          END) AS activeOwners,

          COUNT(DISTINCT CASE
            WHEN admin_approval_status = 'rejected'
              OR status != '1'
            THEN owner_id
          END) AS inactiveOwners

        FROM gym_management
        WHERE owner_id IS NOT NULL
          AND owner_id != ''
      `),

      // 18. Owner distribution by state
      db.query(`
        SELECT
          COALESCE(state, 'Unknown') AS state,
          COUNT(DISTINCT owner_id) AS ownerCount
        FROM gym_management
        WHERE owner_id IS NOT NULL
          AND owner_id != ''
        GROUP BY COALESCE(state, 'Unknown')
        ORDER BY ownerCount DESC
        LIMIT 10
      `),

      // 19. Verified gyms
      db.query(`
        SELECT COUNT(*) AS verifiedGyms
        FROM gym_management
        WHERE is_verified = 1
      `),

      // 20. Payment methods
      db.query(`
        SELECT
          method,
          COUNT(*) AS paymentCount,
          COALESCE(SUM(amount), 0) AS totalAmount
        FROM payments
        WHERE status = 'completed'
        GROUP BY method
        ORDER BY totalAmount DESC
      `),

      // 21. Payment statuses
      db.query(`
        SELECT
          status,
          COUNT(*) AS paymentCount,
          COALESCE(SUM(amount), 0) AS totalAmount
        FROM payments
        GROUP BY status
        ORDER BY paymentCount DESC
      `),

      // 22. Recent payments
      db.query(`
        SELECT
          p.id,
          p.txnid,
          p.invoice_id,
          p.amount,
          p.method,
          p.status,
          p.paid_at,
          p.firstname,
          p.email,
          p.reference,
          i.invoice_number,
          i.gym_id,
          i.owner_id
        FROM payments p
        LEFT JOIN invoices i
          ON i.id = p.invoice_id
        ORDER BY p.paid_at DESC
        LIMIT 10
      `),
    ]);

    const totalGyms = num(totalGymsResult[0][0]?.totalGyms);
    const activeGyms = num(activeGymsResult[0][0]?.activeGyms);
    const totalOwners = num(totalOwnersResult[0][0]?.totalOwners);
    const totalSubscriptions = num(
      subscriptionsResult[0][0]?.totalSubscriptions
    );
    const collectedAmount = num(
      collectedResult[0][0]?.collectedAmount
    );
    const pendingDues = num(
      pendingDuesResult[0][0]?.pendingDues
    );
    const verifiedGyms = num(
      verifiedGymsResult[0][0]?.verifiedGyms
    );

    const ownerStats = ownerStatsResult[0][0] || {};
    const invoiceBreakdown = invoiceBreakdownResult[0] || [];

    const totalInvoiced = invoiceBreakdown.reduce(
      (sum, invoice) => sum + num(invoice.totalAmount),
      0
    );

    const formattedRecentGyms = recentGymsResult[0].map((gym) => ({
      id: gym.id,
      gymId: gym.gym_id,
      gymName: gym.gym_name || "Unnamed Gym",
      initials: gym.gym_name
        ? gym.gym_name
            .split(" ")
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
        : "GY",
      ownerId: gym.owner_id,
      ownerName: gym.gym_name || "Unknown Owner",
      ownerEmail: gym.owner_email || null,
      ownerMobile: gym.owner_mobile || null,
      location: [gym.city, gym.state].filter(Boolean).join(", ") || "Unknown",
      status:
        gym.admin_approval_status === "approved" && gym.gym_status === "1"
          ? "Active"
          : gym.admin_approval_status === "rejected"
          ? "Rejected"
          : "Pending",
      subscription: gym.subscription_name || "No Plan",
      addedAt: gym.created_at,
    }));

    const formattedRecentPayments = recentPaymentsResult[0].map((payment) => ({
      id: payment.id,
      transactionId: payment.txnid,
      invoiceId: payment.invoice_id,
      invoiceNumber: payment.invoice_number || null,
      gymId: payment.gym_id || null,
      ownerId: payment.owner_id || null,
      customerName: payment.firstname || "Unknown",
      customerEmail: payment.email || null,
      amount: num(payment.amount),
      method: payment.method,
      status: payment.status,
      reference: payment.reference || null,
      paidAt: payment.paid_at,
    }));

    return res.status(200).json({
      success: true,
      message: "Reports dashboard fetched successfully",

      summary: {
        totalGyms,
        activeGyms,
        verifiedGyms,
        totalOwners,
        totalSubscriptions,
        totalInvoiced,
        collectedAmount,
        pendingDues,
      },

      charts: {
        revenueTrend: revenueTrendResult[0].map((item) => ({
          month: item.month,
          invoiced: num(item.invoiced),
          collected: num(item.collected),
        })),

        gymGrowth: gymGrowthResult[0].map((item) => ({
          month: item.month,
          gymsAdded: num(item.gymsAdded),
        })),

        gymsByState: gymsByStateResult[0].map((item) => ({
          state: item.state,
          count: num(item.gymCount),
        })),

        gymTypes: gymTypesResult[0].map((item) => ({
          name: item.type,
          value: num(item.count),
        })),

        subscriptionStatus: subscriptionStatusResult[0].map((item) => ({
          name: item.status,
          value: num(item.count),
        })),

        topCities: topCitiesResult[0].map((item) => ({
          city: item.city,
          count: num(item.gymCount),
        })),

        ownerDistributionByState: ownerStateResult[0].map((item) => ({
          state: item.state,
          count: num(item.ownerCount),
        })),

        paymentMethods: paymentMethodResult[0].map((item) => ({
          name: item.method,
          count: num(item.paymentCount),
          amount: num(item.totalAmount),
        })),

        paymentStatus: paymentStatusResult[0].map((item) => ({
          name: item.status,
          count: num(item.paymentCount),
          amount: num(item.totalAmount),
        })),
      },

      subscriptionPlans: subscriptionPlansResult[0].map((item) => ({
        planName: item.plan_name,
        gymCount: num(item.gymCount),
      })),

      approvalStatus: approvalStatusResult[0].map((item) => ({
        status: item.status,
        count: num(item.count),
      })),

      invoiceBreakdown: {
        totalInvoiced,
        items: invoiceBreakdown.map((item) => ({
          status: item.status,
          count: num(item.count),
          totalAmount: num(item.totalAmount),
          balanceDue: num(item.balanceDue),
        })),
      },

      ownerAnalytics: {
        totalOwners: num(ownerStats.totalOwners),
        activeOwners: num(ownerStats.activeOwners),
        inactiveOwners: num(ownerStats.inactiveOwners),
        verifiedGyms,
      },

      recentlyAddedGyms: formattedRecentGyms,
      recentPayments: formattedRecentPayments,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Reports dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports dashboard",
      error: error.message,
    });
  }
};


module.exports = getReportsDashboard;