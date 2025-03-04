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
router.get('/getAllKanbanTasks', KanbanController.getAllKanbanTask);
router.post('/updateKanbanTaskById', KanbanController.updateKanbanTaskById);
router.post('/updateKanbanTaskStatusById', KanbanController.updateKanbanTaskStatusById)
router.delete('/kanbanTask/:id',KanbanController.deleteTaskById);
/**
 * Download File Data
 */
router.get('/download/:filename', DownloadController.downloadFile);
/**
 * Team Member Management
 */
router.post('/createMembers', UserController.signup)
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
router.get(
  '/allTasks',
  // UacPermission('edit_task', 'delete_tasks'),
  TaskController.getAllTasks
);
router.get(
  '/dashboard',
  UacPermission('edit_project', 'delete_projects'),
  ProjectController.getAllProjects
);
router.get(
  '/dashboard/favouriteproject',
  UacPermission('edit_project', 'delete_projects'),
  ProjectController.getAllFavouriteProjects
);

router.put(
  '/dashboard/updateproject',
  UacPermission('edit_project', 'delete_projects'),
  ProjectController.updateProject
);
router.delete(
  '/dashboard/deleteproject',
  UacPermission('edit_project', 'delete_projects'),
  ProjectController.deleteProject
);

router.post(
  '/dashboard/getprojectforuser',
  UacPermission('edit_project', 'delete_projects'),
  ProjectController.getAllProjectByUserEmail
);

router.post(
  '/dashboard/getprojectbyid',
  UacPermission('edit_task', 'delete_tasks'),
  ProjectController.getProjectById
);

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

//Router for task CRUD action.
router.get(
  '/dashboard/favouriteproject',
  UacPermission('edit_task', 'delete_tasks'),
  TaskController.getAllFavouriteTasks
);

router.put(
  '/dashboard/updatetask',
  UacPermission('edit_task', 'delete_tasks'),
  TaskController.updateTask
);

router.post(
  '/dashboard/gettaskforuser',
  UacPermission('edit_task', 'delete_tasks'),
  TaskController.getAllTasksForUser
);
router.post(
  '/dashboard/gettaskbyid',
  UacPermission('edit_task', 'delete_tasks'),
  TaskController.getTaskById
);

//Router for favourite Project action
router.post('/dashboard/addfavortask', TaskController.addFavouriteTask);
router.get('/dashboard/getfavourtask', TaskController.getAllFavouriteTasks);
router.delete(
  '/dashboard/removefavourtask',
  TaskController.removeFavouriteTask
);

//Router for change permissions for each role.

module.exports = router;
