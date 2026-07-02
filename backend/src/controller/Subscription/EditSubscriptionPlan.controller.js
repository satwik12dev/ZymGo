const pool = require("../../config/pool");

const editSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid subscription plan ID is required",
      });
    }

    const [existingPlans] = await pool.query(
      `SELECT * FROM subscription_plans WHERE id = ? LIMIT 1`,
      [id]
    );

    if (existingPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const allowedFields = [
      "plan_name",
      "plan_code",
      "plan_duration",
      "max_branches",
      "max_members",
      "max_staff",
      "features",
      "plan_description",
      "is_active",
      "plan_badge",
      "display_order",
      "plan_price",
    ];

    const updateFields = [];
    const values = [];

    for (const field of allowedFields) {
      if (body[field] === undefined) continue;

      let value = body[field];

      if (field === "plan_name") {
        value = String(value).trim();

        if (!value) {
          return res.status(400).json({
            success: false,
            message: "Plan name cannot be empty",
          });
        }
      }

      if (field === "plan_code") {
        value = value ? String(value).trim().toUpperCase() : null;

        if (value) {
          const [duplicatePlan] = await pool.query(
            `
            SELECT id
            FROM subscription_plans
            WHERE plan_code = ? AND id != ?
            LIMIT 1
            `,
            [value, id]
          );

          if (duplicatePlan.length > 0) {
            return res.status(409).json({
              success: false,
              message: "Plan code already exists",
            });
          }
        }
      }

      if (
        field === "plan_duration" ||
        field === "max_branches" ||
        field === "max_members" ||
        field === "max_staff"
      ) {
        value = Number(value);

        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a valid positive number`,
          });
        }

        if (field === "plan_duration" && value <= 0) {
          return res.status(400).json({
            success: false,
            message: "Plan duration must be greater than 0",
          });
        }
      }

      if (field === "plan_price") {
        value = Number(value);

        if (Number.isNaN(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: "Plan price must be a valid non-negative number",
          });
        }

        value = String(value);
      }

      if (field === "features") {
        if (Array.isArray(value)) {
          value = JSON.stringify(
            value
              .map((feature) => String(feature).trim())
              .filter(Boolean)
          );
        } else if (typeof value === "string") {
          value = JSON.stringify(
            value
              .split(",")
              .map((feature) => feature.trim())
              .filter(Boolean)
          );
        } else {
          return res.status(400).json({
            success: false,
            message: "Features must be an array or comma-separated string",
          });
        }
      }

      if (field === "is_active") {
        value = value ? 1 : 0;
      }

      if (
        field === "plan_description" ||
        field === "plan_badge"
      ) {
        value = value ? String(value).trim() : null;
      }

      if (field === "display_order") {
        value = value !== null ? String(value) : null;
      }

      updateFields.push(`${field} = ?`);
      values.push(value);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    values.push(id);

    await pool.query(
      `
      UPDATE subscription_plans
      SET ${updateFields.join(", ")}
      WHERE id = ?
      `,
      values
    );

    const [updatedPlans] = await pool.query(
      `SELECT * FROM subscription_plans WHERE id = ?`,
      [id]
    );

    const updatedPlan = updatedPlans[0];

    let parsedFeatures = [];

    try {
      parsedFeatures = JSON.parse(updatedPlan.features || "[]");
    } catch {
      parsedFeatures = updatedPlan.features
        ? updatedPlan.features.split(",").map((item) => item.trim())
        : [];
    }

    return res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      data: {
        ...updatedPlan,
        is_active: Boolean(updatedPlan.is_active),
        features: parsedFeatures,
      },
    });
  } catch (error) {
    console.error("Edit subscription plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subscription plan",
      error: error.message,
    });
  }
};

module.exports = editSubscriptionPlan;