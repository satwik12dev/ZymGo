const pool = require("../../config/pool");
const fs = require("fs");
const path = require("path");

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid banner id is required",
      });
    }

    const [existingRows] = await pool.query(
      "SELECT * FROM advertisement_banners WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const existingBanner = existingRows[0];

    const allowedBannerTypes = ["image", "video", "html"];
    const allowedTargetTypes = ["all", "state", "city"];
    const allowedCtaTypes = ["url", "phone", "whatsapp", "app_screen"];
    const allowedScreenPositions = ["Home", "Findgym", "Ecommerce"];

    const banner_type = req.body.banner_type ?? existingBanner.banner_type;
    const target_type = req.body.target_type ?? existingBanner.target_type;
    const cta_type = req.body.cta_type ?? existingBanner.cta_type;
    const screen_position =
      req.body.screen_position ?? existingBanner.screen_position;

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

    if (cta_type && !allowedCtaTypes.includes(cta_type)) {
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

    const title = req.body.title ?? existingBanner.title;
    const cta_text = req.body.cta_text ?? existingBanner.cta_text;
    const cta_value = req.body.cta_value ?? existingBanner.cta_value;
    const start_date = req.body.start_date ?? existingBanner.start_date;
    const end_date = req.body.end_date ?? existingBanner.end_date;
    const priority = req.body.priority ?? existingBanner.priority;
    const is_active = req.body.is_active ?? existingBanner.is_active;

    let state = req.body.state ?? existingBanner.state;
    let city = req.body.city ?? existingBanner.city;

    if (target_type === "all") {
      state = null;
      city = null;
    }

    if (target_type === "state") {
      city = null;

      if (!state) {
        return res.status(400).json({
          success: false,
          message: "state is required when target_type is state",
        });
      }
    }

    if (target_type === "city" && (!state || !city)) {
      return res.status(400).json({
        success: false,
        message: "state and city are required when target_type is city",
      });
    }

    let image_url = existingBanner.image_url;

    if (req.file) {
      image_url = `/uploads/banners/${req.file.filename}`;

      // Delete old uploaded file only when replacing it
      if (
        existingBanner.image_url &&
        existingBanner.image_url.startsWith("/uploads/banners/")
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          existingBanner.image_url.replace(/^\//, "")
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // Optional: update banner using external image/video URL
    if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    if ((banner_type === "image" || banner_type === "video") && !image_url) {
      return res.status(400).json({
        success: false,
        message: "banner_file or image_url is required for image/video banner",
      });
    }

    await pool.query(
      `UPDATE advertisement_banners SET
        title = ?,
        image_url = ?,
        banner_type = ?,
        state = ?,
        city = ?,
        target_type = ?,
        cta_text = ?,
        cta_type = ?,
        cta_value = ?,
        start_date = ?,
        end_date = ?,
        priority = ?,
        is_active = ?,
        screen_position = ?
      WHERE id = ?`,
      [
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
        screen_position,
        id,
      ]
    );

    const [updatedRows] = await pool.query(
      "SELECT * FROM advertisement_banners WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update banner",
      error: error.message,
    });
  }
};

module.exports = updateBanner;