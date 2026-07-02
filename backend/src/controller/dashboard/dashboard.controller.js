const pool = require("../../config/pool");

const dashboard = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.mobile,
                u.username,
                u.status,
                u.last_login,
                u.last_login_ip,
                r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    dashboard
};