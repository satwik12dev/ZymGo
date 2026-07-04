const db = require("../../config/pool");
const { Parser } = require("json2csv");

const getGymAnalytics = async (req, res) => {
  try {
    const {
      state,
      city,
      from_date,
      to_date,
    } = req.query;

    const conditions = [];
    const params = [];

    // Gym filters
    if (state && state !== "All States") {
      conditions.push("gm.state = ?");
      params.push(state);
    }

    if (city && city !== "All Cities") {
      conditions.push("gm.city = ?");
      params.push(city);
    }

    // Date filter based on gym created date
    if (from_date && to_date) {
      conditions.push("DATE(gm.created_at) BETWEEN ? AND ?");
      params.push(from_date, to_date);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // ─────────────────────────────────────────────
    // 1. SUMMARY CARDS
    // ─────────────────────────────────────────────
    const [summaryRows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT gm.id) AS total_gyms,

        COUNT(DISTINCT CASE
          WHEN gm.status = '1' THEN gm.id
        END) AS active_gyms,

        COUNT(DISTINCT CASE
          WHEN gm.status = '0' THEN gm.id
        END) AS inactive_gyms,

        COUNT(DISTINCT CASE
          WHEN gm.is_verified = 1 THEN gm.id
        END) AS verified_gyms,

        COUNT(DISTINCT CASE
          WHEN gm.is_zymgoo_trusted = 1 THEN gm.id
        END) AS trusted_gyms,

        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN gm.id
        END) AS subscribed_gyms,

        COUNT(DISTINCT gm.id) -
        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN gm.id
        END) AS unsubscribed_gyms,

        COALESCE(SUM(
          CASE
            WHEN gs.status = 'active'
            THEN gs.payment_amount
            ELSE 0
          END
        ), 0) AS total_revenue

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      ${whereClause}
      `,
      params
    );

    const summary = summaryRows[0];

    // ─────────────────────────────────────────────
    // 2. SUBSCRIPTION PLANS DONUT
    // ─────────────────────────────────────────────
    const [subscriptionPlans] = await db.query(
      `
      SELECT
        COALESCE(sp.plan_name, 'Unknown Plan') AS plan_name,
        COUNT(DISTINCT gs.gym_id) AS total

      FROM gym_subscriptions gs

      LEFT JOIN subscription_plans sp
        ON sp.id = gs.subscription_plan_id

      INNER JOIN gym_management gm
        ON gm.gym_id = gs.gym_id

      WHERE gs.status = 'active'
      AND gs.expire_date >= CURDATE()
      ${state && state !== "All States" ? "AND gm.state = ?" : ""}
      ${city && city !== "All Cities" ? "AND gm.city = ?" : ""}

      GROUP BY sp.plan_name
      ORDER BY total DESC
      `,
      [
        ...(state && state !== "All States" ? [state] : []),
        ...(city && city !== "All Cities" ? [city] : []),
      ]
    );

    // ─────────────────────────────────────────────
    // 3. STATE-WISE DISTRIBUTION (TOP 10)
    // ─────────────────────────────────────────────
    const [stateWiseDistribution] = await db.query(
      `
      SELECT
        COALESCE(gm.state, 'Unknown') AS state,

        COUNT(DISTINCT gm.id) AS total,

        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN gm.id
        END) AS subscribed

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      ${whereClause}

      GROUP BY gm.state
      ORDER BY total DESC
      LIMIT 10
      `,
      params
    );

    // ─────────────────────────────────────────────
    // 4. CITY-WISE DISTRIBUTION (TOP 15)
    // ─────────────────────────────────────────────
    const [cityWiseDistribution] = await db.query(
      `
      SELECT
        COALESCE(gm.city, 'Unknown') AS city,
        COALESCE(gm.state, 'Unknown') AS state,

        COUNT(DISTINCT gm.id) AS total,

        COUNT(DISTINCT CASE
          WHEN gm.status = '1'
          THEN gm.id
        END) AS active

      FROM gym_management gm

      ${whereClause}

      GROUP BY gm.city, gm.state
      ORDER BY total DESC
      LIMIT 15
      `,
      params
    );

    // ─────────────────────────────────────────────
    // 5. STATE-WISE DETAILS TABLE
    // ─────────────────────────────────────────────
    const [stateWiseDetails] = await db.query(
      `
      SELECT
        COALESCE(gm.state, 'Unknown') AS state,

        COUNT(DISTINCT gm.id) AS total,

        COUNT(DISTINCT CASE
          WHEN gm.status = '1' THEN gm.id
        END) AS active,

        COUNT(DISTINCT CASE
          WHEN gm.is_verified = 1 THEN gm.id
        END) AS verified,

        COUNT(DISTINCT CASE
          WHEN gm.is_zymgoo_trusted = 1 THEN gm.id
        END) AS trusted,

        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN gm.id
        END) AS subscribed

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      ${whereClause}

      GROUP BY gm.state
      ORDER BY total DESC
      `,
      params
    );

    // ─────────────────────────────────────────────
    // 6. CITY-WISE DETAILS TABLE
    // ─────────────────────────────────────────────
    const [cityWiseDetails] = await db.query(
      `
      SELECT
        COALESCE(gm.city, 'Unknown') AS city,
        COALESCE(gm.state, 'Unknown') AS state,

        COUNT(DISTINCT gm.id) AS total,

        COUNT(DISTINCT CASE
          WHEN gm.status = '1' THEN gm.id
        END) AS active,

        COUNT(DISTINCT CASE
          WHEN gm.is_verified = 1 THEN gm.id
        END) AS verified,

        COUNT(DISTINCT CASE
          WHEN gm.is_zymgoo_trusted = 1 THEN gm.id
        END) AS trusted,

        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN gm.id
        END) AS subscribed

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      ${whereClause}

      GROUP BY gm.city, gm.state
      ORDER BY total DESC
      `,
      params
    );

    // ─────────────────────────────────────────────
    // 7. TOP 10 GYMS BY REVENUE
    // ─────────────────────────────────────────────
    const [topGymsByRevenue] = await db.query(
      `
      SELECT
        gm.gym_id,
        gm.gym_name,
        gm.city,
        gm.state,

        COUNT(DISTINCT CASE
          WHEN gs.status = 'active'
          THEN gs.id
        END) AS subscriptions,

        COALESCE(SUM(
          CASE
            WHEN gs.status = 'active'
            THEN gs.payment_amount
            ELSE 0
          END
        ), 0) AS revenue

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      ${whereClause}

      GROUP BY
        gm.gym_id,
        gm.gym_name,
        gm.city,
        gm.state

      ORDER BY revenue DESC
      LIMIT 10
      `,
      params
    );

    // ─────────────────────────────────────────────
    // 8. EXPIRING SUBSCRIPTIONS (NEXT 30 DAYS)
    // ─────────────────────────────────────────────
    const [expiringSubscriptions] = await db.query(
      `
      SELECT
        gm.gym_id,
        gm.gym_name,
        gm.city,
        gm.state,
        gs.subscription_plan_id,
        gs.expire_date,

        DATEDIFF(gs.expire_date, CURDATE()) AS days_left

      FROM gym_subscriptions gs

      INNER JOIN gym_management gm
        ON gm.gym_id = gs.gym_id

      WHERE gs.status = 'active'
      AND gs.expire_date BETWEEN CURDATE()
      AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)

      ORDER BY gs.expire_date ASC
      LIMIT 20
      `
    );

    return res.status(200).json({
      success: true,
      message: "Gym analytics fetched successfully",

      filters: {
        state: state || "All States",
        city: city || "All Cities",
        from_date: from_date || null,
        to_date: to_date || null,
      },

      summary: {
        total: Number(summary.total_gyms || 0),
        active: Number(summary.active_gyms || 0),
        inactive: Number(summary.inactive_gyms || 0),
        verified: Number(summary.verified_gyms || 0),
        trusted: Number(summary.trusted_gyms || 0),
        subscribed: Number(summary.subscribed_gyms || 0),
        unsubscribed: Number(summary.unsubscribed_gyms || 0),
        revenue: Number(summary.total_revenue || 0),
      },

      charts: {
        subscription_status: {
          subscribed: Number(summary.subscribed_gyms || 0),
          unsubscribed: Number(summary.unsubscribed_gyms || 0),
        },

        active_vs_inactive: {
          active: Number(summary.active_gyms || 0),
          inactive: Number(summary.inactive_gyms || 0),
        },

        verified_vs_unverified: {
          verified: Number(summary.verified_gyms || 0),
          unverified:
            Number(summary.total_gyms || 0) -
            Number(summary.verified_gyms || 0),
        },

        trusted_vs_not_trusted: {
          trusted: Number(summary.trusted_gyms || 0),
          not_trusted:
            Number(summary.total_gyms || 0) -
            Number(summary.trusted_gyms || 0),
        },

        subscription_plans: subscriptionPlans,
        state_wise_distribution: stateWiseDistribution,
        city_wise_distribution: cityWiseDistribution,
      },

      tables: {
        state_wise_details: stateWiseDetails,
        city_wise_details: cityWiseDetails,
        top_gyms_by_revenue: topGymsByRevenue,
        expiring_subscriptions: expiringSubscriptions,
      },
    });
  } catch (error) {
    console.error("Gym analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gym analytics",
      error: error.message,
    });
  }
};

const exportGymAnalyticsSummary = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        COUNT(id) AS total_gyms,

        SUM(
          CASE
            WHEN status = '1' THEN 1
            ELSE 0
          END
        ) AS active_gyms,

        SUM(
          CASE
            WHEN status = '0' THEN 1
            ELSE 0
          END
        ) AS inactive_gyms,

        SUM(
          CASE
            WHEN is_verified = 1 THEN 1
            ELSE 0
          END
        ) AS verified_gyms,

        SUM(
          CASE
            WHEN is_zymgoo_trusted = 1 THEN 1
            ELSE 0
          END
        ) AS trusted_gyms

      FROM gym_management
    `);

    const summary = rows[0];

    const csvData = [
      {
        "Total Gyms": summary.total_gyms || 0,
        "Active Gyms": summary.active_gyms || 0,
        "Inactive Gyms": summary.inactive_gyms || 0,
        "Verified Gyms": summary.verified_gyms || 0,
        "Zymgoo Trusted Gyms": summary.trusted_gyms || 0,
      },
    ];

    const { Parser } = require("json2csv");

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("gym-analytics-summary.csv");

    return res.send(csv);
  } catch (error) {
    console.error("Export summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export gym analytics summary",
      error: error.message,
    });
  }
};


