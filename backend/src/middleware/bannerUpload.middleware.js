const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(process.cwd(), "uploads", "banners");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);

    cb(null, `banner-${uniqueName}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, MP4 and WEBM files are allowed"
      ),
      false
    );
  }
};

const bannerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = bannerUpload;