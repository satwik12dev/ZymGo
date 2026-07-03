 const pool = require("../../config/pool");
const fs = require("fs");
const path = require("path");

// Add category
const addCategory = async (req, res) => {
  try {
    const { cate_name, status = 1 } = req.body;

    if (!cate_name || cate_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const [existingCategory] = await pool.query(
      "SELECT id FROM categories WHERE LOWER(cate_name) = LOWER(?)",
      [cate_name.trim()]
    );

    if (existingCategory.length > 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const image = req.file
      ? `/uploads/categories/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      `INSERT INTO categories (cate_name, image, status)
       VALUES (?, ?, ?)`,
      [cate_name.trim(), image, Number(status)]
    );

    const [newCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory[0],
    });
  } catch (error) {
    console.error("Add category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: error.message,
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = "SELECT * FROM categories WHERE 1=1";
    const values = [];

    if (search) {
      query += " AND cate_name LIKE ?";
      values.push(`%${search}%`);
    }

    if (status !== undefined && status !== "") {
      query += " AND status = ?";
      values.push(Number(status));
    }

    query += " ORDER BY id DESC";

    const [categories] = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      total_categories: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get category by id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [category] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cate_name, status } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const currentCategory = existing[0];

    let image = currentCategory.image;

    if (req.file) {
      image = `/uploads/categories/${req.file.filename}`;

      if (
        currentCategory.image &&
        currentCategory.image.startsWith("/uploads/")
      ) {
        const oldImagePath = path.join(
          process.cwd(),
          currentCategory.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedName =
      cate_name && cate_name.trim() !== ""
        ? cate_name.trim()
        : currentCategory.cate_name;

    const updatedStatus =
      status !== undefined && status !== ""
        ? Number(status)
        : currentCategory.status;

    await pool.query(
      `UPDATE categories
       SET cate_name = ?, image = ?, status = ?
       WHERE id = ?`,
      [updatedName, image, updatedStatus, id]
    );

    const [updatedCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory[0],
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [category] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryData = category[0];

    if (
      categoryData.image &&
      categoryData.image.startsWith("/uploads/")
    ) {
      const imagePath = path.join(process.cwd(), categoryData.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};