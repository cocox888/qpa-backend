const ActivityLogs = require('../../models/ActivityLogs');

const { Op, fn, col, literal } = require('sequelize');
const { getDateRanges } = require('../../utils/Time.cjs');
class ActivityService {
  async getAllActivityLogs(data) {
    try {
      const {
        startOfToday,
        endOfToday,
        startOfWeek,
        endOfWeek,
        startOfMonth,
        endOfMonth
      } = getDateRanges();

      let dateFilter = {};
      const { filter } = data;

      switch (filter) {
        case 'today':
          dateFilter = { [Op.between]: [startOfToday, endOfToday] };
          break;
        case 'week':
          dateFilter = { [Op.between]: [startOfWeek, endOfWeek] };
          break;
        case 'month':
          dateFilter = { [Op.between]: [startOfMonth, endOfMonth] };
          break;
        default:
          throw new Error('Invalid filter type');
      }
      console.log(dateFilter);

      const logs = await ActivityLogs.findAll({
        attributes: [
          [fn('DATE', col('created_at')), 'log_date'], // Extract date from timestamp
          [fn('COUNT', '*'), 'log_count'] // Count logs per day
        ],
        where: {
          created_at: dateFilter
        },
        group: [fn('DATE', col('created_at'))], // Group by date
        order: [[literal('log_date'), 'ASC']] // Order by date ascending
      });

      console.log(logs);
      const new_logs = logs.map((log) => ({
        date: log.getDataValue('log_date'),
        count: log.getDataValue('log_count')
      }));

      console.log(new_logs);
      return new_logs;
    } catch (e) {
      throw new Error(e);
    }
  }
  async getAllActivityLogsForUser(data) {
    try {
      const {
        startOfToday,
        endOfToday,
        startOfWeek,
        endOfWeek,
        startOfMonth,
        endOfMonth
      } = getDateRanges();

      let dateFilter = {};
      const { filter } = data;

      switch (filter) {
        case 'today':
          dateFilter = { [Op.between]: [startOfToday, endOfToday] };
          break;
        case 'week':
          dateFilter = { [Op.between]: [startOfWeek, endOfWeek] };
          break;
        case 'month':
          dateFilter = { [Op.between]: [startOfMonth, endOfMonth] };
          break;
        default:
          throw new Error('Invalid filter type');
      }
      console.log(dateFilter);

      const logs = await ActivityLogs.findAll({
        attributes: [
          [fn('DATE', col('created_at')), 'log_date'], // Extract date from timestamp
          [fn('COUNT', '*'), 'log_count'] // Count logs per day
        ],
        where: {
          created_at: dateFilter
        },
        group: [fn('DATE', col('created_at'))], // Group by date
        order: [[literal('log_date'), 'ASC']] // Order by date ascending
      });

      console.log(logs);
      const new_logs = logs.map((log) => ({
        date: log.getDataValue('log_date'),
        count: log.getDataValue('log_count')
      }));

      console.log(new_logs);
      return new_logs;
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new ActivityService();
