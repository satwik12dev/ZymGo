const pool = require("../../config/pool");

/*
====================================================
GET ALL SUBSCRIPTION PLANS
GET /subscription-plans
====================================================
*/
const getAllSubscriptionPlans = async (req, res) => {
  try {
    const [plans] = await pool.query(`
      SELECT
        id,
        plan_name,
        plan_code,
        plan_duration,
        max_branches,
        max_members,
        max_staff,
        features,
        plan_description,
        is_active,
        created_at,
        plan_badge,
        display_order,
        plan_price
      FROM subscription_plans
      ORDER BY
        CAST(display_order AS UNSIGNED) ASC,
        id ASC
    `);

    const formattedPlans = plans.map((plan) => {
      let parsedFeatures = [];

      try {
        parsedFeatures =
          typeof plan.features === "string"
            ? JSON.parse(plan.features)
            : plan.features || [];
      } catch (error) {
        parsedFeatures = plan.features
          ? plan.features.split(",").map((feature) => feature.trim())
          : [];
      }

      return {
        ...plan,
        is_active: Boolean(plan.is_active),
        features: parsedFeatures,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plans fetched successfully",
      total_plans: formattedPlans.length,
      data: formattedPlans,
    });
  } catch (error) {
    console.error("Get subscription plans error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plans",
      error: error.message,
    });
  }
};

/*
====================================================
BUY / ASSIGN GYM SUBSCRIPTION
POST /gym-subscription/buy

Body:
{
  "gym_id": "GYM001",
  "subscription_plan_id": 1,
  "payment_amount": 999
}
====================================================
*/
const buyGymSubscription = async (req, res) => {
  let connection;

  try {
    const {
      gym_id,
      subscription_plan_id,
      payment_amount,
    } = req.body;

    const admin_id =
      req.user?.id ||
      req.user?.admin_id ||
      req.user?.user_id;

    if (!gym_id || !subscription_plan_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id and subscription_plan_id are required",
      });
    }

    if (!admin_id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication data not found",
      });
    }

    connection = await pool.getConnection();

    await connection.beginTransaction();

    /*
    ------------------------------------------------
    1. GET GYM AND OWNER ID
    ------------------------------------------------
    */
    const [gymRows] = await connection.query(
  `
  SELECT
    gym_id,
    owner_id,
    gym_name
  FROM gym_management
  WHERE gym_id = ?
  `,
  [gym_id]
);

if (gymRows.length === 0) {
  await connection.rollback();

  return res.status(404).json({
    success: false,
    message: "Gym not found",
  });
}

const gym = gymRows[0];

if (!gym.owner_id) {
  await connection.rollback();

  return res.status(400).json({
    success: false,
    message: "Gym owner_id is missing for this gym",
  });
}

