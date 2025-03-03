const { where } = require("sequelize");
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
  async updateKanbanTaskById(data) {
    const {task_id, updated_status}=data;
    console.log(data)
    try {
      const kanbanTask = await KanbanTasks.findByPk(task_id);
      if(!kanbanTask){
        throw new Error("Kanban Task not founded");
      }
      await kanbanTask.update({status:updated_status})
      // console.log(kanbanTasks)
      return kanbanTask;

    } catch (e) {
      throw new Error("Kanban task status update failed");
    }
  }

}

module.exports = new KanbanService();
