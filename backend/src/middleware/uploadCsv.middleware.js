const multer = require("multer");
const path = require("path");
const fs = require("fs");

// If this file is inside backend/src/middleware/
// this resolves to backend/uploads/csv/
const uploadPath = path.join(__dirname, "../../uploads/csv");

// Create folder automatically
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

console.log("CSV files will save in:", uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const fileName = `gym-upload-${Date.now()}-${Math.round(
      Math.random() * 1000000000
    )}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const isCsv =
    file.mimetype === "text/csv" ||
    file.originalname.toLowerCase().endsWith(".csv");

  if (!isCsv) {
    return cb(new Error("Only CSV files are allowed."));
  }

  cb(null, true);
};

const uploadCsv = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadCsv;