const pool = require("../../config/pool");
const md5 = require("md5");
const generateToken = require("../../utils/jwt.generate");

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || req.ip;

        // Find user
        const [users] = await pool.query(
            `SELECT u.id, u.name, u.email, u.password, u.status, u.role_id, r.role_name FROM users u JOIN roles r ON u.role_id=r.id WHERE u.email=?`,
            [email]
        );
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = users[0];

        // Check login attempts
        const [attempt] = await pool.query(
            "SELECT * FROM login_attempts WHERE user_id = ? AND ip_address = ?",
            [user.id, ip]
        );

        // Check if IP is blocked
        if (
            attempt.length > 0 &&
            attempt[0].blocked_until &&
            new Date(attempt[0].blocked_until) > new Date()
        ) {
            return res.status(403).json({
                success: false,
                message: "This IP is blocked for 12 hours."
            });
        }

        // Check account status
        if (user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Account is blocked."
            });
        }

        // Verify password
        const match = md5(password) === user.password;

        if (!match) {

            if (attempt.length === 0) {

                await pool.query(
                    `INSERT INTO login_attempts
                    (user_id, ip_address, failed_attempts)
                    VALUES (?, ?, 1)`,
                    [user.id, ip]
                );

            } else {

                const failed = attempt[0].failed_attempts + 1;

                if (failed >= 3) {

                    const blockUntil = new Date(Date.now() + 12 * 60 * 60 * 1000);

                    await pool.query(
                        `UPDATE login_attempts
                        SET failed_attempts = ?, blocked_until = ?
                        WHERE user_id = ? AND ip_address = ?`,
                        [failed, blockUntil, user.id, ip]
                    );

                    await pool.query(
                        "UPDATE users SET status='blocked' WHERE id=?",
                        [user.id]
                    );

                    return res.status(403).json({
                        success: false,
                        message: "Too many failed attempts. IP blocked for 12 hours."
                    });
                }

                await pool.query(
                    `UPDATE login_attempts
                    SET failed_attempts = ?
                    WHERE user_id = ? AND ip_address = ?`,
                    [failed, user.id, ip]
                );
            }

            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

        // Successful login
        await pool.query(
            "DELETE FROM login_attempts WHERE user_id = ? AND ip_address = ?",
            [user.id, ip]
        );

        await pool.query(
            `UPDATE users
             SET status='active',
                 last_login=NOW(),
                 last_login_ip=?
             WHERE id=?`,
            [ip, user.id]
        );

        const token = generateToken(user.id, user.email, user.role_id, user.role_name);

        await pool.query(
            "UPDATE users SET token = ? WHERE id = ?",
            [token, user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                role: user.role_name
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    Login
};