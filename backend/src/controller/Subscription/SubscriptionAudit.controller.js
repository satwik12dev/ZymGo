const pool = require("../../config/pool");

/*
====================================================
GET SUBSCRIPTION AUDIT SUMMARY
GET /subscription-audit/summary
====================================================
*/
const getSubscriptionAuditSummary = async (req, res) => {
  try {
    const [summary] = await pool.query(`
      SELECT
        COUNT(*) AS total_actions,

        SUM(
          CASE
            WHEN action = 'ASSIGNMENT' THEN 1
            ELSE 0
          END
        ) AS assignments,

        SUM(
          CASE
            WHEN action = 'RENEWAL' THEN 1
            ELSE 0
          END
        ) AS renewals,

        SUM(
          CASE
            WHEN action = 'CANCELLATION' THEN 1
            ELSE 0
          END
        ) AS cancellations,

        COUNT(DISTINCT admin_id) AS admins_involved

      FROM subscription_audit_logs
    `);

    return res.status(200).json({
      success: true,
      message: "Subscription audit summary fetched successfully",
      data: {
        total_actions: Number(summary[0].total_actions || 0),
        assignments: Number(summary[0].assignments || 0),
        renewals: Number(summary[0].renewals || 0),
        cancellations: Number(summary[0].cancellations || 0),
        admins_involved: Number(summary[0].admins_involved || 0),
      },
    });
  } catch (error) {
    console.error("Subscription Audit Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription audit summary",
      error: error.message,
    });
  }
};

/*
====================================================
GET ALL SUBSCRIPTION AUDIT LOGS
GET /subscription-audit?page=1&limit=10
&search=kodexive
&admin_id=1
&from_date=2026-07-01
&to_date=2026-07-03
&action=ASSIGNMENT
====================================================
*/
const getSubscriptionAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 11,
      search = "",
      admin_id = "",
      from_date = "",
      to_date = "",
      action = "",
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const offset = (currentPage - 1) * pageLimit;

    let whereClause = " WHERE 1 = 1 ";
    const values = [];

    if (search) {
      whereClause += `
        AND (
          sal.gym_id LIKE ?
          OR sal.plan_name LIKE ?
          OR sal.admin_name LIKE ?
          OR sal.details LIKE ?
        )
      `;

      const searchValue = `%${search}%`;

      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    if (admin_id) {
      whereClause += " AND sal.admin_id = ? ";
      values.push(admin_id);
    }

    if (action) {
      whereClause += " AND sal.action = ? ";
      values.push(action);
    }

    if (from_date) {
      whereClause += " AND DATE(sal.created_at) >= ? ";
      values.push(from_date);
    }

    if (to_date) {
      whereClause += " AND DATE(sal.created_at) <= ? ";
      values.push(to_date);
    }

    const [countResult] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM subscription_audit_logs sal
      ${whereClause}
      `,
      values
    );

    const totalLogs = Number(countResult[0].total || 0);

    const [logs] = await pool.query(
      `
      SELECT
        sal.id,
        sal.gym_id,
        sal.subscription_id,
        sal.subscription_plan_id,
        sal.plan_name,

        sal.admin_id,
        sal.admin_name,

        sal.action,

        sal.old_amount,
        sal.new_amount,

        sal.old_expire_date,
        sal.new_expire_date,

        sal.details,
        sal.ip_address,
        sal.user_agent,

        sal.created_at

      FROM subscription_audit_logs sal
      ${whereClause}
      ORDER BY sal.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...values, pageLimit, offset]
    );

    return res.status(200).json({
      success: true,
      message: "Subscription audit logs fetched successfully",
      pagination: {
        current_page: currentPage,
        limit: pageLimit,
        total_logs: totalLogs,
        total_pages: Math.ceil(totalLogs / pageLimit),
      },
      data: logs,
    });
  } catch (error) {
    console.error("Get Subscription Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription audit logs",
      error: error.message,
    });
  }
};

