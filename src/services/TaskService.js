const User = require('../../models/User');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Tag = require('../../models/Tag');
const Task = require('../../models/Task');
const {
  isTimestampToday,
  isTimestampWithinCurrentWeek,
  isWithinCurrentMonth
} = require('../../utils/Time.cjs');
const Activity = require('../../models/ActivityLogs');
const ActivityLogs = require('../../models/ActivityLogs');

class TaskService {
  //Create Task
  //Fundatmentally this role is only for admin and task manager.
  //To create Task we need client name, user name
  //Create the association between task and client and user
  async createTask(req) {
    const {
      title,
      require_time,
      projectId,
      description,
      priority,
      due_date,
      estimated_time,
      state,
      user_name
    } = req.data;

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Client,
          as: 'projectClient'
        }
      ]
    });

    if (!project) throw new Error('Project not found');

    const task = await Task.create({
      title,
      require_time,
      description,
      priority,
      due_date,
      estimated_time,
      state
    });
    await task.setTaskClient(project.projectClient);
    await task.setTaskProject(project);
    await task.setAssignedTaskUser(req.members);
    //////////////////////////
    // Total Time Update    //
    //////////////////////////

    if (isTimestampToday(task.createdAt)) {
      try {
        project.update({
          totalTimeForDay: estimated_time + project.totalTimeForDay
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }

    if (isTimestampWithinCurrentWeek(task.createdAt)) {
      try {
        project.update({
          totalTimeForWeek: estimated_time + project.totalTimeForWeek
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }
    if (isWithinCurrentMonth(task.createdAt)) {
      try {
        project.update({
          totalTimeForMonth: estimated_time + project.totalTimeForMonth
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }

    //////////////////////////
    // Activity Update      //
    //////////////////////////
    try {
      const activity = await ActivityLogs.create({
        project_name: project.title,
        user_name: user_name,
        task_name: task.title,
        project_type: project.package_type,
        action_type: 'Create',
        activity_description: '',
        project_id: project.id,
        log_hour: estimated_time
      });
    } catch (e) {
      throw new Error('Activity Update Failed');
    }

    if (req.tags && req.tags.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const tags = await Tag.findAll({
        where: { title: req.tags }
      });
      if (tags.length !== req.tags.length) {
        throw new Error('Some tags not found');
      }
      await task.addAssignedTaskTag(tags);
    }

    if (req.members && req.members.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const users = await User.findAll({
        where: { id: req.members }
      });
      if (users.length !== req.members.length) {
        throw new Error('Some users not found');
      }
      await task.addAssignedTaskUser(users);
    }

    return { message: 'Task Successfully Created!' };
  }

  //Get all favourite task
  async getAllFavouriteTaskForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'favoriteUserTask'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.favoriteUserTask;
  }

  async getAllFavouriteTaskForClient(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'favoriteClientTask'
      }
    });
    if (!user) throw new Error('Client not found!');
    return user.favoriteClientTask;
  }

  //Add Favourite Task
  async addFavouriteTask(userinfo, taskID) {
    const { email } = userinfo;
    const task = await Task.findByPk(taskID);
    if (!task) throw new Error('Task Not Found.');
    const user = await User.findOne({ where: { email } });
    if (user) await user.addFavoriteUserTask(task);
    const client = await Client.findOne({ where: { email } });
    if (client) await client.addFavoriteClientTask(task);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Favourite Task Successfully added.' };
  }

  async removeFavouriteTask(userinfo, taskID) {
    const { email } = userinfo;
    const task = await Task.findByPk(taskID);
    if (!task) {
      throw new Error('Task not found.');
    }
    const user = await User.findOne({ where: { email } });
    if (user) await user.removeFavoriteTask(task);
    const client = await Client.findOne({ where: { email } });
    if (client) await user.removeFavoriteTask(task);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Task Favour Successfully removed.' };
  }

  //Get all tasks with associated users and clients.
  async getAllTasksForClient(userId) {
    const user = await Client.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          }
        ],
        as: 'clientTask'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.clientTask;
  }

  //Get all tasks with associated users and clients.
  async getAllTasksForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          }
        ],
        as: 'assignedTaskUser'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.assignedTaskUser;
  }

  //Get all tasks By Id
  async getAllTasksByUserEmail(email) {
    const user = User.findOne({ where: { email: email } });
    if (user) return await this.getAllTasksForUser(user.id);
    const client = Client.findOne({ where: { email: email } });
    if (client) return await this.getAllTasksForClient(client.id);
    if (!user && !client) throw new Error('User not Found!');
  }
  //Get all tasks.
  async getAllTasks() {
    return await Task.findAll({
      include: [
        {
          model: Project,
          as: 'taskProject',
          attributes: ['id', 'title']
        },
        {
          model: Client,
          as: 'taskClient',
          attributes: ['id', 'full_name', 'business_name']
        },
        {
          model: User,
          as: 'assignedTaskUser',
          attributes: ['id', 'full_name', 'role']
        }
      ]
    });
  }

  async getTasksInProgress() {
    return await Task.findAndCountAll({
      where: { state: 'inprogress' }
    });
  }

  async getTaskById(id) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'taskProject'
        },
        {
          model: Client,
          as: 'taskClient'
        },
        {
          model: User,
          as: 'assignedTaskUser'
        },
        {
          model: Tag,
          as: 'assignedTaskTag'
        }
      ]
    });
    if (!task) throw new Error('Task not found');
    return task;
  }

  async updateTask(id, updates) {
    const { data, members, tags } = updates;
    console.log(updates);
    const task = await Task.findByPk(id);
    await task.update(data);
    if (client) {
      const upclient = await Client.findOne({ where: { full_name: client } });
      if (!upclient) {
        throw new Error('Client not found.');
      }
      // Update the association with Client
      await task.setTaskClient([upclient]);
    }
    // Step 3: Update Users (if userNames are provided as an array of usernames)
    if (members && members.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const upusers = await User.findAll({
        where: { full_name: members }
      });
      if (upusers.length !== members.length) {
        throw new Error('Some users not found');
      }
      if (tags && tags.length > 0) {
        // Find tags by their titles (assuming titles are unique)
        const uptags = await Tag.findAll({
          where: { title: req.tags }
        });
        if (uptags.length !== tags.length) {
          throw new Error('Some tags not found');
        }
        await Task.setAssignedTaskTag(tags);
      }

      // Update the association with Users
      await task.setAssignedTaskUser(upusers);
    }
    await task.save();
    return { message: 'Task updated successfully', task };
  }

  async deleteTask(id) {
    const task = await Task.findByPk(id);

    if (!task) {
      throw new Error('Task not found.');
    }

    await task.destroy();

    return { message: 'Task and its associations deleted successfully' };
  }

  async getProjectByTag(tagId) {
    const tag = await Tag.findByPk(tagId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'assignedTagTask'
      }
    });
    if (!tag) throw new Error('Tag not found!');
    return tag.setAssignedTagTask;
  }

  async updateTaskbyId(id, members, data) {
    const task = await Task.findByPk(id);
    // console.log("())()()())(" + task);
    const subTime = task.estimated_time;
    const addTime = data.estimated_time;
    await task.update(data);

    // console.log("-------------------" + subTime);
    const project = await Project.findByPk(data.projectId, {
      include: [
        {
          model: Client,
          as: 'projectClient'
        }
      ]
    });
    console.log(members);
    const assignedUsers = await task.getAssignedTaskUser();
    await task.removeAssignedTaskUser(assignedUsers);
    if (members && members.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const upusers = await User.findAll({
        where: { id: members }
      });
      if (upusers.length !== members.length) {
        throw new Error('Some users not found');
      }
      await task.addAssignedTaskUser(upusers);
    }
    // console.log(project);
    if (isTimestampToday(task.createdAt)) {
      try {
        project.update({
          totalTimeForDay: addTime + project.totalTimeForDay - subTime
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }

    if (isTimestampWithinCurrentWeek(task.createdAt)) {
      try {
        project.update({
          totalTimeForWeek: addTime + project.totalTimeForWeek - subTime
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }

    if (isWithinCurrentMonth(task.createdAt)) {
      try {
        project.update({
          totalTimeForMonth: addTime + project.totalTimeForMonth - subTime
        });
      } catch (e) {
        throw new Error('Project Update Failed');
      }
    }

    try {
      const activity = await ActivityLogs.create({
        project_name: project.title,
        user_name: data.user_name,
        task_name: task.title,
        project_type: project.package_type,
        action_type: 'Update',
        activity_description: '',
        project_id: project.id,
        log_hour: data.estimated_time
      });
    } catch (e) {
      throw new Error('Activity Update Failed');
    }
    if (!task) throw new Error('Task not found!');
    return task;
  }
}

module.exports = new TaskService();
