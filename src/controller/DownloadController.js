const UploadService = require("../services/UploadService");
const multer = require("multer");
const { upload } = require("../../utils/storageSetup");
const path = require("path");
const fs = require("fs");

class DownloadController {
  async downloadFile(req, res) {
    const fileName = req.params.filename;
    const parentDir = path.resolve(__dirname, "../..");
    const fileDirectory = path.join(parentDir, "uploads");
    const filePath = path.join(fileDirectory, fileName);
    const extname = path.extname(fileName).toLowerCase();
    // console.log(filePath);
    console.log(filePath);
    let contentType = "application/octet-stream"; // Default for binary files
    if (extname === ".pdf") {
      contentType = "application/pdf";
    } else if (extname === ".docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    // Set the Content-Type header
    res.setHeader("Content-Type", contentType);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Use res.download() to send the file as an attachment
      res.download(filePath, fileName, (err) => {
        if (err) {
          // Handle errors, e.g., log them and send a 500 status
          console.error("File download error:", err);
          res.status(500).send("Server error");
        }
      });
      console.log(filePath);
    } else {
      res.status(404).send("File not found");
    }
  }
}

module.exports = new DownloadController();
