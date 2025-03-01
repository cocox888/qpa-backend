const {
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  parseISO,
} = require("date-fns");
function isTimestampToday(timestamp) {
  const givenDate = new Date(timestamp);
  const today = new Date();

  return (
    givenDate.getUTCFullYear() === today.getUTCFullYear() &&
    givenDate.getUTCMonth() === today.getUTCMonth() &&
    givenDate.getUTCDate() === today.getUTCDate()
  );
}

function isTimestampWithinCurrentWeek(timestamp) {
  const givenDate = new Date(timestamp);
  const currentDate = new Date();

  // Get the current week's start date (Monday or Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday as start day

  // Get the end of the current week (Saturday or Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday as the end day

  // Check if the given date is within the current week
  const isWithinThisWeek = givenDate >= startOfWeek && givenDate <= endOfWeek;
  return isWithinThisWeek;
}

module.exports = { isTimestampWithinCurrentWeek, isTimestampToday };
