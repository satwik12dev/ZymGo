const pool = require("../../config/pool");
const csv = require("csv-parser");
const fs = require("fs");

const bulkUploadGym = async (req, res) => {
  let connection;

  try {
    console.log("Uploaded CSV file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV file using field name: file",
      });
    }

    console.log("CSV saved successfully at:", req.file.path);

    const gyms = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          gyms.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (!gyms.length) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty.",
        savedFile: req.file.filename,
        savedPath: req.file.path,
      });
    }

    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [lastGymRows] = await connection.query(`
      SELECT id
      FROM gym_management
      ORDER BY id DESC
      LIMIT 1
    `);

    let nextNumber = lastGymRows.length
      ? Number(lastGymRows[0].id) + 1
      : 1;

    const insertedGyms = [];
    const skippedRows = [];

    for (let index = 0; index < gyms.length; index++) {
      const row = gyms[index];

      const csvRowNumber = index + 2;

      const gym_name = String(row.gym_name || "").trim();
      const mobile = String(row.mobile || "").trim();
      const email = String(row.email || "").trim();
      const address = String(row.address || "").trim();
      const city = String(row.city || "").trim();
      const state = String(row.state || "").trim();
      const pincode = String(row.pincode || "").trim();

      if (!gym_name || !mobile || !address || !city || !state || !pincode) {
        skippedRows.push({
          row: csvRowNumber,
          gym_name: gym_name || null,
          reason:
            "gym_name, mobile, address, city, state and pincode are required.",
        });
        continue;
      }

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        skippedRows.push({
          row: csvRowNumber,
          gym_name,
          reason: "Invalid Indian mobile number.",
        });
        continue;
      }

      if (!/^\d{6}$/.test(pincode)) {
        skippedRows.push({
          row: csvRowNumber,
          gym_name,
          reason: "Invalid 6-digit pincode.",
        });
        continue;
      }

      const cleanEmail =
        email && email.toLowerCase() !== "null" ? email : null;

      if (
        cleanEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
      ) {
        skippedRows.push({
          row: csvRowNumber,
          gym_name,
          reason: "Invalid email address.",
        });
        continue;
      }

      const [mobileExists] = await connection.query(
        `
        SELECT id
        FROM gym_management
        WHERE mobile = ?
        LIMIT 1
        `,
        [mobile]
      );

      if (mobileExists.length) {
        skippedRows.push({
          row: csvRowNumber,
          gym_name,
          reason: "Mobile number already exists.",
        });
        continue;
      }

      if (cleanEmail) {
        const [emailExists] = await connection.query(
          `
          SELECT id
          FROM gym_management
          WHERE email = ?
          LIMIT 1
          `,
          [cleanEmail]
        );

        if (emailExists.length) {
          skippedRows.push({
            row: csvRowNumber,
            gym_name,
            reason: "Email already exists.",
          });
          continue;
        }
      }

      const owner_id = String(nextNumber).padStart(10, "0");
      const gym_id = String(nextNumber).padStart(10, "0");

      const [result] = await connection.query(
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
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          owner_id,
          gym_id,
          gym_name,
          address,
          city,
          row.city_id || null,
          row.area_id || null,
          row.subarea_id || null,
          row.area || null,
          row.sub_area || null,
          pincode,
          state,
          row.latitude || null,
          row.longitude || null,
          mobile,
          cleanEmail,
          row.admin_approval_status || "pending",
          row.admin_remarks || null,
          Number(row.submitted_for_review) || 0,
          Number(row.submitted_for_review) === 1 ? new Date() : null,
          new Date(),
          row.status || "1",
          row.gym_type || "Unisex",
          row.timing || null,
          row.description || null,
          row.website || null,
          Number(row.is_verified) || 0,
          Number(row.is_zymgoo_trusted) || 0,
          Number(row.is_top_search) || 0,
          row.admission_fee || null,
          row.meta_title || null,
          row.meta_description || null,
          row.meta_keywords || null,
        ]
      );

      insertedGyms.push({
        row: csvRowNumber,
        database_id: result.insertId,
        owner_id,
        gym_id,
        gym_name,
        mobile,
      });

      nextNumber++;
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Bulk gym upload completed.",

      savedFile: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      },

      totalRows: gyms.length,
      insertedCount: insertedGyms.length,
      skippedCount: skippedRows.length,

      insertedGyms,
      skippedRows,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Bulk gym upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload gyms.",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }

    // IMPORTANT:
    // Do not delete req.file.path here.
    // The CSV remains saved inside backend/uploads/csv/
  }
};

module.exports = {
  bulkUploadGym,
};