const KanbanService = require("../services/KanbanService");
const kanbanService = require("../services/KanbanService");

class KanbanController {
  async createKanbanTask(req, res) {
    try {
      const kanbanTask = await kanbanService.createKanbanTask(req.body);
      res
        .status(201)
        .json({ message: "KanbanTask Created successfully", kanbanTask });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getAllKanbanTask(req, res) {
    try {
      const kanbanTasks = await KanbanService.getAllKanbanTask();
      console.log(kanbanTasks);
      res.status(201).json(kanbanTasks);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async updateKanbanTaskStatusById(req, res) {
    try {
      const kanbanTask = await KanbanService.updateKanbanTaskStatusById(
        req.body
      );

      res.status(201).json(kanbanTask);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async updateKanbanTaskById(req, res) {
    try {
      const kanbanTask = await KanbanService.updateKanbanTaskById(req.body);
      res.status(201).json(kanbanTask);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteTaskById(req, res) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const kanbanTask = await KanbanService.deleteTaskById(taskId);
      res.status(201).json(kanbanTask);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new KanbanController();
