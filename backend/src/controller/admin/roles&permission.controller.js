const pool = require("../../config/pool");

/* =========================================================
   HELPERS
========================================================= */
const makeSlug = (value) => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const groupPermissionsByModule = (permissions) => {
  return permissions.reduce((result, permission) => {
    if (!result[permission.module]) {
      result[permission.module] = [];
    }

    result[permission.module].push(permission);

    return result;
  }, {});
};

/* =========================================================
   CREATE ROLE
   POST /api/admin/roles

   Body:
   {
     "role_name": "Sales Manager",
     "is_active": true
   }
========================================================= */
const createRole = async (req, res) => {
  try {
    const { role_name, is_active = true } = req.body || {};

    if (!role_name || String(role_name).trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Role name must contain at least 2 characters",
      });
    }

    const cleanRoleName = String(role_name).trim();
    const roleSlug = makeSlug(cleanRoleName);

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message: "Invalid role name",
      });
    }

    const [existingRoles] = await pool.query(
      `
      SELECT id, role_name, role_slug
      FROM roles
      WHERE LOWER(role_name) = LOWER(?)
         OR role_slug = ?
      LIMIT 1
      `,
      [cleanRoleName, roleSlug]
    );

    if (existingRoles.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO roles (
        role_name,
        role_slug,
        is_active
      )
      VALUES (?, ?, ?)
      `,
      [cleanRoleName, roleSlug, is_active ? 1 : 0]
    );

    const [newRoles] = await pool.query(
      `
      SELECT
        id,
        role_name,
        role_slug,
        is_active,
        created_at,
        updated_at
      FROM roles
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: {
        ...newRoles[0],
        is_active: Boolean(newRoles[0].is_active),
      },
    });
  } catch (error) {
    console.error("Create role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ROLES LIST
   GET /api/admin/roles
========================================================= */
const getRoles = async (req, res) => {
  try {
    const [roles] = await pool.query(`
      SELECT
        r.id,
        r.role_name,
        r.role_slug,
        r.is_active,
        r.created_at,
        r.updated_at,
        COUNT(DISTINCT rp.permission_id) AS permission_count,
        COUNT(DISTINCT u.id) AS user_count
      FROM roles r
      LEFT JOIN role_permissions rp
        ON rp.role_id = r.id
      LEFT JOIN users u
        ON u.role_id = r.id
      GROUP BY
        r.id,
        r.role_name,
        r.role_slug,
        r.is_active,
        r.created_at,
        r.updated_at
      ORDER BY r.id ASC
    `);

    return res.status(200).json({
      success: true,
      data: roles.map((role) => ({
        ...role,
        is_active: Boolean(role.is_active),
      })),
    });
  } catch (error) {
    console.error("Get roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ROLE WITH ALL PERMISSIONS
   GET /api/admin/roles/:roleId/permissions

   This is for checkbox UI.
   It returns all permissions with assigned true/false.
========================================================= */
const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!Number(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    const [roles] = await pool.query(
      `
      SELECT
        id,
        role_name,
        role_slug,
        is_active
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const [permissions] = await pool.query(
      `
      SELECT
        p.id,
        p.permission_name,
        p.permission_slug,
        p.module,
        p.description,
        CASE
          WHEN rp.id IS NULL THEN 0
          ELSE 1
        END AS assigned
      FROM permissions p
      LEFT JOIN role_permissions rp
        ON rp.permission_id = p.id
        AND rp.role_id = ?
      ORDER BY p.module ASC, p.id ASC
      `,
      [roleId]
    );

    const formattedPermissions = permissions.map((permission) => ({
      ...permission,
      assigned: Boolean(permission.assigned),
    }));

    return res.status(200).json({
      success: true,
      data: {
        role: {
          ...roles[0],
          is_active: Boolean(roles[0].is_active),
        },
        permissions: groupPermissionsByModule(formattedPermissions),
      },
      total_permissions: formattedPermissions.length,
      assigned_permissions: formattedPermissions.filter(
        (permission) => permission.assigned
      ).length,
    });
  } catch (error) {
    console.error("Get role permissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE ROLE PERMISSIONS
   PUT /api/admin/roles/:roleId/permissions

   Body:
   {
     "permission_ids": [1, 2, 3, 4]
   }
========================================================= */
const updateRolePermissions = async (req, res) => {
  let connection;

  try {
    const { roleId } = req.params;
    const { permission_ids } = req.body || {};

    if (!Number(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    if (!Array.isArray(permission_ids)) {
      return res.status(400).json({
        success: false,
        message: "permission_ids must be an array",
      });
    }

    const cleanPermissionIds = [
      ...new Set(permission_ids.map((id) => Number(id))),
    ].filter((id) => Number.isInteger(id) && id > 0);

    connection = await pool.getConnection();

    const [roles] = await connection.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (cleanPermissionIds.length > 0) {
      const placeholders = cleanPermissionIds.map(() => "?").join(",");

      const [validPermissions] = await connection.query(
        `
        SELECT id
        FROM permissions
        WHERE id IN (${placeholders})
        `,
        cleanPermissionIds
      );

      if (validPermissions.length !== cleanPermissionIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more permission IDs are invalid",
        });
      }
    }

    await connection.beginTransaction();

    await connection.query(
      `
      DELETE FROM role_permissions
      WHERE role_id = ?
      `,
      [roleId]
    );

    if (cleanPermissionIds.length > 0) {
      const rows = cleanPermissionIds.map((permissionId) => [
        Number(roleId),
        permissionId,
      ]);

      await connection.query(
        `
        INSERT INTO role_permissions (
          role_id,
          permission_id
        )
        VALUES ?
        `,
        [rows]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Role permissions updated successfully",
      data: {
        role_id: Number(roleId),
        role_name: roles[0].role_name,
        permission_ids: cleanPermissionIds,
        permission_count: cleanPermissionIds.length,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Update role permissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update role permissions",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/* =========================================================
   UPDATE ROLE
   PUT /api/admin/roles/:roleId

   Body:
   {
     "role_name": "Sales Manager",
     "is_active": true
   }
========================================================= */
const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { role_name, is_active } = req.body || {};

    if (!Number(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    const [existingRoles] = await pool.query(
      `
      SELECT id, role_name, role_slug, is_active
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    if (existingRoles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const oldRole = existingRoles[0];

    const updatedRoleName =
      role_name !== undefined && String(role_name).trim()
        ? String(role_name).trim()
        : oldRole.role_name;

    if (updatedRoleName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Role name must contain at least 2 characters",
      });
    }

    const updatedRoleSlug = makeSlug(updatedRoleName);

    const [duplicates] = await pool.query(
      `
      SELECT id
      FROM roles
      WHERE id != ?
        AND (
          LOWER(role_name) = LOWER(?)
          OR role_slug = ?
        )
      LIMIT 1
      `,
      [roleId, updatedRoleName, updatedRoleSlug]
    );

    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Another role already has this name or slug",
      });
    }

    let updatedIsActive = oldRole.is_active;

    if (typeof is_active === "boolean") {
      updatedIsActive = is_active ? 1 : 0;
    }

    await pool.query(
      `
      UPDATE roles
      SET
        role_name = ?,
        role_slug = ?,
        is_active = ?
      WHERE id = ?
      `,
      [updatedRoleName, updatedRoleSlug, updatedIsActive, roleId]
    );

    const [updatedRoles] = await pool.query(
      `
      SELECT
        id,
        role_name,
        role_slug,
        is_active,
        created_at,
        updated_at
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: {
        ...updatedRoles[0],
        is_active: Boolean(updatedRoles[0].is_active),
      },
    });
  } catch (error) {
    console.error("Update role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    });
  }
};

/* =========================================================
   TOGGLE ROLE STATUS
   PATCH /api/admin/roles/:roleId/status
========================================================= */
const toggleRoleStatus = async (req, res) => {
  try {
    const { roleId } = req.params;

    const [roles] = await pool.query(
      `
      SELECT id, role_name, is_active
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const role = roles[0];

    // Optional protection: Super Admin role cannot be disabled.
    if (role.role_name.toLowerCase() === "super admin") {
      return res.status(400).json({
        success: false,
        message: "Super Admin role cannot be disabled",
      });
    }

    const nextStatus = Number(role.is_active) === 1 ? 0 : 1;

    await pool.query(
      `
      UPDATE roles
      SET is_active = ?
      WHERE id = ?
      `,
      [nextStatus, roleId]
    );

    return res.status(200).json({
      success: true,
      message: nextStatus
        ? "Role activated successfully"
        : "Role deactivated successfully",
      data: {
        id: Number(roleId),
        is_active: Boolean(nextStatus),
      },
    });
  } catch (error) {
    console.error("Toggle role status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update role status",
      error: error.message,
    });
  }
};

/* =========================================================
   GET USERS FOR "ASSIGN ROLE TO USER" TABLE
   GET /api/admin/role-assignments?page=1&limit=20&search=
========================================================= */
const getRoleAssignments = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    let whereClause = "WHERE 1 = 1";
    const params = [];

    if (search) {
      const keyword = `%${search}%`;

      whereClause += `
        AND (
          u.name LIKE ?
          OR u.username LIKE ?
          OR u.email LIKE ?
          OR u.mobile LIKE ?
        )
      `;

      params.push(keyword, keyword, keyword, keyword);
    }

    const [users] = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.username,
        u.email,
        u.mobile,
        u.role_id,
        u.status,
        u.is_active,
        r.role_name,
        r.role_slug,
        COUNT(DISTINCT rp.permission_id) AS permission_count
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      ${whereClause}
      GROUP BY
        u.id,
        u.name,
        u.username,
        u.email,
        u.mobile,
        u.role_id,
        u.status,
        u.is_active,
        r.role_name,
        r.role_slug
      ORDER BY u.id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM users u
      ${whereClause}
      `,
      params
    );

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Get role assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role assignments",
      error: error.message,
    });
  }
};

/* =========================================================
   ASSIGN ROLE TO USER
   PATCH /api/admin/users/:userId/role

   Body:
   {
     "role_id": 2
   }
========================================================= */
const assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role_id } = req.body || {};
    const loggedInUserId = req.user?.id || null;

    if (!Number(userId) || !role_id) {
      return res.status(400).json({
        success: false,
        message: "Valid userId and role_id are required",
      });
    }

    const [users] = await pool.query(
      `
      SELECT id, role_id
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [roles] = await pool.query(
      `
      SELECT id, role_name, is_active
      FROM roles
      WHERE id = ?
      `,
      [role_id]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Selected role not found",
      });
    }

    if (!Number(roles[0].is_active)) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign an inactive role",
      });
    }

    await pool.query(
      `
      UPDATE users
      SET
        role_id = ?,
        updated_by = ?
      WHERE id = ?
      `,
      [Number(role_id), loggedInUserId, userId]
    );

    return res.status(200).json({
      success: true,
      message: "User role assigned successfully",
      data: {
        user_id: Number(userId),
        role_id: roles[0].id,
        role_name: roles[0].role_name,
      },
    });
  } catch (error) {
    console.error("Assign role to user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign role",
      error: error.message,
    });
  }
};

