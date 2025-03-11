const ActivityLogs = require('../../models/ActivityLogs');
const Project = require('../../models/Project');
const User = require('../../models/User');
const Client = require('../../models/Client');
const Task = require('../../models/Task');
const { getAuthenticatedUser } = require('../middleware/verifyUser');
const { Op } = require('sequelize');
const {
  createInvoice,
  createReport,
  getAllReport,
  getAllReportsByClientId
} = require('../services/ReportService');
const { getMonth } = require('date-fns');

const generateReport = async (req, res) => {
  const { project, revenue, startDate, endDate } = req.body;
  const proj = await Project.findByPk(project, {
    include: [
      {
        model: User,
        as: 'assignedProjectUser',
        attributes: { exclude: ['password'] }
      },
      {
        model: Client,
        as: 'projectClient',
        attributes: { exclude: ['password'] }
      },
      {
        model: Task,
        as: 'projectTask'
      },
      {
        model: ActivityLogs,
        as: 'projectHasLogs'
      }
    ]
  });
  console.log(proj);
  console.log(startDate, endDate);
  const tasks = await Task.findAll({
    where: {
      project_id: project, // Ensure you filter by project ID
      created_at: {
        [Op.gte]: new Date(startDate), // Greater than or equal to the startDate
        [Op.lte]: new Date(endDate) // Less than or equal to the endDate
      }
    },
    include: [
      {
        model: User,
        as: 'assignedTaskUser', // Alias for the association
        attributes: ['id', 'full_name'] // Attributes to fetch from User model
      }
    ]
  });

  const invoice = {
    items: tasks,
    revenue: revenue,
    project: proj.title,
    startDate: startDate,
    endDate: endDate,
    month: getMonth(startDate),
    bookedHours: proj.monthly_hours,
    package_type: proj.package_type,
    hourUsed: proj.totalTimeForMonth
  };

  const userFullName = proj.projectClient.full_name;
  const currentDate = new Date().toISOString().split('T')[0];

  // Generate dynamic filename
  const sanitizedFullName = userFullName.replace(/\s+/g, '_'); // Replace spaces with underscores
  const fileName = `invoice_${sanitizedFullName}_${currentDate}.pdf`;

  await createInvoice(invoice, fileName)
    .then(() => {
      return res.status(200).json(fileName);
    })
    .catch((err) => {
      console.error('Error generating invoice:', err);
      return res.status(500).json();
    });
};

const sendReport = async (req, res) => {
  const { project_id, pdfUrl, startDate, endDate } = req.body;
  const project = await Project.findByPk(project_id, {
    include: [
      {
        model: User,
        as: 'assignedProjectUser',
        attributes: { exclude: ['password'] }
      },
      {
        model: Client,
        as: 'projectClient',
        attributes: { exclude: ['password'] }
      },
      {
        model: Task,
        as: 'projectTask'
      },
      {
        model: ActivityLogs,
        as: 'projectHasLogs'
      }
    ]
  });

  const report = await createReport(
    project_id,
    project.title,
    project.package_type,
    project.projectClient.full_name,
    project.projectClient.id,
    startDate,
    endDate,
    pdfUrl
  );

  return res.status(200).json(report);
};

const getAllReports = async (req, res) => {
  const reports = await getAllReport();
  return res.status(200).json(reports);
};

const getAllReportsForClient = async (req, res) => {
  const userinfo = getAuthenticatedUser(req);
  console.log(userinfo);
  const reports = await getAllReportsByClientId(userinfo.id);
  console.log(reports);
  return res.status(200).json(reports);
};

module.exports = {
  generateReport,
  sendReport,
  getAllReports,
  getAllReportsForClient
};
