const jwt = require("jsonwebtoken");
const pool = require("../config/pool");


const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first. Token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first. Token is required.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Authentication failed. Please login again.",
      });
    }

    const [blacklistedTokens] = await pool.query(
      `
      SELECT id
      FROM token_blacklist
      WHERE token = ?
        AND expires_at > NOW()
      LIMIT 1
      `,
      [token]
    );

    if (blacklistedTokens.length > 0) {
      return res.status(401).json({
        success: false,
        message: "Session ended. Please login again.",
      });
    }

    const [users] = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.mobile,
        u.username,
        u.email,
        u.role_id,
        u.status,
        u.is_active,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please login again.",
      });
    }

    const user = users[0];

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    if (user.status === "Expired") {
      return res.status(403).json({
        success: false,
        message: "Your account has expired.",
      });
    }

    if (user.status !== "active" || Number(user.is_active) !== 1) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Authenticate middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};


module.exports = authenticate