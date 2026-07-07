const db = require("../../config/pool");
const slugify = require("slugify");

const createUniqueSlug = async (connection, title) => {
  const baseSlug =
    slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    }) || `blog-${Date.now()}`;

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const [rows] = await connection.query(
      "SELECT id FROM blogs WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (rows.length === 0) {
      return slug;
    }

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
};

// POST /blogs/add-blog
const addBlog = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const {
      title,
      description,
      content,
      link_text,
      link_url,
      status = "draft",
      seo_title,
      seo_description,
      seo_keywords,
      city,
      blog_type = "normal",
      template_id,
      is_auto_generated = 0,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published",
      });
    }

    if (!["normal", "variable"].includes(blog_type)) {
      return res.status(400).json({
        success: false,
        message: "Blog type must be normal or variable",
      });
    }

    if (blog_type === "variable" && !content?.includes("{city}")) {
      return res.status(400).json({
        success: false,
        message:
          "Variable blog content must contain the {city} placeholder",
      });
    }

    const slug = await createUniqueSlug(connection, title.trim());

    const featureImage = req.files?.feature_image?.[0] || null;

    const image_url = featureImage
      ? `uploads/blogs/${featureImage.filename}`
      : null;

    const image_key = featureImage ? featureImage.filename : null;

    const [blogResult] = await connection.query(
      `INSERT INTO blogs (
        title,
        slug,
        description,
        content,
        image_url,
        image_key,
        link_text,
        link_url,
        status,
        seo_title,
        seo_description,
        seo_keywords,
        city,
        blog_type,
        template_id,
        is_auto_generated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        description?.trim() || null,
        content || null,
        image_url,
        image_key,
        link_text?.trim() || null,
        link_url?.trim() || null,
        status,
        seo_title?.trim() || null,
        seo_description?.trim() || null,
        seo_keywords?.trim() || null,
        city?.trim() || null,
        blog_type,
        template_id ? Number(template_id) : null,
        Number(is_auto_generated) ? 1 : 0,
      ]
    );

    const blogId = blogResult.insertId;

    const additionalImages = req.files?.additional_images || [];

    if (additionalImages.length > 0) {
      const values = additionalImages.map((file, index) => [
        blogId,
        `uploads/blogs/${file.filename}`,
        file.filename,
        null,
        index + 1,
      ]);

      await connection.query(
        `INSERT INTO blog_images (
          blog_id,
          image_url,
          image_key,
          image_title,
          sort_order
        ) VALUES ?`,
        [values]
      );
    }

    const [blogRows] = await connection.query(
      `SELECT
        id,
        title,
        slug,
        description,
        content,
        image_url,
        image_key,
        link_text,
        link_url,
        status,
        seo_title,
        seo_description,
        seo_keywords,
        city,
        blog_type,
        template_id,
        is_auto_generated,
        created_at,
        updated_at
      FROM blogs
      WHERE id = ?`,
      [blogId]
    );

    const [imageRows] = await connection.query(
      `SELECT
        id,
        blog_id,
        image_url,
        image_key,
        image_title,
        sort_order,
        created_at
      FROM blog_images
      WHERE blog_id = ?
      ORDER BY sort_order ASC`,
      [blogId]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: {
        ...blogRows[0],
        additional_images: imageRows,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Add blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// GET /blogs/get-blogs?page=1&limit=10&search=&status=&blog_type=&city=
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      blog_type,
      city,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const offset = (currentPage - 1) * pageLimit;

    let whereClause = "WHERE 1 = 1";
    const values = [];

    if (search.trim()) {
      whereClause += `
        AND (
          b.title LIKE ?
          OR b.description LIKE ?
          OR b.slug LIKE ?
          OR b.seo_keywords LIKE ?
        )
      `;

      const searchValue = `%${search.trim()}%`;
      values.push(searchValue, searchValue, searchValue, searchValue);
    }

    if (status) {
      if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be draft or published",
        });
      }

      whereClause += " AND b.status = ?";
      values.push(status);
    }

    if (blog_type) {
      whereClause += " AND b.blog_type = ?";
      values.push(blog_type);
    }

    if (city) {
      whereClause += " AND b.city LIKE ?";
      values.push(`%${city}%`);
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM blogs b ${whereClause}`,
      values
    );

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / pageLimit);

    const [blogs] = await db.query(
      `SELECT
        b.id,
        b.title,
        b.slug,
        b.description,
        b.content,
        b.image_url,
        b.image_key,
        b.link_text,
        b.link_url,
        b.status,
        b.seo_title,
        b.seo_description,
        b.seo_keywords,
        b.city,
        b.blog_type,
        b.template_id,
        b.is_auto_generated,
        b.created_at,
        b.updated_at,
        COUNT(bi.id) AS additional_images_count
      FROM blogs b
      LEFT JOIN blog_images bi ON bi.blog_id = b.id
      ${whereClause}
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, pageLimit, offset]
    );

    const blogIds = blogs.map((blog) => blog.id);

    let images = [];

    if (blogIds.length > 0) {
      const [imageRows] = await db.query(
        `SELECT
          id,
          blog_id,
          image_url,
          image_key,
          image_title,
          sort_order,
          created_at
        FROM blog_images
        WHERE blog_id IN (?)
        ORDER BY blog_id ASC, sort_order ASC`,
        [blogIds]
      );

      images = imageRows;
    }

    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      additional_images: images.filter(
        (image) => image.blog_id === blog.id
      ),
    }));

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        total_pages: totalPages,
        has_next_page: currentPage < totalPages,
        has_previous_page: currentPage > 1,
      },
      data: formattedBlogs,
    });
  } catch (error) {
    console.error("Get all blogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// PUT /blogs/update-blog/:id
const updateBlog = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;

    const [existingRows] = await connection.query(
      "SELECT * FROM blogs WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const currentBlog = existingRows[0];

    const {
      title,
      description,
      content,
      link_text,
      link_url,
      status,
      seo_title,
      seo_description,
      seo_keywords,
      city,
      blog_type,
      template_id,
      is_auto_generated,
      remove_image_ids,
    } = req.body;

    if (status && !["draft", "published"].includes(status)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Status must be draft or published",
      });
    }

    if (blog_type && !["normal", "variable"].includes(blog_type)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Blog type must be normal or variable",
      });
    }

    const updatedTitle = title?.trim() || currentBlog.title;
    const updatedBlogType = blog_type || currentBlog.blog_type;
    const updatedContent =
      content !== undefined ? content : currentBlog.content;

    if (
      updatedBlogType === "variable" &&
      !updatedContent?.includes("{city}")
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Variable blog content must contain {city}",
      });
    }

    let updatedSlug = currentBlog.slug;

    if (title && title.trim() !== currentBlog.title) {
      updatedSlug = await createUniqueSlug(connection, title.trim());
    }

    const featureImage = req.files?.feature_image?.[0];

    const updatedImageUrl = featureImage
      ? `uploads/blogs/${featureImage.filename}`
      : currentBlog.image_url;

    const updatedImageKey = featureImage
      ? featureImage.filename
      : currentBlog.image_key;

    await connection.query(
      `UPDATE blogs SET
        title = ?,
        slug = ?,
        description = ?,
        content = ?,
        image_url = ?,
        image_key = ?,
        link_text = ?,
        link_url = ?,
        status = ?,
        seo_title = ?,
        seo_description = ?,
        seo_keywords = ?,
        city = ?,
        blog_type = ?,
        template_id = ?,
        is_auto_generated = ?
      WHERE id = ?`,
      [
        updatedTitle,
        updatedSlug,
        description !== undefined
          ? description?.trim() || null
          : currentBlog.description,
        updatedContent || null,
        updatedImageUrl,
        updatedImageKey,
        link_text !== undefined
          ? link_text?.trim() || null
          : currentBlog.link_text,
        link_url !== undefined
          ? link_url?.trim() || null
          : currentBlog.link_url,
        status || currentBlog.status,
        seo_title !== undefined
          ? seo_title?.trim() || null
          : currentBlog.seo_title,
        seo_description !== undefined
          ? seo_description?.trim() || null
          : currentBlog.seo_description,
        seo_keywords !== undefined
          ? seo_keywords?.trim() || null
          : currentBlog.seo_keywords,
        city !== undefined ? city?.trim() || null : currentBlog.city,
        updatedBlogType,
        template_id !== undefined
          ? template_id
            ? Number(template_id)
            : null
          : currentBlog.template_id,
        is_auto_generated !== undefined
          ? Number(is_auto_generated)
            ? 1
            : 0
          : currentBlog.is_auto_generated,
        id,
      ]
    );

    // Remove selected additional images
    if (remove_image_ids) {
      let imageIds = remove_image_ids;

      if (typeof imageIds === "string") {
        try {
          imageIds = JSON.parse(imageIds);
        } catch {
          imageIds = imageIds.split(",");
        }
      }

      if (Array.isArray(imageIds) && imageIds.length > 0) {
        const validIds = imageIds
          .map((imageId) => Number(imageId))
          .filter(Boolean);

        if (validIds.length > 0) {
          await connection.query(
            "DELETE FROM blog_images WHERE blog_id = ? AND id IN (?)",
            [id, validIds]
          );
        }
      }
    }

    // Add new additional images
    const additionalImages = req.files?.additional_images || [];

    if (additionalImages.length > 0) {
      const [lastImageRows] = await connection.query(
        `SELECT COALESCE(MAX(sort_order), 0) AS last_sort_order
         FROM blog_images
         WHERE blog_id = ?`,
        [id]
      );

      const lastSortOrder = lastImageRows[0].last_sort_order;

      const imageValues = additionalImages.map((file, index) => [
        id,
        `uploads/blogs/${file.filename}`,
        file.filename,
        null,
        lastSortOrder + index + 1,
      ]);

      await connection.query(
        `INSERT INTO blog_images
        (blog_id, image_url, image_key, image_title, sort_order)
        VALUES ?`,
        [imageValues]
      );
    }

    const [updatedBlogRows] = await connection.query(
      "SELECT * FROM blogs WHERE id = ?",
      [id]
    );

    const [updatedImages] = await connection.query(
      `SELECT *
       FROM blog_images
       WHERE blog_id = ?
       ORDER BY sort_order ASC`,
      [id]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: {
        ...updatedBlogRows[0],
        additional_images: updatedImages,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Update blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// DELETE /blogs/delete-blog/:id
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [blogRows] = await db.query(
      `SELECT
        id,
        title,
        slug,
        image_url,
        image_key,
        status
      FROM blogs
      WHERE id = ?`,
      [id] 
    );

    if (blogRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // blog_images delete automatically because of ON DELETE CASCADE
    await db.query("DELETE FROM blogs WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      deleted_blog: blogRows[0],
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
};