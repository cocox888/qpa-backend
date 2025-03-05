const express = require("express");
const UploadController = require("../controller/UploadController");
const app = express();

const router = express.Router();

router.post("/upload", UploadController.upload);

module.exports = router;
