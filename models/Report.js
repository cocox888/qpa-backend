const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed
const Project = require('./Project');
const Client = require('./Client');

const Reports = sequelize.define(
  'Reports',
  {
    project_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    end_date: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Reports',
    tableName: 'reports',
    underscored: true,
    timestamps: true
  }
);

Project.hasMany(Reports, {
  foreignKey: 'project_id',
  as: 'projectHasReports',
  onDelete: 'CASCADE'
});

Reports.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'reportsBelongProject'
});

Client.hasMany(Reports, {
  foreignKey: 'client_id',
  as: 'clientReports',
  onDelete: 'CASCADE'
});

Reports.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'reportClient'
});

module.exports = Reports;
