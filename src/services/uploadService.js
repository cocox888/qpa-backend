const multer = require("multer");
const { upload } = require("../../utils/storageSetup");
const Upload = require("../../models/Upload");

class UploadService {
  async upload(req, res) {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        res.status(400).send(err.message);
      } else if (err) {
        // An unknown error occurred when uploading
        res.status(400).send(err.message);
      } else {
        // File uploaded successfully
        const upload = updateUploadDatabase()
        res.send("File uploaded successfully!");
      }
    });
  }

  async updateUploadDatabase(data) {
    try {
      const upload = Upload.create(data);
      return upload;
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new UploadService();
