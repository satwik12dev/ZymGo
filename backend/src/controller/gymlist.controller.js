const pool = require("../config/pool");

const getGymList = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 50,
      search = "",
      state = "",
      city = "",
      status = "",
      approval = "",
      sortBy = "created_at",
      order = "DESC",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params = [];

    // Search
    if (search) {
      where += `
        AND (
          gym_name LIKE ?
          OR gym_id LIKE ?
          OR mobile LIKE ?
          OR email LIKE ?
          OR owner_id LIKE ?
        )
      `;

      const keyword = `%${search}%`;

      params.push(
        keyword,
        keyword,
        keyword,
        keyword,
        keyword
      );
    }

    // Filters
    if (state) {
      where += " AND state = ?";
      params.push(state);
    }

    if (city) {
      where += " AND city = ?";
      params.push(city);
    }

    if (status !== "") {
      where += " AND status = ?";
      params.push(status);
    }

    if (approval) {
      where += " AND admin_approval_status = ?";
      params.push(approval);
    }

    // Total records
    const [count] = await pool.query(
      `
      SELECT COUNT(*) total
      FROM gym_management
      ${where}
      `,
      params
    );

    const totalRecords = count[0].total;

    // Gym List
    const [gyms] = await pool.query(
      `
      SELECT
          id,
          owner_id,
          gym_id,
          gym_name,
          mobile,
          email,
          address,
          city,
          state,
          pincode,
          gym_type,
          status,
          admin_approval_status,
          is_verified,
          is_zymgoo_trusted,
          is_top_search,
          created_at
      FROM gym_management
      ${where}
      ORDER BY ${sortBy} ${order}
      LIMIT ?
      OFFSET ?
      `,
      [...params, limit, offset]
    );

    // Dashboard Stats
    const [stats] = await pool.query(`
      SELECT
COUNT(*) AS total,
CAST(SUM(status='1') AS UNSIGNED) AS active,
CAST(SUM(status='0') AS UNSIGNED) AS inactive,
CAST(SUM(admin_approval_status='approved') AS UNSIGNED) AS approved,
CAST(SUM(admin_approval_status='pending') AS UNSIGNED) AS pending,
CAST(SUM(admin_approval_status='rejected') AS UNSIGNED) AS rejected,
CAST(SUM(is_verified=1) AS UNSIGNED) AS verified,
CAST(SUM(is_zymgoo_trusted=1) AS UNSIGNED) AS trusted,
CAST(SUM(is_top_search=1) AS UNSIGNED) AS topSearch
FROM gym_management;
    `);

    // State Dropdown
    const [states] = await pool.query(`
      SELECT DISTINCT state
      FROM gym_management
      WHERE state IS NOT NULL
      ORDER BY state
    `);

    // City Dropdown
    const [cities] = await pool.query(`
      SELECT DISTINCT city
      FROM gym_management
      WHERE city IS NOT NULL
      ORDER BY city
    `);
    const gymsWithNewId = gyms.map((gym, index) => ({
    ...gym,
    id: (page - 1) * limit + index + 1,
}));

    return res.status(200).json({
    success: true,

    gyms: gymsWithNewId,

    stats: stats[0],

    filters: {
        states,
        cities,
    },

    pagination: {
        currentPage: page,
        perPage: limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: page < Math.ceil(totalRecords / limit),
        hasPreviousPage: page > 1,
    },
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch gyms",
      error: error.message,
    });
  }
};

module.exports = {
  getGymList,
};