const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('./User');

const Client = sequelize.define(
  'Client',
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    personal_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferred_contact_method: {
      type: DataTypes.STRING
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    default_services: {
      type: DataTypes.STRING,
      allowNull: true
    },
    other_services: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priorities: {
      type: DataTypes.STRING,
      allowNull: true
    },
    support_hours: {
      type: DataTypes.STRING,
      allowNull: true
    },
    use_tools: {
      type: DataTypes.STRING,
      allowNull: true
    },
    access_specific: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_share_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    required_access: {
      type: DataTypes.STRING,
      allowNull: true
    },
    often: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    receive_updates: {
      type: DataTypes.STRING,
      allowNull: true
    },
    key_people: {
      type: DataTypes.STRING,
      allowNull: true
    },
    particular_task: {
      type: DataTypes.STRING,
      allowNull: true
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priority_tasks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billing_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billing_cycle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoice_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_relationship: {
      type: DataTypes.STRING,
      allowNull: true
    },
    digital_sign: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sign_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agree_to_terms: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    agreementDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deadlines: {
      type: DataTypes.STRING,
      allowNull: true
    },
    update_frequency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stakeholders: {
      type: DataTypes.STRING,
      allowNull: true
    },
    update_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hours_needed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tools_to_access: {
      type: DataTypes.STRING,
      allowNull: true
    },
    need_access: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripe_account_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripe_account_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ref_token: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'clients',
    underscored: true
  }
);

Client.prototype.getResult = function () {
  return `${this.first_name} ${this.last_name}`;
};

// Hooks for password hashing
Client.beforeCreate(async (client) => {
  if (client.password) {
    client.password = await bcrypt.hash(client.password, 10);
  }
});

// Static method for password comparison
Client.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = Client;
