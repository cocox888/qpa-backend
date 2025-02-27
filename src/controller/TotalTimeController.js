const jwt = require("jsonwebtoken");
const EverydayTime = require("../../models/EverydayTime");

class TotalTimeController {
  async setTotalTimeForDay(req, res) {
    try {
      const totalTime = await EverydayTime.setTotalTimeForDay(req.body);
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new TotalTimeController();
