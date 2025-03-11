const Project = require('../../models/Project');
const ProjectTimeLine = require('../../models/ProjectTimeLine');
const { Op } = require('sequelize');

const resetProjectTimes = async () => {
  try {
    // Fetch all projects
    const projects = await Project.findAll();

    for (const project of projects) {
      // Save current values to ProjectTimeline before resetting
      await ProjectTimeLine.create({
        project_id: project.id,
        total_time_day: project.totalTimeForDay,
        total_time_week: project.totalTimeForWeek,
        total_time_month: project.totalTimeForMonth
      });

      // Reset daily, weekly, and monthly timers based on the interval
      project.totalTimeForDay = 0;

      // Reset weekly if today is Monday
      const isMonday = new Date().getDay() === 1; // 1 = Monday
      if (isMonday) {
        project.totalTimeForWeek = 0;
      }

      // Reset monthly if it's the 1st of the month
      const isFirstDayOfMonth = new Date().getDate() === 1;
      if (isFirstDayOfMonth) {
        project.totalTimeForMonth = 0;
      }

      // Save changes
      await project.save();
    }

    console.log('Project time tracking fields reset successfully.');
  } catch (error) {
    console.error('Error resetting project time tracking:', error);
  }
};

module.exports = resetProjectTimes;
