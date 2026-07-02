const pool = require("../../config/pool");

exports.getMemberList = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 50,
            search = "",
            state = "",
            city = "",
            status = "",
            block = ""
        } = req.query;

        const offset = (page - 1) * limit;

        let where = "WHERE 1=1";

        const values = [];

        // Search
        if (search) {
            where += `
            AND (
                owner_name LIKE ?
                OR owner_id LIKE ?
                OR mobile LIKE ?
                OR email LIKE ?
            )`;

            const keyword = `%${search}%`;

            values.push(
                keyword,
                keyword,
                keyword,
                keyword
            );
        }

        // State
        if (state) {
            where += " AND state = ?";
            values.push(state);
        }

        // City
        if (city) {
            where += " AND city = ?";
            values.push(city);
        }

        // Active / Inactive
        if (status !== "") {
            where += " AND status = ?";
            values.push(status);
        }

        // Block Status
        if (block !== "") {
            where += " AND block_status = ?";
            values.push(block);
        }

        // Total Records
        const [countResult] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM registration
            ${where}
            `,
            values
        );

        const totalRecords = countResult[0].total;

        // Member List
        const [members] = await pool.query(
            `
            SELECT

                id,
                owner_id,
                owner_name,
                mobile,
                email,
                city,
                state,
                country,
                address,
                pincode,
                email_verify,
                user_status,
                profile_status,
                status,
                block_status,
                version,
                start_date,
                date_time

            FROM registration

            ${where}

            ORDER BY id DESC

            LIMIT ?

            OFFSET ?
            `,
            [
                ...values,
                Number(limit),
                Number(offset),
            ]
        );

        // Filters
        const [states] = await pool.query(
            `
            SELECT DISTINCT state
            FROM registration
            WHERE state IS NOT NULL
            ORDER BY state
            `
        );

        const [cities] = await pool.query(
            `
            SELECT DISTINCT city
            FROM registration
            WHERE city IS NOT NULL
            ORDER BY city
            `
        );

        // Stats
        const [stats] = await pool.query(`
            SELECT

                COUNT(*) total,

                SUM(status='1') active,

                SUM(status='0') inactive,

                SUM(email_verify='1') verified,

                SUM(block_status='0') blocked

            FROM registration
        `);

        const membersWithNewId = members.map((member, index) => ({
            ...member,
            id: (Number(page) - 1) * Number(limit) + index + 1,
        }));

        res.status(200).json({
            success: true,
            members: membersWithNewId,
            stats: stats[0],
            filters: {
                states,
                cities,
            },
            pagination: {
                currentPage: Number(page),
                perPage: Number(limit),
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
            },
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};