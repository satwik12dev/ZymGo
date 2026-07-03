const pool = require("../../config/pool");

const addBanner = async (req, res) => {
  try {
    const {
      title,
      banner_type,
      state,
      city,
      target_type,
      cta_text,
      cta_type,
      cta_value,
      start_date,
      end_date,
      priority,
      is_active,
      screen_position,
    } = req.body;

    const allowedBannerTypes = ["image", "video", "html"];
    const allowedTargetTypes = ["all", "state", "city"];
    const allowedCtaTypes = ["url", "phone", "whatsapp", "app_screen"];
    const allowedScreenPositions = ["Home", "Findgym", "Ecommerce"];

    if (!title || !banner_type || !target_type || !cta_value || !screen_position) {
      return res.status(400).json({
        success: false,
        message:
          "title, banner_type, target_type, cta_value and screen_position are required",
      });
    }

    if (!allowedBannerTypes.includes(banner_type)) {
      return res.status(400).json({
        success: false,
        message: "banner_type must be image, video or html",
      });
    }

    if (!allowedTargetTypes.includes(target_type)) {
      return res.status(400).json({
        success: false,
        message: "target_type must be all, state or city",
      });
    }

    if (!allowedCtaTypes.includes(cta_type)) {
      return res.status(400).json({
        success: false,
        message: "cta_type must be url, phone, whatsapp or app_screen",
      });
    }

    if (!allowedScreenPositions.includes(screen_position)) {
      return res.status(400).json({
        success: false,
        message: "screen_position must be Home, Findgym or Ecommerce",
      });
    }

    if (target_type === "state" && !state) {
      return res.status(400).json({
        success: false,
        message: "state is required when target_type is state",
      });
    }

    if (target_type === "city" && (!state || !city)) {
      return res.status(400).json({
        success: false,
        message: "state and city are required when target_type is city",
      });
    }

    if ((banner_type === "image" || banner_type === "video") && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image/video file is required",
      });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    const [result] = await pool.query(
      `INSERT INTO advertisement_banners (
        title,
        image_url,
        banner_type,
        state,
        city,
        target_type,
        cta_text,
        cta_type,
        cta_value,
        start_date,
        end_date,
        priority,
        is_active,
        impressions,
        clicks,
        screen_position,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        imageUrl,
        banner_type,
        target_type === "all" ? null : state,
        target_type === "city" ? city : null,
        target_type,
        cta_text || null,
        cta_type || null,
        cta_value,
        start_date || null,
        end_date || null,
        priority || 1,
        is_active ?? 1,
        0,
        0,
        screen_position,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Advertisement banner added successfully",
      banner_id: result.insertId,
      data: {
        id: result.insertId,
        title,
        image_url: imageUrl,
        banner_type,
        state: target_type === "all" ? null : state,
        city: target_type === "city" ? city : null,
        target_type,
        cta_text: cta_text || null,
        cta_type: cta_type || null,
        cta_value,
        start_date: start_date || null,
        end_date: end_date || null,
        priority: priority || 1,
        is_active: is_active ?? 1,
        impressions: 0,
        clicks: 0,
        screen_position,
      },
    });
  } catch (error) {
    console.error("Add Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add advertisement banner",
      error: error.message,
    });
  }
};

module.exports = {
  addBanner,
};