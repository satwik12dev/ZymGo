const db = require("../../config/pool");

// ADD SUB CATEGORY
const addSubCategory = async (req, res) => {
  try {
    const { cate_id, sub_name, status = 1 } = req.body;

    const sub_image = req.file
      ? `uploads/subcategories/${req.file.filename}`
      : null;

    if (!cate_id || !sub_name) {
      return res.status(400).json({
        success: false,
        message: "cate_id and sub_name are required",
      });
    }

    const [category] = await db.query(
      "SELECT id, cate_name FROM categories WHERE id = ?",
      [cate_id]
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM sub_categories WHERE cate_id = ? AND sub_name = ?",
      [cate_id, sub_name]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Sub category already exists in this category",
      });
    }

    const [result] = await db.query(
      `INSERT INTO sub_categories (cate_id, sub_name, sub_image, status)
       VALUES (?, ?, ?, ?)`,
      [cate_id, sub_name, sub_image, status]
    );

    const [newSubCategory] = await db.query(
      `SELECT 
        sc.id,
        sc.cate_id,
        c.cate_name,
        sc.sub_name,
        sc.sub_image,
        sc.status
      FROM sub_categories sc
      JOIN categories c ON c.id = sc.cate_id
      WHERE sc.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Sub category added successfully",
      data: newSubCategory[0],
    });
  } catch (error) {
    console.error("Add sub category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add sub category",
      error: error.message,
    });
  }
};

// GET ALL SUB CATEGORIES
const getAllSubCategories = async (req, res) => {
  try {
    const { cate_id, status, search } = req.query;

    let query = `
      SELECT
        sc.id,
        sc.cate_id,
        c.cate_name,
        c.image AS category_image,
        sc.sub_name,
        sc.sub_image,
        sc.status
      FROM sub_categories sc
      JOIN categories c ON c.id = sc.cate_id
      WHERE 1 = 1
    `;

    const values = [];

    if (cate_id) {
      query += " AND sc.cate_id = ?";
      values.push(cate_id);
    }

    if (status !== undefined) {
      query += " AND sc.status = ?";
      values.push(status);
    }

    if (search) {
      query += `
        AND (
          sc.sub_name LIKE ?
          OR c.cate_name LIKE ?
        )
      `;
      values.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY sc.id DESC";

    const [subCategories] = await db.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Sub categories fetched successfully",
      total: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    console.error("Get sub categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sub categories",
      error: error.message,
    });
  }
};

// GET SUB CATEGORY BY ID OR NAME
const getSubCategoryByIdOrName = async (req, res) => {
  try {
    const { idOrName } = req.params;

    const isId = /^\d+$/.test(idOrName);

    let query = `
      SELECT
        sc.id,
        sc.cate_id,
        c.cate_name,
        c.image AS category_image,
        sc.sub_name,
        sc.sub_image,
        sc.status
      FROM sub_categories sc
      INNER JOIN categories c ON c.id = sc.cate_id
      WHERE
    `;

    let values = [];

    if (isId) {
      query += "sc.id = ?";
      values = [Number(idOrName)];
    } else {
      query += "LOWER(sc.sub_name) LIKE LOWER(?)";
      values = [`%${idOrName}%`];
    }

    const [rows] = await db.query(query, values);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: `Sub category not found for: ${idOrName}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub category fetched successfully",
      total: rows.length,
      data: isId ? rows[0] : rows,
    });
  } catch (error) {
    console.error("Get sub category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sub category",
      error: error.message,
    });
  }
};

// UPDATE SUB CATEGORY
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cate_id, sub_name, status } = req.body;

    const [existingSubCategory] = await db.query(
      "SELECT * FROM sub_categories WHERE id = ?",
      [id]
    );

    if (existingSubCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub category not found",
      });
    }

    const current = existingSubCategory[0];

    const updatedCateId = cate_id ?? current.cate_id;
    const updatedSubName = sub_name ?? current.sub_name;
    const updatedStatus = status ?? current.status;

    const updatedImage = req.file
      ? `uploads/subcategories/${req.file.filename}`
      : current.sub_image;

    const [category] = await db.query(
      "SELECT id FROM categories WHERE id = ?",
      [updatedCateId]
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    const [duplicate] = await db.query(
      `SELECT id FROM sub_categories
       WHERE cate_id = ? AND sub_name = ? AND id != ?`,
      [updatedCateId, updatedSubName, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A sub category with this name already exists in this category",
      });
    }

    await db.query(
      `UPDATE sub_categories
       SET cate_id = ?, sub_name = ?, sub_image = ?, status = ?
       WHERE id = ?`,
      [updatedCateId, updatedSubName, updatedImage, updatedStatus, id]
    );

    const [updatedSubCategory] = await db.query(
      `SELECT
        sc.id,
        sc.cate_id,
        c.cate_name,
        sc.sub_name,
        sc.sub_image,
        sc.status
      FROM sub_categories sc
      JOIN categories c ON c.id = sc.cate_id
      WHERE sc.id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Sub category updated successfully",
      data: updatedSubCategory[0],
    });
  } catch (error) {
    console.error("Update sub category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update sub category",
      error: error.message,
    });
  }
};

// DELETE SUB CATEGORY
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      "SELECT id, sub_name FROM sub_categories WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub category not found",
      });
    }

    await db.query("DELETE FROM sub_categories WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Sub category deleted successfully",
      deleted_data: existing[0],
    });
  } catch (error) {
    console.error("Delete sub category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete sub category",
      error: error.message,
    });
  }
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  getSubCategoryByIdOrName,
  updateSubCategory,
  deleteSubCategory,
};