const exportGymAnalyticsWithFilters = async (req, res) => {
  try {
    const { state, city, from_date, to_date } = req.query;

    const conditions = [];
    const params = [];

    // State filter
    if (state && state !== "All States") {
      conditions.push("state = ?");
      params.push(state);
    }

    // City filter
    if (city && city !== "All Cities") {
      conditions.push("city = ?");
      params.push(city);
    }

    // Date range filter
    if (from_date && to_date) {
      conditions.push("DATE(created_at) BETWEEN ? AND ?");
      params.push(from_date, to_date);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const [gyms] = await db.query(
      `
        SELECT
          gym_id,
          gym_name,
          owner_id,
          mobile,
          email,
          city,
          state,

          CASE
            WHEN status = '1' THEN 'Active'
            WHEN status = '0' THEN 'Inactive'
            ELSE 'Unknown'
          END AS gym_status,

          admin_approval_status,

          CASE
            WHEN is_verified = 1 THEN 'Yes'
            ELSE 'No'
          END AS is_verified,

          CASE
            WHEN is_zymgoo_trusted = 1 THEN 'Yes'
            ELSE 'No'
          END AS zymgoo_trusted,

          CASE
            WHEN is_top_search = 1 THEN 'Yes'
            ELSE 'No'
          END AS top_search,

          created_at,
          updated_at

        FROM gym_management

        ${whereClause}

        ORDER BY created_at DESC
      `,
      params
    );

    // CSV columns.
    // Providing fields prevents json2csv errors even if no data is found.
    const fields = [
      { label: "Gym ID", value: "gym_id" },
      { label: "Gym Name", value: "gym_name" },
      { label: "Owner ID", value: "owner_id" },
      { label: "Mobile", value: "mobile" },
      { label: "Email", value: "email" },
      { label: "City", value: "city" },
      { label: "State", value: "state" },
      { label: "Gym Status", value: "gym_status" },
      { label: "Admin Approval Status", value: "admin_approval_status" },
      { label: "Verified", value: "is_verified" },
      { label: "Zymgoo Trusted", value: "zymgoo_trusted" },
      { label: "Top Search", value: "top_search" },
      { label: "Created At", value: "created_at" },
      { label: "Updated At", value: "updated_at" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(gyms);

    const fileName = `filtered-gym-analytics-${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Export filtered analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export filtered gym analytics",
      error: error.message,
    });
  }
};



const exportStateAnalyticsCSV = async (req, res) => {
  try {
    // Because route does NOT have /:state
    // URL: ?state=Uttar%20Pradesh
    const { state } = req.query;

    if (!state || !state.trim()) {
      return res.status(400).json({
        success: false,
        message: "State is required. Example: ?state=Uttar%20Pradesh",
      });
    }

    const [gyms] = await db.query(
      `
      SELECT
        gm.gym_id,
        gm.gym_name,
        gm.city,
        gm.state,

        CASE
          WHEN gm.status = '1' THEN 'Active'
          WHEN gm.status = '0' THEN 'Inactive'
          ELSE 'Unknown'
        END AS gym_status,

        gm.admin_approval_status,

        CASE
          WHEN gm.is_verified = 1 THEN 'Yes'
          ELSE 'No'
        END AS verified,

        CASE
          WHEN gm.is_zymgoo_trusted = 1 THEN 'Yes'
          ELSE 'No'
        END AS zymgoo_trusted,

        CASE
          WHEN gs.status = 'active'
          AND gs.expire_date >= CURDATE()
          THEN 'Subscribed'
          ELSE 'Unsubscribed'
        END AS subscription_status,

        COALESCE(gs.payment_amount, 0) AS subscription_amount,

        gs.start_date,
        gs.expire_date,
        gs.payment_method,
        gs.transaction_id

      FROM gym_management gm

      LEFT JOIN gym_subscriptions gs
        ON gs.gym_id = gm.gym_id

      WHERE gm.state = ?

      ORDER BY gm.city ASC, gm.gym_name ASC
      `,
      [state.trim()]
    );

    const fields = [
      { label: "Gym ID", value: "gym_id" },
      { label: "Gym Name", value: "gym_name" },
      { label: "City", value: "city" },
      { label: "State", value: "state" },
      { label: "Gym Status", value: "gym_status" },
      { label: "Admin Approval Status", value: "admin_approval_status" },
      { label: "Verified", value: "verified" },
      { label: "Zymgoo Trusted", value: "zymgoo_trusted" },
      { label: "Subscription Status", value: "subscription_status" },
      { label: "Subscription Amount", value: "subscription_amount" },
      { label: "Subscription Start Date", value: "start_date" },
      { label: "Subscription Expiry Date", value: "expire_date" },
      { label: "Payment Method", value: "payment_method" },
      { label: "Transaction ID", value: "transaction_id" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(gyms);

    const safeStateName = state
      .trim()
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeStateName}-gym-analytics.csv"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("State CSV export error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export state analytics report",
      error: error.message,
    });
  }
};
module.exports = {
  getGymAnalytics,
  exportGymAnalyticsSummary,
  exportGymAnalyticsWithFilters,
  exportStateAnalyticsCSV,
};