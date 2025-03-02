const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path as needed
const Project = require("./Project");

const ActivityLogs = sequelize.define(
  "ActivityLogs",
  {
    project_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    log_phase: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    log_hour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    action_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    project_name: {
      type: DataTypes.STRING, // Changed from INTEGER to STRING
      allowNull: true,
    },
    user_name: {
      type: DataTypes.STRING, // Changed from INTEGER to STRING
      allowNull: true,
    },
    task_name: {
      type: DataTypes.STRING, // Changed from INTEGER to STRING
      allowNull: true,
    },
    activity_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ActivityLogs",
    tableName: "activity_logs",
    underscored: true,
    timestamps: true, // Enables createdAt & updatedAt fields
  }
);

Project.hasMany(ActivityLogs, {
  foreignKey: "project_id",
  as: "projectHasLogs",
  onDelete: "CASCADE",
});

ActivityLogs.belongsTo(Project, {
  foreignKey: "project_id",
  as: "logBelongProject",
});

module.exports = ActivityLogs;
