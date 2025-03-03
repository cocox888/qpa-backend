const KanbanTasks = require("../../models/KanbanTasks");

class KanbanService {
  async createKanbanTask(data) {
    try {
      const kanbanTask = await KanbanTasks.create(data);
      return kanbanTask;
    } catch (e) {
      throw new Error("Kanban Task not created");
    }
  }

  async getAllKanbanTask() {
    try {
      const kanbanTasks = await KanbanTasks.findAll();
      // console.log(kanbanTasks)
      return kanbanTasks;
    } catch (e) {
      throw new Error("Kanban Tasks Fetch Failed");
    }
  }

}

module.exports = new KanbanService();