const owner_id = gym.owner_id;
const gym_name = gym.gym_name;

    /*
    ------------------------------------------------
    2. GET SUBSCRIPTION PLAN
    ------------------------------------------------
    */
    const [planRows] = await connection.query(
      `
      SELECT
        id,
        plan_name,
        plan_code,
        plan_duration,
        plan_price,
        is_active
      FROM subscription_plans
      WHERE id = ?
      `,
      [subscription_plan_id]
    );

    if (planRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const plan = planRows[0];

    if (!plan.is_active) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This subscription plan is inactive",
      });
    }

    const finalAmount =
      payment_amount !== undefined &&
      payment_amount !== null &&
      payment_amount !== ""
        ? Number(payment_amount)
        : Number(plan.plan_price);

    if (Number.isNaN(finalAmount) || finalAmount < 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "payment_amount must be a valid positive number",
      });
    }

    /*
    ------------------------------------------------
    3. CALCULATE EXPIRY DATE
    ------------------------------------------------
    */
    const [expiryRows] = await connection.query(
      `
      SELECT DATE_ADD(CURDATE(), INTERVAL ? DAY) AS expire_date
      `,
      [Number(plan.plan_duration)]
    );

    const expire_date = expiryRows[0].expire_date;

    /*
    ------------------------------------------------
    4. GET ADMIN NAME FROM USERS TABLE
    ------------------------------------------------
    */
    const [adminRows] = await connection.query(
      `
      SELECT
        id,
        name,
        email
      FROM users
      WHERE id = ?
      `,
      [admin_id]
    );

    const admin_name =
      adminRows[0]?.name ||
      req.user?.name ||
      req.user?.admin_name ||
      "Super Admin";

    /*
    ------------------------------------------------
    5. CHECK ACTIVE SUBSCRIPTION
    Prevent duplicate active subscriptions.
    ------------------------------------------------
    */
    const [existingSubscriptions] = await connection.query(
      `
      SELECT id
      FROM gym_subscriptions
      WHERE gym_id = ?
      AND status = 'ACTIVE'
      ORDER BY id DESC
      LIMIT 1
      `,
      [gym_id]
    );

    if (existingSubscriptions.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message:
          "This gym already has an active subscription. Renew or cancel it first.",
      });
    }

    /*
    ------------------------------------------------
    6. INSERT INTO GYM SUBSCRIPTIONS
    ------------------------------------------------
    */
    const [subscriptionResult] = await connection.query(
  `
  INSERT INTO gym_subscriptions (
    gym_id,
    owner_id,
    subscription_plan_id,
    assigned_by_admin_id,
    payment_amount,
    start_date,
    expire_date,
    status
  )
  VALUES (?, ?, ?, ?, ?, CURDATE(), ?, 'ACTIVE')
  `,
  [
    gym_id,
    owner_id,
    subscription_plan_id,
    admin_id,
    finalAmount,
    expire_date,
  ]
);

    const subscription_id = subscriptionResult.insertId;

    /*
    ------------------------------------------------
    7. GET IP ADDRESS AND USER AGENT
    ------------------------------------------------
    */
    const ip_address =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      null;

    const user_agent = req.headers["user-agent"] || null;

    /*
    ------------------------------------------------
    8. INSERT INTO SUBSCRIPTION AUDIT LOG
    ------------------------------------------------
    */
    await connection.query(
      `
      INSERT INTO subscription_audit_logs (
        gym_id,
        subscription_id,
        subscription_plan_id,
        plan_name,
        admin_id,
        admin_name,
        action,
        old_amount,
        new_amount,
        old_expire_date,
        new_expire_date,
        details,
        ip_address,
        user_agent
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        gym_id,
        subscription_id,
        subscription_plan_id,
        plan.plan_name,
        admin_id,
        admin_name,
        "ASSIGNMENT",
        0,
        finalAmount,
        null,
        expire_date,
        `${plan.plan_name} assigned to ${gym_name || gym_id}`,
        ip_address,
        user_agent,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Gym subscription assigned successfully and audit log created",
      data: {
        subscription_id,
        gym_id,
        gym_name,
        owner_id,
        subscription_plan_id,
        plan_name: plan.plan_name,
        payment_amount: finalAmount,
        expire_date,
        status: "ACTIVE",
        assigned_by: {
          admin_id,
          admin_name,
        },
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Buy gym subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign gym subscription",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getGymSubscriptionStatus = async (req, res) => {
  try {
    const { gym_id } = req.params;

    const [subscriptions] = await pool.query(
      `
      SELECT
        gs.id AS subscription_id,
        gs.gym_id,
        gm.gym_name,
        gs.owner_id,
        sp.id AS subscription_plan_id,
        sp.plan_name,
        sp.plan_code,
        gs.payment_amount,
        gs.start_date,
        gs.expire_date,
        gs.status,
        gs.assigned_by_admin_id,
        u.name AS assigned_by,
        gs.created_at
      FROM gym_subscriptions gs
      LEFT JOIN gym_management gm ON gm.gym_id = gs.gym_id
      LEFT JOIN subscription_plans sp ON sp.id = gs.subscription_plan_id
      LEFT JOIN users u ON u.id = gs.assigned_by_admin_id
      WHERE gs.gym_id = ?
      ORDER BY gs.id DESC
      `,
      [gym_id]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subscription found for this gym",
      });
    }

    const activeSubscription = subscriptions.find(
  (item) => String(item.status || "").toUpperCase() === "ACTIVE"
);

return res.status(200).json({
  success: true,
  message: activeSubscription
    ? "Active subscription found"
    : "Subscription history found, but no active subscription",
  has_active_subscription: Boolean(activeSubscription),
  active_subscription: activeSubscription || null,
  subscription_history: subscriptions,
});
  } catch (error) {
    console.error("Get gym subscription status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gym subscription status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubscriptionPlans,
  buyGymSubscription,
  getGymSubscriptionStatus,
};