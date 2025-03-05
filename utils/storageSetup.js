const multer = require("multer");
const path = require("path");

const fs = require("node:fs");
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
   
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    
    // Allow only specific file types
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
    }
  },
}).single("file"); // 'file' is the name attribute in the form

module.exports = { upload };
