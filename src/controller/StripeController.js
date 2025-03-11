const { Op, fn, col, literal } = require('sequelize');
const { getDateRanges } = require('../../utils/Time.cjs');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Client = require('../../models/Client');
const Task = require('../../models/Task');
const User = require('../../models/User');
const ProjectTimeLine = require('../../models/ProjectTimeLine');
const Project = require('../../models/Project');

class StripeController {
  // async sendInvoice(data) {
  //   try {
  //     const { amount, currency, payment_method, stripeAccountId } = req.body;

  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount,
  //       currency,
  //       payment_method_types: ['card'],
  //       payment_method,
  //       confirm: true,
  //       transfer_data: {
  //         destination: stripeAccountId
  //       }
  //     });

  //     res.status(200).json({
  //       message: 'Payment successful',
  //       paymentIntentId: paymentIntent.id
  //     });
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //     res.status(500).json({ error: 'Payment failed' });
  //   }
  // }

  async sendInvoice(req, res) {
    try {
      const {
        clientId,
        project_id,
        amount,
        description,
        startDate,
        endDate,
        currencyType
      } = req.body;

      console.log(req.body);
      let project;
      if (project_id) project = await Project.findByPk(project_id);

      const client = await Client.findByPk(clientId);
      console.log('ok');
      let projectTimeLine;
      // if (project_id && startDate && endDate) {
      //   projectTimeLine = await ProjectTimeLine.findAll({
      //     where: {
      //       project_id: project_id,
      //       created_at: {
      //         [Op.gte]: new Date(startDate),
      //         [Op.lte]: new Date(endDate)
      //       }
      //     }
      //   });
      // }

      // let total = 0;
      // biome-ignore lint/complexity/noForEach: <explanation>
      // projectTimeLine.forEach((entry) => {
      //   total += entry.totalTimeForDay;
      // });

      let totalAmount;

      if (project.package_type === 'obm' || project.package_type === 'va') {
        totalAmount = total * project.rate;
      }
      if (project.package_type === 'smm' || project.package_type === 'wds') {
        totalAmount = project.budget;
      }

      if (!client || !client.stripe_account_id) {
        return res
          .status(400)
          .json({ error: 'Client not found or not connected to Stripe' });
      }

      const invoiceItem = await stripe.invoiceItems.create({
        customer: client.stripe_account_id,
        amount: amount || totalAmount,
        currency: currencyType,
        description
      });

      const invoice = await stripe.invoices.create({
        customer: client.stripe_account_id,
        collection_method: 'send_invoice',
        days_until_due: 7
      });

      await stripe.invoices.finalizeInvoice(invoice.id);

      res.json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoices(req, res) {
    try {
      const invoices = await stripe.invoices.list({ limit: 40 });
      res.json({ invoices });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoiceById(req) {
    try {
      const invoice = await stripe.invoices.retrieve(req.params.id);
      res.json({ invoice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StripeController();
