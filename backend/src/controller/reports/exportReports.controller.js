const db = require("../../config/pool");
const { Parser } = require("json2csv");

const exportReports = async (req, res) => {
  try {
    const [gyms] = await db.query(`
      SELECT
        gm.id,
        gm.gym_id AS gymId,
        gm.gym_name AS gymName,
        gm.owner_id AS ownerId,
        gm.city,
        gm.state,
        gm.mobile,
        gm.email,
        gm.admin_approval_status AS approvalStatus,
        CASE
          WHEN gm.status = '1' THEN 'Active'
          ELSE 'Inactive'
        END AS gymStatus,
        gm.created_at AS createdAt
      FROM gym_management gm
      ORDER BY gm.created_at DESC
    `);

    const fields = [
      { label: "ID", value: "id" },
      { label: "Gym ID", value: "gymId" },
      { label: "Gym Name", value: "gymName" },
      { label: "Owner ID", value: "ownerId" },
      { label: "City", value: "city" },
      { label: "State", value: "state" },
      { label: "Mobile", value: "mobile" },
      { label: "Email", value: "email" },
      { label: "Approval Status", value: "approvalStatus" },
      { label: "Gym Status", value: "gymStatus" },
      { label: "Created At", value: "createdAt" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(gyms);

    const fileName = `gym-report-${Date.now()}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(fileName);

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Export reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export report",
      error: error.message,
    });
  }
};

module.exports = exportReports;