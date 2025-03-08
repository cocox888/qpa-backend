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
const ActivityController = require('../controller/ActivityController');

//Router for project CRUD action.
router.post('/', async (req, res) => {
  res.status(200).json('Admin OK');
});

router.get('/getAllMembers', UserController.getAllUsers);
router.get('/clients', ClientController.getAllClients);
router.get('/activeProjects', ProjectController.getActiveProjects);
router.get('/tasksInProgress', TaskController.getTasksInProgress);
router.get('/getAllProjects', ProjectController.getAllProjects);
router.post('/createproject', ProjectController.createProject);
router.post('/getprojectbyid', ProjectController.getProjectById);

/**
 * Task Management
 */
router.post('/createTask', TaskController.createTask);
router.post('/updateTaskbyId', TaskController.updateTaskbyId);
router.delete('/deleteTask', TaskController.deleteTask);
/**
 * Kanban Task Management
 */
router.post('/createKanbanBoardTask', KanbanController.createKanbanTask);
router.get('/getAllKanbanTasks', KanbanController.getAllKanbanTaskForUser);
router.post('/updateKanbanTaskById', KanbanController.updateKanbanTaskById);
router.post(
  '/updateKanbanTaskStatusById',
  KanbanController.updateKanbanTaskStatusById
);
router.delete('/kanbanTask/:id', KanbanController.deleteTaskById);
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

router.post('/updateProjectPhase', ProjectController.updateProjectPhase);

router.post('/allActivityLogs', ActivityController.getAllActivityLogs);

router.get('/allTasks', TaskController.getAllTasks);

module.exports = router;
