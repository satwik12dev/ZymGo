const pool = require("../../config/pool");

const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid subscription plan ID is required",
      });
    }

    const [existingPlans] = await pool.query(
      `
      SELECT id, plan_name
      FROM subscription_plans
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (existingPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const deletedPlan = existingPlans[0];

    await pool.query(
      `
      DELETE FROM subscription_plans
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
      data: {
        id: deletedPlan.id,
        plan_name: deletedPlan.plan_name,
      },
    });
  } catch (error) {
    console.error("Delete subscription plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subscription plan",
      error: error.message,
    });
  }
};

module.exports = deleteSubscriptionPlan;