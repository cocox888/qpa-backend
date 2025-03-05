const UploadService = require("../services/UploadService");
const multer = require("multer");
const { upload } = require("../../utils/storageSetup");

class UploadController {
  async upload(req, res) {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        res.status(400).send(err.message);
      } else if (err) {
        // An unknown error occurred when uploading
        res.status(400).send(err.message);
      } else {
        // File uploaded successfully
        console.log(req.file.filename)
        const parsedData = JSON.parse(req.body.extraData, (key, value) => {
          if (key === "file_size") {
            return parseFloat(value);
          }
          if(key == "file_path"){
            return req.file.filename;
          }
          return value;
        });

        const upload = await UploadService.createUpload(parsedData);
        const uploads = await UploadService.getAllUploads();
        res.status(201).json(uploads);
        // const upload = updateUploadDatabase(req.body.extraData);
      }
    });
  }

  async getAllUpload(req, res) {
    try {
      const uploads = await UploadService.getAllUploads();
      console.log(uploads);
      res.status(201).json(uploads);
    } catch (e) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UploadController();
