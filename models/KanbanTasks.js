const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const KanbanTasks = sequelize.define(
  "KanbanTasks",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "KanbanTasks",
    tableName: "kanbanTasks",
    underscored: true,
    timestamps: true,
  }
);

User.hasMany(KanbanTasks, {
  foreignKey: "user_id",
  as: "userHasKanban",
  onDelete: "CASCADE",
});

KanbanTasks.belongsTo(User, {
  foreignKey: "user_id",
  as: "kanbanToUser",
});

module.exports = KanbanTasks;
