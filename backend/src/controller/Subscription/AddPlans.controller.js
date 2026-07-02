const pool = require("../../config/pool");

const addSubscriptionPlan = async (req, res) => {
  try {
    const {
      plan_name,
      plan_code,
      plan_duration,
      max_branches = 1,
      max_members = 100,
      max_staff = 5,
      features = [],
      plan_description,
      is_active = 1,
      plan_badge,
      display_order,
      plan_price,
    } = req.body;

    if (!plan_name || !plan_duration || !plan_price) {
      return res.status(400).json({
        success: false,
        message: "Plan name, duration, and price are required",
      });
    }

    if (Number(plan_duration) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Plan duration must be greater than 0",
      });
    }

    if (Number(plan_price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Plan price cannot be negative",
      });
    }

    const normalizedPlanCode = plan_code?.trim().toUpperCase() || null;

    if (normalizedPlanCode) {
      const [existingPlan] = await pool.query(
        `SELECT id FROM subscription_plans WHERE plan_code = ? LIMIT 1`,
        [normalizedPlanCode]
      );

      if (existingPlan.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Plan code already exists",
        });
      }
    }

    let formattedFeatures = [];

    if (Array.isArray(features)) {
      formattedFeatures = features
        .map((feature) => String(feature).trim())
        .filter(Boolean);
    } else if (typeof features === "string") {
      formattedFeatures = features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);
    } else {
      return res.status(400).json({
        success: false,
        message: "Features must be an array or comma-separated string",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO subscription_plans
      (
        plan_name,
        plan_code,
        plan_duration,
        max_branches,
        max_members,
        max_staff,
        features,
        plan_description,
        is_active,
        plan_badge,
        display_order,
        plan_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        plan_name.trim(),
        normalizedPlanCode,
        Number(plan_duration),
        Number(max_branches),
        Number(max_members),
        Number(max_staff),
        JSON.stringify(formattedFeatures),
        plan_description?.trim() || null,
        is_active ? 1 : 0,
        plan_badge?.trim() || null,
        display_order?.toString() || null,
        plan_price.toString(),
      ]
    );

    const [newPlan] = await pool.query(
      `
      SELECT *
      FROM subscription_plans
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Subscription plan added successfully",
      data: {
        ...newPlan[0],
        is_active: Boolean(newPlan[0].is_active),
        features: JSON.parse(newPlan[0].features || "[]"),
      },
    });
  } catch (error) {
    console.error("Add subscription plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add subscription plan",
      error: error.message,
    });
  }
};

module.exports = addSubscriptionPlan;