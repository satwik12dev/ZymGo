const pool = require("../config/pool");

const addGym = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const {

            gym_name,
            address,
            city,
            city_id,
            area_id,
            subarea_id,
            area,
            sub_area,
            pincode,
            state,
            latitude,
            longitude,
            mobile,
            email,
            admin_approval_status,
            admin_remarks,
            submitted_for_review,
            status,
            gym_type,
            timing,
            description,
            website,
            is_verified,
            is_zymgoo_trusted,
            is_top_search,
            admission_fee,
            meta_title,
            meta_description,
            meta_keywords

        } = req.body;

        /* ---------------- Validation ---------------- */

        if (
            !gym_name ||
            !mobile ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }

        /* ---------------- Duplicate Mobile ---------------- */

        const [mobileExists] = await connection.query(

            `
            SELECT id
            FROM gym_management
            WHERE mobile=?
            `,

            [mobile]

        );

        if (mobileExists.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Mobile number already exists."

            });

        }

        /* ---------------- Duplicate Email ---------------- */

        if (email) {

            const [emailExists] = await connection.query(

                `
                SELECT id
                FROM gym_management
                WHERE email=?
                `,

                [email]

            );

            if (emailExists.length > 0) {

                await connection.rollback();

                return res.status(400).json({

                    success: false,

                    message: "Email already exists."

                });

            }

        }

        /* ---------------- Generate Owner ID ---------------- */

        const [ownerRow] = await connection.query(

            `
            SELECT owner_id
            FROM gym_management
            ORDER BY id DESC
            LIMIT 1
            `

        );

        let ownerNumber = 1;

        if (
            ownerRow.length &&
            ownerRow[0].owner_id
        ) {

            ownerNumber =
                Number(ownerRow[0].owner_id) + 1;

        }

        const owner_id =
            String(ownerNumber).padStart(10, "0");

        /* ---------------- Generate Gym ID ---------------- */

        const [gymRow] = await connection.query(

            `
            SELECT gym_id
            FROM gym_management
            ORDER BY id DESC
            LIMIT 1
            `

        );

        let gymNumber = 1;

        if (
            gymRow.length &&
            gymRow[0].gym_id
        ) {

            gymNumber =
                Number(gymRow[0].gym_id) + 1;

        }

        const gym_id =
            String(gymNumber).padStart(10, "0");
                    /* ---------------- Dates ---------------- */

        const now = new Date();

        const submittedDate =
            submitted_for_review == 1
                ? now
                : null;

        const adminApprovedDate =
            admin_approval_status === "approved"
                ? now
                : null;

        /* ---------------- Insert Gym ---------------- */

        await connection.query(

            `
            INSERT INTO gym_management
            (
                owner_id,
                gym_id,
                gym_name,
                address,
                city,
                city_id,
                area_id,
                subarea_id,
                area,
                sub_area,
                pincode,
                state,
                latitude,
                longitude,
                mobile,
                email,
                admin_approval_status,
                admin_approved_date,
                admin_remarks,
                submitted_for_review,
                submitted_date,
                date_time,
                status,
                gym_type,
                timing,
                description,
                website,
                is_verified,
                is_zymgoo_trusted,
                is_top_search,
                admission_fee,
                meta_title,
                meta_description,
                meta_keywords
            )

            VALUES
            (
                ?,?,?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?
            )
            `,

            [

                owner_id,
                gym_id,
                gym_name,

                address,
                city,
                city_id || null,

                area_id || null,
                subarea_id || null,
                area || null,

                sub_area || null,
                pincode,
                state,

                latitude || null,
                longitude || null,
                mobile,

                email || null,
                admin_approval_status || "pending",
                adminApprovedDate,

                admin_remarks || null,
                submitted_for_review || 0,
                submittedDate,

                now,
                status || "1",
                gym_type || "Unisex",

                timing || null,
                description || null,
                website || null,

                is_verified || 0,
                is_zymgoo_trusted || 0,
                is_top_search || 0,

                admission_fee || null,
                meta_title || null,
                meta_description || null,
                meta_keywords || null

            ]

        );
                /* ---------------- Commit Transaction ---------------- */

        await connection.commit();

        return res.status(201).json({

            success: true,

            message: "Gym added successfully.",

            data: {

                owner_id,

                gym_id,

                gym_name,

                mobile,

                email,

                city,

                state,

                status: status || "1",

                admin_approval_status:
                    admin_approval_status || "pending"

            }

        });

    } catch (error) {

        console.log(error);

        await connection.rollback();

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

            error: error.message

        });

    } finally {

        connection.release();

    }

};

module.exports = {

    addGym

};