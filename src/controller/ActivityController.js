const ActivityService = require("../services/ActivityService");


class ActivityController {
  async getAllActivityLogs(req, res) {
    try {
      const allActivitis = await ActivityService.getAllActivityLogs(req.body);
      res.status(200).json(allActivitis);
      return allActivitis;
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new ActivityController();