/*
====================================================
GET ADMINS FOR FILTER DROPDOWN
GET /subscription-audit/admins
====================================================
*/
const getSubscriptionAuditAdmins = async (req, res) => {
  try {
    const [admins] = await pool.query(`
      SELECT DISTINCT
        admin_id,
        admin_name
      FROM subscription_audit_logs
      WHERE admin_id IS NOT NULL
      ORDER BY admin_name ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Audit admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    console.error("Get Subscription Audit Admins Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit admins",
      error: error.message,
    });
  }
};


const getSubscriptionAuditfindLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      admin_id = "",
      from_date = "",
      to_date = "",
      action = "",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.max(Number(limit) || 10, 1);
    const offset = (currentPage - 1) * pageLimit;

    let whereClause = " WHERE 1 = 1 ";
    const values = [];

    // Search gym, plan, admin, details, audit log ID, subscription ID
    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const searchValue = `%${cleanSearch}%`;

      if (!isNaN(Number(cleanSearch))) {
        whereClause += `
          AND (
            sal.id = ?
            OR sal.subscription_id = ?
            OR sal.gym_id LIKE ?
            OR sal.plan_name LIKE ?
            OR sal.admin_name LIKE ?
            OR sal.details LIKE ?
          )
        `;

        values.push(
          Number(cleanSearch),
          Number(cleanSearch),
          searchValue,
          searchValue,
          searchValue,
          searchValue
        );
      } else {
        whereClause += `
          AND (
            sal.gym_id LIKE ?
            OR sal.plan_name LIKE ?
            OR sal.admin_name LIKE ?
            OR sal.details LIKE ?
          )
        `;

        values.push(
          searchValue,
          searchValue,
          searchValue,
          searchValue
        );
      }
    }

    // Employee dropdown filter
    if (admin_id && admin_id !== "all") {
      whereClause += ` AND sal.admin_id = ? `;
      values.push(Number(admin_id));
    }

    // Optional action filter
    if (action && action !== "all") {
      whereClause += ` AND sal.action = ? `;
      values.push(action.toUpperCase());
    }

    // From date filter
    if (from_date) {
      whereClause += ` AND DATE(sal.created_at) >= ? `;
      values.push(from_date);
    }

    // To date filter
    if (to_date) {
      whereClause += ` AND DATE(sal.created_at) <= ? `;
      values.push(to_date);
    }

    const [countResult] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM subscription_audit_logs sal
      ${whereClause}
      `,
      values
    );

    const totalLogs = Number(countResult[0].total || 0);

    const [logs] = await pool.query(
      `
      SELECT
        sal.id,
        sal.gym_id,
        sal.subscription_id,
        sal.subscription_plan_id,
        sal.plan_name,
        sal.admin_id,
        sal.admin_name,
        sal.action,
        sal.old_amount,
        sal.new_amount,
        sal.old_expire_date,
        sal.new_expire_date,
        sal.details,
        sal.ip_address,
        sal.user_agent,
        sal.created_at
      FROM subscription_audit_logs sal
      ${whereClause}
      ORDER BY sal.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...values, pageLimit, offset]
    );

    return res.status(200).json({
      success: true,
      message: "Subscription audit logs fetched successfully",
      applied_filters: {
        search: search || null,
        admin_id: admin_id || null,
        from_date: from_date || null,
        to_date: to_date || null,
        action: action || null,
      },
      pagination: {
        current_page: currentPage,
        limit: pageLimit,
        total_logs: totalLogs,
        total_pages: Math.ceil(totalLogs / pageLimit),
      },
      data: logs,
    });
  } catch (error) {
    console.error("Get Subscription Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription audit logs",
      error: error.message,
    });
  }
};

module.exports = {
  getSubscriptionAuditSummary,
  getSubscriptionAuditLogs,
  getSubscriptionAuditAdmins,
  getSubscriptionAuditfindLogs
};