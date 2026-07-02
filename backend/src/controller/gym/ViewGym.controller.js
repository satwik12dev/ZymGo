const pool = require("../../config/pool");

const viewGymById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid gym database id is required.",
      });
    }

    /* ---------------- Fetch Gym ---------------- */

    const [gymRows] = await pool.query(
      `
      SELECT
        id,
        owner_id,
        gym_id,
        gym_name,
        address,
        city,
        city_id,
        area_id,
        subarea_id,
        area,
        sub_area,
        pincode,
        state,
        latitude,
        longitude,
        mobile,
        email,
        admin_approval_status,
        admin_approved_date,
        admin_remarks,
        submitted_for_review,
        submitted_date,
        date_time,
        block_date,
        status,
        gym_type,
        timing,
        description,
        website,
        created_at,
        updated_at,
        is_verified,
        is_zymgoo_trusted,
        is_top_search,
        admission_fee,
        meta_title,
        meta_description,
        meta_keywords
      FROM gym_management
      WHERE id = ?
      LIMIT 1
      `,
      
      [id]
    );

    if (!gymRows.length) {
      return res.status(404).json({
        success: false,
        message: "Gym not found.",
      });
    }

    const gym = gymRows[0];

    /* ---------------- Fetch Owner ---------------- */

    const [ownerRows] = await pool.query(
      `
      SELECT
        id,
        owner_id,
        owner_name,
        mobile,
        email,
        email_verify,
        address,
        city,
        pincode,
        state,
        country,
        user_status,
        profile_status,
        status,
        block_status,
        type,
        version,
        start_date,
        date,
        date_time
      FROM registration
      WHERE owner_id = ?
      LIMIT 1
      `,
      [gym.owner_id]
    );

    const owner = ownerRows[0] || null;

    /* ---------------- Fetch Subscriptions ---------------- */

    const [subscriptions] = await pool.query(
      `
      SELECT
        gs.id,
        gs.gym_id,
        gs.owner_id,
        gs.subscription_plan_id,
        gs.sales_person_id,
        gs.start_date,
        gs.expire_date,
        gs.status,
        gs.payment_amount,
        gs.payment_date,
        gs.payment_method,
        gs.transaction_id,
        gs.last_invoice_id,
        gs.auto_renew,
        gs.created_at,
        gs.assigned_by_admin_id,
        gs.updated_at,
        gs.notes
      FROM gym_subscriptions gs
      WHERE gs.gym_id = ?
         OR (gs.gym_id IS NULL AND gs.owner_id = ?)
      ORDER BY gs.created_at DESC
      `,
      [gym.gym_id, gym.owner_id]
    );

    const today = new Date().toISOString().slice(0, 10);

    const activeSubscriptions = subscriptions.filter((subscription) => {
      const expiryDate = String(subscription.expire_date).slice(0, 10);

      return (
        subscription.status === "active" &&
        expiryDate >= today
      );
    });

    const latestSubscription = subscriptions[0] || null;

    const subscriptionRevenue = subscriptions.reduce((total, subscription) => {
      return total + Number(subscription.payment_amount || 0);
    }, 0);

    /* ---------------- Fetch Invoice Stats ---------------- */

    const [invoiceStatsRows] = await pool.query(
      `
      SELECT
        COUNT(*) AS invoices,
        COALESCE(SUM(total), 0) AS revenue,
        COALESCE(SUM(balance_due), 0) AS pendingAmount
      FROM invoices
      WHERE gym_id = ?
         OR (gym_id IS NULL AND owner_id = ?)
      `,
      [gym.gym_id, gym.owner_id]
    );

    const invoiceStats = invoiceStatsRows[0];

    /* ---------------- Fetch Paid Amount ---------------- */

    const [paidRows] = await pool.query(
      `
      SELECT
        COALESCE(SUM(p.amount), 0) AS paidAmount
      FROM payments p
      INNER JOIN invoices i
        ON i.id = p.invoice_id
      WHERE
        (
          i.gym_id = ?
          OR (i.gym_id IS NULL AND i.owner_id = ?)
        )
        AND p.status = "completed"
      `,
      [gym.gym_id, gym.owner_id]
    );

    const paidAmount = Number(paidRows[0].paidAmount || 0);

    /* ---------------- Fetch Review Stats ---------------- */

    const [reviewRows] = await pool.query(
      `
      SELECT
        COUNT(*) AS reviews,
        COALESCE(ROUND(AVG(rating), 1), 0) AS rating
      FROM gym_reviews
      WHERE gym_id = ?
        AND status = "approved"
      `,
      [gym.gym_id]
    );

    const reviewStats = reviewRows[0];

    /* ---------------- Fetch Gym Member Count ---------------- */

    const [memberRows] = await pool.query(
      `
      SELECT
        COUNT(*) AS gymMembers
      FROM member
      WHERE gym_id = ?
        AND status = "1"
      `,
      [gym.gym_id]
    );

    const gymMembers = Number(memberRows[0].gymMembers || 0);

    /* ---------------- Build UI Overview ---------------- */

    const overview = {
      activeSubscriptions: activeSubscriptions.length,

      revenue: Number(invoiceStats.revenue || 0),

      invoices: Number(invoiceStats.invoices || 0),

      paidAmount,

      pendingAmount: Number(invoiceStats.pendingAmount || 0),

      subscriptionRevenue,

      rating:
        Number(reviewStats.reviews) > 0
          ? Number(reviewStats.rating)
          : null,

      reviews: Number(reviewStats.reviews || 0),

      gymMembers,

      planName: latestSubscription
        ? `Plan ID: ${latestSubscription.subscription_plan_id}`
        : "No Plan",

      subscriptionStatus:
        activeSubscriptions.length > 0
          ? "Subscribed"
          : "Unsubscribed",

      latestSubscription: latestSubscription
        ? {
            id: latestSubscription.id,
            subscription_plan_id:
              latestSubscription.subscription_plan_id,
            start_date: latestSubscription.start_date,
            expire_date: latestSubscription.expire_date,
            status: latestSubscription.status,
            payment_amount: Number(
              latestSubscription.payment_amount || 0
            ),
            payment_date: latestSubscription.payment_date,
            payment_method: latestSubscription.payment_method,
            transaction_id: latestSubscription.transaction_id,
            auto_renew: Boolean(latestSubscription.auto_renew),
            notes: latestSubscription.notes,
          }
        : null,
    };

    /* ---------------- Extra UI-Friendly Gym Data ---------------- */

    const gymDetails = {
      ...gym,

      account_status:
        String(gym.status) === "1"
          ? "Active"
          : "Inactive",

      approval_status:
        gym.admin_approval_status || "pending",

      initials: (gym.gym_name || "GY")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),

      full_location: [gym.city, gym.state]
        .filter(Boolean)
        .join(", "),

      complete_address: [
        gym.address,
        gym.area,
        gym.sub_area,
        gym.city,
        gym.state,
        gym.pincode,
        "India",
      ]
        .filter(Boolean)
        .join(", "),
    };

    return res.status(200).json({
      success: true,
      message: "Gym details fetched successfully.",

      gym: gymDetails,

      owner,

      overview,

      subscriptions,
    });
  } catch (error) {
    console.error("View gym error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch gym details.",
      error: error.message,
    });
  }
};

module.exports = {
  viewGymById,
};