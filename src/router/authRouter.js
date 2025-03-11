const express = require('express');
const app = express();
const {
  validateClient,
  validateUser
} = require('../middleware/validateRequest');
const router = express.Router();

const UserController = require('../controller/UserController');
const ClientController = require('../controller/ClientController');
const LoginController = require('../controller/loginController');

const handleSignout = require('../controller/logout');
const { handleRef } = require('../controller/refreshToken');

const UacPermission = require('../middleware/UacMiddleware.js');
const { upload } = require('../services/UploadService.js');
const roleVerify = require('../middleware/roleVerify.js');
const TimeTrackController = require('../controller/TimeTrackController');
const DownloadController = require('../controller/DownloadController');
const ReportController = require('../controller/ReportController');

router.post('/register/user', validateUser, UserController.signup);

router.post('/register/confclient', ClientController.confClient);
router.post(
  '/register/client',
  validateClient,
  roleVerify('admin'),
  ClientController.createClient
);

router.get('/newreport', ReportController.generateReport);

router.post('/login', LoginController.login);
router.post('/logout', handleSignout);
router.post('/refresh', handleRef);

router.post('/setTimeTrack', TimeTrackController.createTimeTrack);
router.get('/getTimeTracksForUser', TimeTrackController.getTimeTracksForUser);
router.get(
  '/getAllTimeTracksForUser',
  TimeTrackController.getAllTimeTracksForUser
);
router.post('/createClient', ClientController.createClient);

module.exports = router;
