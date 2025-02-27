// services/roleService.js
const EverydayTime = require('../../models/EverydayTime'); // Import the Roles model

const setTotalTimeForDay = async (data) => {
  try {
    const totalTime=EverydayTime.create(data);
    return totalTime;
  } catch (error) {
    // biome-ignore lint/style/useTemplate: <explanation>
    throw new Error('Error fetching role: ' + error.message);
  }
};

module.exports = {
    setTotalTimeForDay
};
