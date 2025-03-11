const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');

const ProjectTimeLine = sequelize.define(
  'ProjectTimeLine',
  {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalTimeForDay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalTimeForWeek: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalTimeForMonth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    project_phase: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'ProjectTimeLine',
    timestamps: false
  }
);

Project.hasMany(ProjectTimeLine, {
  foreignKey: 'project_id',
  as: 'projectTimeLine',
  onDelete: 'CASCADE'
});

ProjectTimeLine.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'timeLineProject'
});

module.exports = ProjectTimeLine;
