const pool = require("../../config/pool");

const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid gym id is required.",
      });
    }

    const [gymRows] = await pool.query(
      `
        SELECT id, gym_id, gym_name, owner_id
        FROM gym_management
        WHERE id = ?
      `,
      [id]
    );

    if (!gymRows.length) {
      return res.status(404).json({
        success: false,
        message: "Gym not found.",
      });
    }

    const gym = gymRows[0];

    await pool.query(
      `DELETE FROM gym_management WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Gym deleted successfully.",
      deletedGym: {
        id: gym.id,
        gym_id: gym.gym_id,
        owner_id: gym.owner_id,
        gym_name: gym.gym_name,
      },
    });
  } catch (error) {
    console.error("Delete gym error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete gym.",
      error: error.message,
    });
  }
};

module.exports = { deleteGym };