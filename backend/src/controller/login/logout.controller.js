const pool = require("../../config/pool");
const jwt = require("jsonwebtoken")

const LogOut = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.decode(token);

        await pool.query(
            `INSERT INTO token_blacklist (user_id, token, expires_at)
             VALUES (?, ?, FROM_UNIXTIME(?))`,
            [
                req.user.id,
                token,
                decoded.exp
            ]
        );

        // Remove token from users table
        await pool.query(
            "UPDATE users SET token = NULL WHERE id = ?",
            [req.user.id]
        );
        
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { LogOut };