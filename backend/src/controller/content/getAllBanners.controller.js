const pool = require("../../config/pool");

const getAllBanners = async (req, res) => {
  try {
    const {
      id,
      title,
      screen_position,
      target_type,
      is_active,
      state,
      city,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const offset = (currentPage - 1) * pageLimit;

    const whereConditions = [];
    const values = [];

    // Get by banner ID
    if (id) {
      if (isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "id must be a valid number",
        });
      }

      whereConditions.push("id = ?");
      values.push(Number(id));
    }

    // Search title partially
    if (title) {
      whereConditions.push("title LIKE ?");
      values.push(`%${title}%`);
    }

    if (screen_position) {
      whereConditions.push("screen_position = ?");
      values.push(screen_position);
    }

    if (target_type) {
      whereConditions.push("target_type = ?");
      values.push(target_type);
    }

    if (is_active !== undefined) {
      if (!["0", "1"].includes(String(is_active))) {
        return res.status(400).json({
          success: false,
          message: "is_active must be 0 or 1",
        });
      }

      whereConditions.push("is_active = ?");
      values.push(Number(is_active));
    }

    if (state) {
      whereConditions.push("state LIKE ?");
      values.push(`%${state}%`);
    }

    if (city) {
      whereConditions.push("city LIKE ?");
      values.push(`%${city}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM advertisement_banners
       ${whereClause}`,
      values
    );

    const total = countRows[0].total;

    const [banners] = await pool.query(
      `SELECT
        id,
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
      FROM advertisement_banners
      ${whereClause}
      ORDER BY priority DESC, created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, pageLimit, offset]
    );

    // If searching by ID and no banner found
    if (id && banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully",
      total_banners: total,
      current_page: currentPage,
      total_pages: Math.ceil(total / pageLimit),
      limit: pageLimit,
      filters: {
        id: id || null,
        title: title || null,
        screen_position: screen_position || null,
        target_type: target_type || null,
        is_active: is_active ?? null,
        state: state || null,
        city: city || null,
      },
      data: banners,
    });
  } catch (error) {
    console.error("Get All Banners Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
};

module.exports = getAllBanners;