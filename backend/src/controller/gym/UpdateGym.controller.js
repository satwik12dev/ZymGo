const pool = require("../../config/pool");

const updateGym = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "gym_name",
      "address",
      "city",
      "city_id",
      "area_id",
      "subarea_id",
      "area",
      "sub_area",
      "pincode",
      "state",
      "latitude",
      "longitude",
      "mobile",
      "email",
      "admin_approval_status",
      "admin_remarks",
      "submitted_for_review",
      "status",
      "gym_type",
      "timing",
      "description",
      "website",
      "is_verified",
      "is_zymgoo_trusted",
      "is_top_search",
      "admission_fee",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "block_date",
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      // Only update a field when it was actually sent in request body.
      // Empty string is allowed if user intentionally wants to clear it.
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        message: "Send at least one field to update.",
      });
    }

    const [existingGym] = await pool.query(
      `SELECT id FROM gym_management WHERE id = ?`,
      [id]
    );

    if (!existingGym.length) {
      return res.status(404).json({
        success: false,
        message: "Gym not found.",
      });
    }

    // Check duplicate mobile only when mobile is being changed
    if (Object.prototype.hasOwnProperty.call(req.body, "mobile")) {
      const mobile = String(req.body.mobile).trim();

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid 10-digit mobile number.",
        });
      }

      const [mobileExists] = await pool.query(
        `SELECT id FROM gym_management WHERE mobile = ? AND id != ?`,
        [mobile, id]
      );

      if (mobileExists.length) {
        return res.status(400).json({
          success: false,
          message: "This mobile number is already used by another gym.",
        });
      }
    }

    // Check duplicate email only when email is being changed
    if (
      Object.prototype.hasOwnProperty.call(req.body, "email") &&
      req.body.email
    ) {
      const email = String(req.body.email).trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid email address.",
        });
      }

      const [emailExists] = await pool.query(
        `SELECT id FROM gym_management WHERE email = ? AND id != ?`,
        [email, id]
      );

      if (emailExists.length) {
        return res.status(400).json({
          success: false,
          message: "This email address is already used by another gym.",
        });
      }
    }

    // Automatically set approval date when approval becomes approved
    if (req.body.admin_approval_status === "approved") {
      updates.push("admin_approved_date = ?");
      values.push(new Date());
    }

    // Automatically set submitted date when submitted for review
    if (Number(req.body.submitted_for_review) === 1) {
      updates.push("submitted_date = ?");
      values.push(new Date());
    }

    values.push(id);

    await pool.query(
      `
        UPDATE gym_management
        SET ${updates.join(", ")}
        WHERE id = ?
      `,
      values
    );

    const [updatedGym] = await pool.query(
      `SELECT * FROM gym_management WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Gym updated successfully.",
      gym: updatedGym[0],
    });
  } catch (error) {
    console.error("Update gym error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update gym.",
      error: error.message,
    });
  }
};

module.exports = { updateGym };