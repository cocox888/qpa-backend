const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ref_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    underscored: true
  }
);

// Associations

// User.belongsToMany(require('./Meeting'), {
//   through: 'meeting_user',
// });
User.belongsToMany(require('./Workspace'), {
  through: 'workspace_user'
});
// User.hasMany(require('./LeaveRequest'), { foreignKey: 'user_id' });
// User.hasMany(require('./Note'), { foreignKey: 'creator_id' });
// User.hasMany(require('./TimeTracker'), { foreignKey: 'user_id' });
// User.hasMany(require('./Expense'), { foreignKey: 'user_id' });
// User.hasMany(require('./Payment'), { foreignKey: 'user_id' });

// Methods
User.prototype.getResult = function () {
  return `${this.first_name} ${this.last_name}`;
};

// Hooks for password hashing
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Static method for password comparison
User.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = User;
