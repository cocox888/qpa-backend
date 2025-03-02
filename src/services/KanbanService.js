const KanbanTasks = require("../../models/KanbanTasks");

class KanbanService {
  async createKanbanTask(data) {
    try{
        const kanbanTask =await KanbanTasks.create(data);
        return kanbanTask;
    }catch(e){
        throw new Error("Project not found!");
    }
  }
}


module.exports = new KanbanService();