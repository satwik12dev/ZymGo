const db = require("../../config/pool");
const crypto = require("crypto");


const createMd5 = (value) => {
  return crypto.createHash("md5").update(String(value)).digest("hex");
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || null;
};


const createUser = async (req, res) => {
  try {
    const loggedInUserId = req.user?.id || null;

    const { name, mobile, username, email, password, role_id } = req.body;

    if (!name || !mobile || !username || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message:
          "Name, mobile, username, email, password and role are required",
      });
    }

    const normalizedName = String(name).trim();
    const normalizedMobile = String(mobile).trim();
    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!/^\d{10}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    if (normalizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }

    if (normalizedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must contain at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const email_md5 = createMd5(normalizedEmail);
    const password_md5 = createMd5(password);

    const [existingUsers] = await db.query(
      `
      SELECT id, mobile, username, email
      FROM users
      WHERE mobile = ?
         OR username = ?
         OR email = ?
      `,
      [normalizedMobile, normalizedUsername, normalizedEmail]
    );

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];

      let message = "User already exists";

      if (existing.mobile === normalizedMobile) {
        message = "Mobile number already exists";
      } else if (existing.username === normalizedUsername) {
        message = "Username already exists";
      } else if (existing.email === normalizedEmail) {
        message = "Email already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    const [roles] = await db.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE id = ?
      `,
      [role_id]
    );

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Selected role does not exist",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO users (
        name,
        mobile,
        username,
        email,
        email_md5,
        password,
        role_id,
        status,
        is_active,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 1, ?)
      `,
      [
        normalizedName,
        normalizedMobile,
        normalizedUsername,
        normalizedEmail,
        email_md5,
        password_md5,
        Number(role_id),
        loggedInUserId,
      ]
    );

    const [newUsers] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.mobile,
        u.username,
        u.email,
        u.status,
        u.is_active,
        u.last_login,
        u.last_login_ip,
        u.created_at,
        r.id AS role_id,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUsers[0],
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};


const getUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const { search, status, role_id } = req.query;

    const validStatuses = ["active", "inactive", "blocked", "Expired"];

    let whereClause = "WHERE 1 = 1";
    const params = [];

    if (search && String(search).trim()) {
      const keyword = `%${String(search).trim()}%`;

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

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter",
        });
      }

      whereClause += " AND u.status = ?";
      params.push(status);
    }

    if (role_id) {
      whereClause += " AND u.role_id = ?";
      params.push(Number(role_id));
    }

    const [users] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.mobile,
        u.username,
        u.email,
        u.status,
        u.is_active,
        u.last_login,
        u.last_login_ip,
        u.created_at,

        r.id AS role_id,
        r.role_name,

        (
          SELECT COUNT(*)
          FROM gym_management gm
          WHERE gm.created_by = u.id
        ) AS all_gym,

        (
          SELECT COUNT(*)
          FROM gym_management gm
          WHERE gm.created_by = u.id
            AND DATE(gm.created_at) = CURDATE()
        ) AS today_gym

      FROM users u
      INNER JOIN roles r ON r.id = u.role_id

      ${whereClause}

      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countResult] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM users u
      ${whereClause}
      `,
      params
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.mobile,
        u.username,
        u.email,
        u.status,
        u.is_active,
        u.last_login,
        u.last_login_ip,
        u.created_at,
        u.updated_at,
        r.id AS role_id,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user?.id || null;

    const {
      name,
      mobile,
      username,
      email,
      password,
      role_id,
      status,
      is_active,
    } = req.body;

    const validStatuses = ["active", "inactive", "blocked", "Expired"];

    const [existingUsers] = await db.query(
      `
      SELECT *
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldUser = existingUsers[0];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updatedName =
      name !== undefined && String(name).trim()
        ? String(name).trim()
        : oldUser.name;

    const updatedMobile =
      mobile !== undefined && String(mobile).trim()
        ? String(mobile).trim()
        : oldUser.mobile;

    const updatedUsername =
      username !== undefined && String(username).trim()
        ? String(username).trim().toLowerCase()
        : oldUser.username;

    const updatedEmail =
      email !== undefined && String(email).trim()
        ? String(email).trim().toLowerCase()
        : oldUser.email;

    if (!/^\d{10}$/.test(updatedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    if (updatedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }

    if (updatedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must contain at least 3 characters",
      });
    }

    if (role_id) {
      const [roles] = await db.query(
        `
        SELECT id
        FROM roles
        WHERE id = ?
        `,
        [role_id]
      );

      if (roles.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Selected role does not exist",
        });
      }
    }

    const [duplicateUsers] = await db.query(
      `
      SELECT id, mobile, username, email
      FROM users
      WHERE id != ?
        AND (
          mobile = ?
          OR username = ?
          OR email = ?
        )
      `,
      [id, updatedMobile, updatedUsername, updatedEmail]
    );

    if (duplicateUsers.length > 0) {
      const duplicate = duplicateUsers[0];

      let message = "User details already exist";

      if (duplicate.mobile === updatedMobile) {
        message = "Mobile number already exists";
      } else if (duplicate.username === updatedUsername) {
        message = "Username already exists";
      } else if (duplicate.email === updatedEmail) {
        message = "Email already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    const updatedEmailMd5 = createMd5(updatedEmail);

    let updatedPassword = oldUser.password;

    if (password !== undefined && String(password).length > 0) {
      if (String(password).length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least 6 characters",
        });
      }

      updatedPassword = createMd5(password);
    }

    const updatedRoleId = role_id ? Number(role_id) : oldUser.role_id;
    const updatedStatus = status || oldUser.status;

    let updatedIsActive = oldUser.is_active;

    if (typeof is_active === "boolean") {
      updatedIsActive = is_active ? 1 : 0;
    }

    if (updatedStatus === "blocked" || updatedStatus === "inactive") {
      updatedIsActive = 0;
    }

    if (updatedStatus === "active") {
      updatedIsActive = 1;
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        mobile = ?,
        username = ?,
        email = ?,
        email_md5 = ?,
        password = ?,
        role_id = ?,
        status = ?,
        is_active = ?,
        updated_by = ?
      WHERE id = ?
      `,
      [
        updatedName,
        updatedMobile,
        updatedUsername,
        updatedEmail,
        updatedEmailMd5,
        updatedPassword,
        updatedRoleId,
        updatedStatus,
        updatedIsActive,
        loggedInUserId,
        id,
      ]
    );

    const [updatedUsers] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.mobile,
        u.username,
        u.email,
        u.status,
        u.is_active,
        u.last_login,
        u.last_login_ip,
        u.created_at,
        u.updated_at,
        r.id AS role_id,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUsers[0],
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};


const getUserStats = async (req, res) => {
  try {
    const [[totalUsers]] = await db.query(`
      SELECT COUNT(*) AS total_users
      FROM users
    `);

    const [[activeUsers]] = await db.query(`
      SELECT COUNT(*) AS active_users
      FROM users
      WHERE status = 'active'
        AND is_active = 1
    `);

    const [[totalRoles]] = await db.query(`
      SELECT COUNT(*) AS total_roles
      FROM roles
    `);

    const [[totalPermissions]] = await db.query(`
      SELECT COUNT(*) AS total_permissions
      FROM permissions
    `);

    return res.status(200).json({
      success: true,
      data: {
        total_users: totalUsers.total_users,
        active_users: activeUsers.active_users,
        total_roles: totalRoles.total_roles,
        total_permissions: totalPermissions.total_permissions,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: error.message,
    });
  }
};


const toggleUserBlock = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    const { id } = req.params;
    const loggedInUserId = req.user?.id || null;

    if (loggedInUserId && Number(id) === Number(loggedInUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot block or unblock your own account",
      });
    }

    const [users] = await connection.query(
      `
      SELECT id, status, is_active
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    const isCurrentlyBlocked = user.status === "blocked";

    await connection.beginTransaction();

    if (isCurrentlyBlocked) {
      // Unblock user account
      await connection.query(
        `
        UPDATE users
        SET
          status = 'active',
          is_active = 1,
          updated_by = ?
        WHERE id = ?
        `,
        [loggedInUserId, id]
      );

      // Also clear failed-login lock for every IP address
      await connection.query(
        `
        UPDATE login_attempts
        SET
          failed_attempts = 0,
          blocked_until = NULL
        WHERE user_id = ?
        `,
        [id]
      );
    } else {
      // Block user account manually
      await connection.query(
        `
        UPDATE users
        SET
          status = 'blocked',
          is_active = 0,
          updated_by = ?
        WHERE id = ?
        `,
        [loggedInUserId, id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: isCurrentlyBlocked
        ? "User unblocked successfully. Login attempts were reset."
        : "User blocked successfully",
      data: {
        id: Number(id),
        status: isCurrentlyBlocked ? "active" : "blocked",
        is_active: isCurrentlyBlocked,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Toggle user block error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user?.id || null;

    if (loggedInUserId && Number(id) === Number(loggedInUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const [users] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};




const getAllPermissions = async (req, res) => {
  try {
    const [permissions] = await db.query(`
      SELECT
        id,
        permission_name,
        permission_slug,
        module,
        description,
        created_at
      FROM permissions
      ORDER BY module ASC, id ASC
    `);

    const groupedPermissions = permissions.reduce((result, permission) => {
      if (!result[permission.module]) {
        result[permission.module] = [];
      }

      result[permission.module].push(permission);

      return result;
    }, {});

    return res.status(200).json({
      success: true,
      data: groupedPermissions,
      total_permissions: permissions.length,
    });
  } catch (error) {
    console.error("Get permissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message,
    });
  }
};

/* =========================================================
   LOGIN HELPER
   Call this after successful password verification.
========================================================= */
const updateLastLogin = async (userId, ipAddress) => {
  try {
    await db.query(
      `
      UPDATE users
      SET
        last_login = NOW(),
        last_login_ip = ?
      WHERE id = ?
      `,
      [ipAddress || null, userId]
    );
  } catch (error) {
    console.error("Update last login error:", error.message);
  }
};


module.exports = {
  createUser,
  getUsers,
    getUserById,
    updateUser,
    toggleUserBlock,
    deleteUser,
    getUserStats,
    getAllPermissions,
    updateLastLogin,
};