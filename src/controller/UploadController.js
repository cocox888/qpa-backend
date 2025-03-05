const UploadService = require("../services/UploadService");

class UploadController {
  async upload(req, res) {
    const file = await UploadService.upload(req, res);
  }
}

module.exports = new UploadController();
