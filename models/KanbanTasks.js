const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ActivityLogs = require("./ActivityLogs");

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
      type: DataTypes.DATE,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.INTEGER,
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

module.exports = KanbanTasks;
