const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "resume"
);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const filename =
      `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.pdf`;

    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension !== ".pdf" || file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF resumes are allowed"));
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
}).single("resume");

const uploadResume = (req, res, next) => {
  multerUpload(req, res, (error) => {
    if (!error) return next();

    const statusCode =
      error instanceof multer.MulterError ? 400 : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5 MB or smaller"
          : error.code === "LIMIT_UNEXPECTED_FILE"
          ? "Upload your file using the field name 'resume'"
          : error.message
    });
  });
};

module.exports = { uploadResume };