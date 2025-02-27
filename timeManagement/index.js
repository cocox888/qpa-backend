const cron = require("node-cron");

// Schedule a task to run at midnight every day in the 'America/Chicago' time zone
cron.schedule(
  "0 0 * * *",
  () => {
    resetTotalTime();
  },
  {
    scheduled: true,
    timezone: "America/Chicago",
  }
);

function resetTotalTime() {
  // Implement the logic to reset the total time here
  
  // For example, update your database or in-memory store
}
