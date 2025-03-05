const express = require('express');
const router = express.Router();
const app = express();

const TaskController = require('../controller/TaskController');
const ProjectController = require('../controller/ProjectController');
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

module.exports = router;
