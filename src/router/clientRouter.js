const express = require('express');
const router = express.Router();
const app = express();

const ProjectController = require('../controller/ProjectController');

const UacPermission = require('../middleware/UacMiddleware');
const TaskController = require('../controller/TaskController');

const DownloadController = require('../controller/DownloadController');
const ActivityController = require('../controller/ActivityController');
const ReportController = require('../controller/ReportController');
const StripeController = require('../controller/StripeController');

//Router for project CRUD action.
router.post('/', async (req, res) => {
  res.status(200).json('OK');
});
router.get('/getAllProjects', ProjectController.getAllProjectsForClient);
router.get('/allTasks', TaskController.getAllTasksForClient);

router.post(
  '/dashboard/getprojectbyid',
  UacPermission('edit_task', 'delete_tasks'),
  ProjectController.getProjectById
);

router.get('/getAllReports', ReportController.getAllReportsForClient);

/**
 * Download File Data
 */
router.get('/download/:filename', DownloadController.downloadFile);

//Router for favourite Project action
router.post(
  '/dashboard/addfavourproject',
  ProjectController.addFavouriteProject
);
router.get(
  '/dashboard/getfavourproject',
  ProjectController.getAllFavouriteProjects
);
router.delete(
  '/dashboard/removefavour',
  ProjectController.removeFavouriteProject
);

//Router for favourite Project action
router.post('/dashboard/addfavortask', TaskController.addFavouriteTask);
router.get('/dashboard/getfavourtask', TaskController.getAllFavouriteTasks);
router.delete(
  '/dashboard/removefavourtask',
  TaskController.removeFavouriteTask
);

router.get('/getAllInvoice', StripeController.getInvoicesForClient);
// router.get('/getAllInvoice', StripeController.getInvoices);
router.post('/pay-invoice', StripeController.payInvoice);
router.post('/pay-default-invoice', StripeController.payInvoiceWithAttatched);

router.get('/paymentAttatched', StripeController.paymentAttatched);
router.post('/attach-payment-method', StripeController.attatchpayment);
router.get('/setup-intent', StripeController.createSetupIntent);

module.exports = router;
