const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Status = require('./Status');
const Task = require('./Task');
const Tag = require('./Tag');
const Workspace = require('./Workspace');

const ProjectInvoice = sequelize.define(
  'ProjectInvoice',
  {
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'project_invoice',
    timestamps: true
  }
);

module.exports = ProjectInvoice;
