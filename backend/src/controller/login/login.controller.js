const pool = require("../../config/pool");
const md5 = require("md5");
const generateToken = require("../../utils/jwt.generate");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "Unknown";
};

const addLoginLog = async ({
  userId,
  ip,
  status,
  description,
}) => {
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
      [
        userId,
        "auth",
        "LOGIN",
        description,
        ip,
        status,
      ]
    );
  } catch (error) {
    // Login should still work even if audit logging has an issue.
    console.error("Audit login log error:", error.message);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const ip = getClientIp(req);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [users] = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.password,
        u.status,
        u.is_active,
        u.role_id,
        r.role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = users[0];

    const [attempts] = await pool.query(
      `
      SELECT
        id,
        failed_attempts,
        blocked_until
      FROM login_attempts
      WHERE user_id = ?
        AND ip_address = ?
      LIMIT 1
      `,
      [user.id, ip]
    );

    const attempt = attempts[0];

    // IP lock check
    if (
      attempt?.blocked_until &&
      new Date(attempt.blocked_until) > new Date()
    ) {
      await addLoginLog({
        userId: user.id,
        ip,
        status: "FAILED",
        description: "Login blocked: IP is temporarily blocked",
      });

      return res.status(403).json({
        success: false,
        message: "This IP is blocked for 12 hours.",
      });
    }

    // Account lock check
    if (user.status === "blocked" || Number(user.is_active) === 0) {
      await addLoginLog({
        userId: user.id,
        ip,
        status: "FAILED",
        description: "Login blocked: user account is blocked or inactive",
      });

      return res.status(403).json({
        success: false,
        message: "Account is blocked or inactive.",
      });
    }

    const passwordMatched = md5(String(password)) === user.password;

    // Invalid password
    if (!passwordMatched) {
      if (!attempt) {
        await pool.query(
          `
          INSERT INTO login_attempts (
            user_id,
            ip_address,
            failed_attempts
          )
          VALUES (?, ?, 1)
          `,
          [user.id, ip]
        );
      } else {
        const failedAttempts = Number(attempt.failed_attempts) + 1;

        if (failedAttempts >= 3) {
          const blockedUntil = new Date(
            Date.now() + 12 * 60 * 60 * 1000
          );

          await pool.query(
            `
            UPDATE login_attempts
            SET
              failed_attempts = ?,
              blocked_until = ?
            WHERE user_id = ?
              AND ip_address = ?
            `,
            [failedAttempts, blockedUntil, user.id, ip]
          );

          await pool.query(
            `
            UPDATE users
            SET
              status = 'blocked',
              is_active = 0
            WHERE id = ?
            `,
            [user.id]
          );

          await addLoginLog({
            userId: user.id,
            ip,
            status: "FAILED",
            description:
              "Login failed: account blocked after 3 invalid password attempts",
          });

          return res.status(403).json({
            success: false,
            message:
              "Too many failed attempts. Account and IP are blocked for 12 hours.",
          });
        }

        await pool.query(
          `
          UPDATE login_attempts
          SET failed_attempts = ?
          WHERE user_id = ?
            AND ip_address = ?
          `,
          [failedAttempts, user.id, ip]
        );
      }

      await addLoginLog({
        userId: user.id,
        ip,
        status: "FAILED",
        description: "Login failed: invalid password",
      });

      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Successful login: remove previous failed attempts for this IP.
    await pool.query(
      `
      DELETE FROM login_attempts
      WHERE user_id = ?
        AND ip_address = ?
      `,
      [user.id, ip]
    );

    await pool.query(
      `
      UPDATE users
      SET
        status = 'active',
        is_active = 1,
        last_login = NOW(),
        last_login_ip = ?
      WHERE id = ?
      `,
      [ip, user.id]
    );

    const token = generateToken(
      user.id,
      user.email,
      user.role_id,
      user.role_name
    );

    await pool.query(
      `
      UPDATE users
      SET token = ?
      WHERE id = ?
      `,
      [token, user.id]
    );

    await addLoginLog({
      userId: user.id,
      ip,
      status: "SUCCESS",
      description: "User logged in successfully",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  Login,
};