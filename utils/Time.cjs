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

function isWithinCurrentMonth(date) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  return date >= startOfMonth && date <= endOfMonth;
}

const getDateRanges = () => {
  const now = new Date();

  // Today
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const endOfToday = new Date(now.setHours(23, 59, 59, 999));

  // Start of the Week (Sunday - Saturday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Start of the Month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth };
};


module.exports = {
  isTimestampWithinCurrentWeek,
  isTimestampToday,
  isWithinCurrentMonth,
  getDateRanges,
};