/* =========================================================
   VIEW USER'S INHERITED PERMISSIONS
   GET /api/admin/users/:userId/permissions
========================================================= */
const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.username,
        u.email,
        r.id AS role_id,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const [permissions] = await pool.query(
      `
      SELECT
        p.id,
        p.permission_name,
        p.permission_slug,
        p.module,
        p.description,
        true AS assigned
      FROM role_permissions rp
      INNER JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = ?
      ORDER BY p.module ASC, p.id ASC
      `,
      [user.role_id]
    );

    const formattedPermissions = permissions.map((permission) => ({
      ...permission,
      assigned: Boolean(permission.assigned),
    }));

    return res.status(200).json({
      success: true,
      data: {
        user,
        permissions: groupPermissionsByModule(formattedPermissions),
      },
      total_permissions: formattedPermissions.length,
    });
  } catch (error) {
    console.error("Get user permissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user permissions",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE ROLE
   DELETE /api/admin/roles/:roleId
========================================================= */
const deleteRole = async (req, res) => {
  let connection;

  try {
    const { roleId } = req.params;

    if (!Number(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    connection = await pool.getConnection();

    const [roles] = await connection.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const role = roles[0];

    if (role.role_name.toLowerCase() === "super admin") {
      return res.status(400).json({
        success: false,
        message: "Super Admin role cannot be deleted",
      });
    }

    const [assignedUsers] = await connection.query(
      `
      SELECT COUNT(*) AS total
      FROM users
      WHERE role_id = ?
      `,
      [roleId]
    );

    if (Number(assignedUsers[0].total) > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this role because ${assignedUsers[0].total} user(s) are assigned to it. Assign those users to another role first.`,
      });
    }

    await connection.beginTransaction();

    // This is also handled automatically if role_permissions.role_id
    // has ON DELETE CASCADE, but keeping it explicit is safe.
    await connection.query(
      `
      DELETE FROM role_permissions
      WHERE role_id = ?
      `,
      [roleId]
    );

    await connection.query(
      `
      DELETE FROM roles
      WHERE id = ?
      `,
      [roleId]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      data: {
        id: Number(roleId),
        role_name: role.role_name,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Delete role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete role",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createRole,
  getRoles,
  getRolePermissions,
  updateRolePermissions,
  updateRole,
  toggleRoleStatus,
  getRoleAssignments,
  assignRoleToUser,
  getUserPermissions,
  deleteRole,
};