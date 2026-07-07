const pool = require("../../config/pool");
const jwt = require("jsonwebtoken");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "Unknown";
};

const addLogoutLog = async ({ userId, ip, status, description }) => {
  try {
    await pool.query(
      `
      INSERT INTO logs (
        user_id,
        module,
        action,
        description,
        ip_address,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userId, "auth", "LOGOUT", description, ip, status]
    );
  } catch (error) {
    // Logout should still complete even if audit logging fails.
    console.error("Audit logout log error:", error.message);
  }
};

const LogOut = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const ip = getClientIp(req);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first. Token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session already expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    const userId = req.user?.id || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user session.",
      });
    }

    const [users] = await pool.query(
      `
      SELECT id, name, email
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Avoid blacklisting the same token twice.
    const [alreadyBlacklisted] = await pool.query(
      `
      SELECT id
      FROM token_blacklist
      WHERE token = ?
      LIMIT 1
      `,
      [token]
    );

    if (alreadyBlacklisted.length === 0) {
      await pool.query(
        `
        INSERT INTO token_blacklist (
          user_id,
          token,
          expires_at
        )
        VALUES (?, ?, FROM_UNIXTIME(?))
        `,
        [userId, token, decoded.exp]
      );
    }

    // Keep this only if your users table has a token column.
    await pool.query(
      `
      UPDATE users
      SET token = NULL
      WHERE id = ?
      `,
      [userId]
    );

    // Add successful logout record to Audit Trail.
    await addLogoutLog({
      userId,
      ip,
      status: "SUCCESS",
      description: "User logged out successfully",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = { LogOut };