const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed
const Project = require('./Project');
const User = require('./User');

const ActivityLogs = sequelize.define(
  'ActivityLogs',
  {
    project_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    log_phase: {
      type: DataTypes.STRING,
      allowNull: true
    },

    log_hour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    action_type: {
      type: DataTypes.STRING,
      allowNull: true
    },

    project_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activity_description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ActivityLogs',
    tableName: 'activity_logs',
    underscored: true,
    timestamps: true
  }
);

Project.hasMany(ActivityLogs, {
  foreignKey: 'project_id',
  as: 'projectHasLogs',
  onDelete: 'CASCADE'
});

ActivityLogs.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'logBelongProject'
});

ActivityLogs.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'activity_user'
});

User.hasMany(ActivityLogs, {
  foreignKey: 'user_id',
  as: 'user_activity',
  onDelete: 'CASCADE'
});

module.exports = ActivityLogs;
