const express = require('express');
const router = express.Router();
const app = express();

const ProjectController = require('../controller/ProjectController');

const UacPermission = require('../middleware/UacMiddleware');
const TaskController = require('../controller/TaskController');
const UserController = require('../controller/UserController');
const ClientController = require('../controller/ClientController');
const TimeTrackController = require('../controller/TimeTrackController');
const KanbanController = require('../controller/KanbanController');
const DownloadController = require('../controller/DownloadController');

//Router for project CRUD action.
router.post('/', async (req, res) => {
  res.status(200).json('OK');
});

router.get('/allTasks', TaskController.getAllTasksForUser);
router.get('/getAllProjects', ProjectController.getAllProjectsForUser);

router.get('/getAllMembers', UserController.getAllUsers);
router.get('/clients', ClientController.getAllClients);
router.get('/activeProjects', ProjectController.getActiveProjects);
router.get('/tasksInProgress', TaskController.getTasksInProgress);
router.get('/getAllProjects', ProjectController.getAllProjectsForUser);
router.post('/getprojectbyid', ProjectController.getProjectById);

/**
 * Task Management
 */
router.post('/createTask', TaskController.createTask);
router.post('/updateTaskbyId', TaskController.updateTaskbyId);
router.delete('/deleteTask', TaskController.deleteTask);
router.post('/createKanbanBoardTask', KanbanController.createKanbanTask);
router.get('/getAllKanbanTasks', KanbanController.getAllKanbanTaskForUser);
router.post('/updateKanbanTaskById', KanbanController.updateKanbanTaskById);
router.post(
  '/updateKanbanTaskStatusById',
  KanbanController.updateKanbanTaskStatusById
);
/**
 * Download File Data
 */
router.get('/download/:filename', DownloadController.downloadFile);
/**
 * Team Member Management
 */
router.post('/createMembers', UserController.signup);
/**
 * Get Time Data For Project
 */
router.post('/getTimeDataForProject', ProjectController.getTimeData);

// Time Track Route
router.get('/getAllTimeTracks', TimeTrackController.getAllTimeTracksForPeriod);

/**
 * Project Management
 */
router.post('/updateProjectPhase', ProjectController.updateProjectPhase);

module.exports = router;
