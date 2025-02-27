const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class EverydayTime extends Model {}

EverydayTime.init(
  {
    date: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    totalTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'EverydayTime',
    tableName: 'everydayTime' // Adjust if table name differs
  }
);

module.exports = EverydayTime;
