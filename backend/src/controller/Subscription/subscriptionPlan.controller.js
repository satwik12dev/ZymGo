const pool = require("../../config/pool");

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

module.exports = {
  getAllSubscriptionPlans,
};