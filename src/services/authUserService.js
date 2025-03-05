const User = require("../../models/User");
const Project = require("../../models/Project");
const Task = require("../../models/Task");

class AuthUserService {
  async createUser(data) {
    const { email } = data;
    console.log(data);
    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }
    const avatar = "uploads/no-image.jpg";
    // Create and return the new user
    try {
      const user = await User.create(data);
      return user;
    } catch (e) {
      throw new Error("User Create Failed");
    }
  }

  async findUserByEmail(data) {
    const { email } = data;
    return await User.findOne(
      { where: { email } },
      {
        include: [
          {
            model: Project,
            as: "assignedUserProject",
          },
          {
            model: Task,
            as: "assignedUserTask",
          },
        ],
      }
    );
  }

  async getAllUsers() {
    return await User.findAll({
      include: [
        {
          model: Project,
          as: "assignedUserProject",
          attributes: ["id", "title"],
        },
        {
          model: Task,
          as: "assignedUserTask",
          attributes: ["id", "title", "state"],
        },
      ],
    });
  }

  // Get a User by ID
  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Project,
          as: "assignedUserProject",
          attributes: ["id", "title"],
        },
        {
          model: Task,
          as: "assignedUserTask",
          attributes: ["id", "title"],
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id, updates) {
    const user = await this.getUserById(id);
    return await user.update(updates);
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (user.photo) {
      try {
        fs.unlinkSync(path.resolve(user.photo));
      } catch (error) {
        console.error("Error deleting avatar file:", error);
      }
    }
    return await user.destroy();
  }
}

module.exports = new AuthUserService();
