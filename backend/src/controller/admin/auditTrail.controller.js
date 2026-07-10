const db = require("../../config/pool");

const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const {
      from_date,
      to_date,
      action,
      search,
      status,
      user_id,
    } = req.query;

    let whereClause = "WHERE 1 = 1";
    const params = [];

    if (from_date) {
      whereClause += " AND DATE(l.created_at) >= ?";
      params.push(from_date);
    }

    if (to_date) {
      whereClause += " AND DATE(l.created_at) <= ?";
      params.push(to_date);
    }

    if (action && action !== "All") {
      whereClause += " AND l.action = ?";
      params.push(String(action).toUpperCase());
    }

    if (status && status !== "All") {
      whereClause += " AND l.status = ?";
      params.push(String(status).toUpperCase());
    }

    if (user_id) {
      whereClause += " AND l.user_id = ?";
      params.push(Number(user_id));
    }

    if (search && String(search).trim()) {
      const keyword = `%${String(search).trim()}%`;

      whereClause += `
        AND (
          u.name LIKE ?
          OR u.username LIKE ?
          OR u.email LIKE ?
          OR l.ip_address LIKE ?
          OR l.action LIKE ?
          OR l.status LIKE ?
        )
      `;

      params.push(
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword
      );
    }

    const [logs] = await db.query(
      `
      SELECT
        l.id,
        l.user_id,
        l.action,
        l.ip_address,
        l.status,
        l.created_at,

        u.name AS admin_name,
        u.username AS admin_username,
        u.email AS admin_email,
        r.role_name

      FROM logs l
      INNER JOIN users u ON u.id = l.user_id
      LEFT JOIN roles r ON r.id = u.role_id

      ${whereClause}

      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM logs l
      INNER JOIN users u ON u.id = l.user_id
      ${whereClause}
      `,
      params
    );

    return res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      data: logs,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

const getAuditFilterOptions = async (req, res) => {
  try {
    const { name, from_date, to_date } = req.query;

    const params = [];
    let whereClause = "WHERE 1 = 1";

    if (name && String(name).trim()) {
      const keyword = `%${String(name).trim()}%`;

      whereClause += `
        AND (
          u.name LIKE ?
          OR u.username LIKE ?
          OR u.email LIKE ?
        )
      `;

      params.push(keyword, keyword, keyword);
    }

    if (from_date) {
      whereClause += ` AND DATE(l.created_at) >= ?`;
      params.push(from_date);
    }

    if (to_date) {
      whereClause += ` AND DATE(l.created_at) <= ?`;
      params.push(to_date);
    }

    // Users who performed actions in the selected date range
    const [users] = await db.query(
      `
      SELECT DISTINCT
        u.id,
        u.name,
        u.username,
        u.email,
        r.role_name
      FROM logs l
      INNER JOIN users u ON u.id = l.user_id
      LEFT JOIN roles r ON r.id = u.role_id
      ${whereClause}
      ORDER BY u.name ASC
      `,
      params
    );

    // Actions performed in the selected date range
    const [actions] = await db.query(
      `
      SELECT DISTINCT l.action
      FROM logs l
      INNER JOIN users u ON u.id = l.user_id
      ${whereClause}
      ORDER BY l.action ASC
      `,
      params
    );

    // Statuses present in the selected date range
    const [statuses] = await db.query(
      `
      SELECT DISTINCT l.status
      FROM logs l
      INNER JOIN users u ON u.id = l.user_id
      ${whereClause}
      ORDER BY l.status ASC
      `,
      params
    );

    return res.status(200).json({
      success: true,
      data: {
        users,
        actions: actions.map((item) => item.action),
        statuses: statuses.map((item) => item.status),
      },
    });
  } catch (error) {
    console.error("Get audit filter options error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit filter options",
      error: error.message,
    });
  }
};

const getAuditStats = async (req, res) => {
  try {
    const [[totalLogs]] = await db.query(`
      SELECT COUNT(*) AS total_logs
      FROM logs
    `);

    const [[todayLogs]] = await db.query(`
      SELECT COUNT(*) AS today_logs
      FROM logs
      WHERE DATE(created_at) = CURDATE()
    `);

    const [[successfulLogs]] = await db.query(`
      SELECT COUNT(*) AS successful_logs
      FROM logs
      WHERE status = 'SUCCESS'
    `);

    const [[failedLogs]] = await db.query(`
      SELECT COUNT(*) AS failed_logs
      FROM logs
      WHERE status = 'FAILED'
    `);

    return res.status(200).json({
      success: true,
      data: {
        total_logs: totalLogs.total_logs,
        today_logs: todayLogs.today_logs,
        successful_logs: successfulLogs.successful_logs,
        failed_logs: failedLogs.failed_logs,
      },
    });
  } catch (error) {
    console.error("Get audit stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit stats",
      error: error.message,
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditFilterOptions,
  getAuditStats,
};