const { Op, fn, col, literal } = require('sequelize');
const { getDateRanges } = require('../../utils/Time.cjs');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Client = require('../../models/Client');
const Task = require('../../models/Task');
const User = require('../../models/User');
const ProjectTimeLine = require('../../models/ProjectTimeLine');
const Project = require('../../models/Project');
const ProjectInvoice = require('../../models/ProjectInvoice');
const { getAuthenticatedUser } = require('../middleware/verifyUser');

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
      const project = await Project.findByPk(project_id);

      const client = await Client.findByPk(clientId);
      console.log('ok');
      let projectTimeLine;
      if (project_id && startDate && endDate) {
        projectTimeLine = await ProjectTimeLine.findAll({
          where: {
            project_id: project_id,
            createdAt: {
              [Op.gte]: new Date(startDate),
              [Op.lte]: new Date(endDate)
            }
          }
        });
      }

      let total = 0;

      projectTimeLine?.forEach((entry) => {
        total += entry.totalTimeForDay;
      });

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

      let total_m = amount;
      // if (total_m == null || total_m === 0) total_m = totalAmount;
      const product = await stripe.products.create({
        name: `Invoice for ${project.project_title}`
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: total_m * 100,
        currency: 'usd'
      });

      const invoice = await stripe.invoices.create({
        customer: client.stripe_account_id,
        collection_method: 'send_invoice',
        auto_advance: true,
        days_until_due: 7
      });

      const invoiceItem = await stripe.invoiceItems.create({
        customer: client.stripe_account_id,
        price: price.id,
        invoice: invoice.id
      });

      console.log('invoiceItem', invoiceItem);

      const updatedInvoice = await stripe.invoices.retrieve(invoice.id);

      console.log('updatedInvoice', updatedInvoice);

      await ProjectInvoice.create({
        invoice_id: invoice.id,
        client_id: client.id,
        client_name: client.name,
        project_type: project.package_type,
        project_id: project.id,
        project_title: project.title
      });

      res.json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoices(req, res) {
    try {
      const invoices = await stripe.invoices.list({
        limit: 40
      });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoicesForProjects(req, res) {
    try {
      // Fetch all project invoices from the database
      const projectInvoices = await ProjectInvoice.findAll();

      if (projectInvoices.length === 0) {
        return res.json({
          message: 'No project invoices found.',
          invoices: []
        });
      }

      // Retrieve Stripe invoices using invoice_id from the database
      const invoicesByProject = await Promise.all(
        projectInvoices.map(async (projectInvoice) => {
          try {
            // Fetch the specific Stripe invoice by its ID
            const stripeInvoice = await stripe.invoices.retrieve(
              projectInvoice.invoice_id
            );

            return {
              project_id: projectInvoice.project_id,
              project_type: projectInvoice.project_type,
              project_title: projectInvoice.project_title,
              client_id: projectInvoice.client_id,
              client_name: projectInvoice.client_name,
              stripe_invoice: stripeInvoice
            };
          } catch (error) {
            console.error(
              `Error retrieving invoice ${projectInvoice.invoice_id}:`,
              error.message
            );

            return {
              project_id: projectInvoice.project_id,
              project_type: projectInvoice.project_type,
              project_title: projectInvoice.project_title,
              client_id: projectInvoice.client_id,
              client_name: projectInvoice.client_name,
              stripe_invoice: null
            };
          }
        })
      );

      res.json({ invoices: invoicesByProject });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoicesForClient(req, res) {
    try {
      // Fetch all project invoices from the database
      const userinfo = getAuthenticatedUser(req);
      const projectInvoices = await ProjectInvoice.findAll({
        where: { client_id: userinfo.id },
        order: [['id', 'DESC']]
      });

      if (projectInvoices.length === 0) {
        return res.json({
          message: 'No Client invoices found.',
          invoices: []
        });
      }

      // Retrieve Stripe invoices using invoice_id from the database
      const invoicesByProject = await Promise.all(
        projectInvoices.map(async (projectInvoice) => {
          try {
            // Fetch the specific Stripe invoice by its ID
            const stripeInvoice = await stripe.invoices.retrieve(
              projectInvoice.invoice_id
            );

            const invoices = {
              ...stripeInvoice,
              project_id: projectInvoice.project_id,
              project_type: projectInvoice.project_type,
              project_title: projectInvoice.project_title
            };

            return invoices;
          } catch (error) {
            console.error(
              `Error retrieving invoice ${projectInvoice.invoice_id}:`,
              error.message
            );
            const invoices = {
              ...stripe_invoice,
              project_id: projectInvoice.project_id,
              project_type: projectInvoice.project_type,
              project_title: projectInvoice.project_title
            };

            return invoices;
          }
        })
      );

      res.json({ invoices: invoicesByProject });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoiceById(req) {
    try {
      const invoice = await stripe.invoices.retrieve(req.body.id);

      res.json({ invoice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async payInvoice(req, res) {
    try {
      const { invoiceId } = req.body;
      console.log(req.body);
      console.log(invoiceId);
      if (!invoiceId) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      // Retrieve the invoice
      const invoice = await stripe.invoices.retrieve(invoiceId);

      console.log(invoice);

      // Ensure invoice is unpaid
      if (invoice.status === 'paid') {
        return res.status(400).json({ error: 'Invoice is already paid' });
      }

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: invoice.customer,
        line_items: [
          {
            price_data: {
              currency: invoice.currency,
              product_data: {
                name: `Invoice #${invoice.number || invoice.id}`
              },
              unit_amount: invoice.amount_due
            },
            quantity: 1
          }
        ],
        success_url: `${process.env.PUBLIC_URL}/client/finance`,
        cancel_url: `${process.env.PUBLIC_URL}/client/finance`
      });

      await stripe.invoices.pay(invoice.id);
      await stripe.invoices.finalize(invoice.id);

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Failed to create payment session' });
    }
  }

  async payInvoiceWithAttatched(req, res) {
    try {
      const { invoiceId } = req.body;
      console.log(req.body);
      console.log(invoiceId);
      if (!invoiceId) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      // Retrieve the invoice
      const invoice = await stripe.invoices.retrieve(invoiceId);

      console.log(invoice);

      // Ensure invoice is unpaid
      if (invoice.status === 'paid') {
        return res.status(400).json({ error: 'Invoice is already paid' });
      }

      // Create a Stripe Checkout session
      const customer = await stripe.customers.retrieve(invoice.customer);
      if (!customer.invoice_settings.default_payment_method) {
        return res
          .status(400)
          .json({ error: 'No default payment method found for customer' });
      }

      const paidInvoice = await stripe.invoices.pay(invoice.id, {
        payment_method: customer.invoice_settings.default_payment_method
      });

      if (paidInvoice.status === 'paid') {
        await stripe.invoices.finalize(invoice.id);
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Failed to create payment session' });
    }
  }

  async attatchpayment(req, res) {
    try {
      const user = getAuthenticatedUser(req);
      console.log(user.id);
      const client = await Client.findByPk(user.id);
      const customerId = client.stripe_account_id;
      const { paymentMethodId } = req.body;
      console.log(paymentMethodId);
      // Attach the Payment Method to the Customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Set Payment Method as Default for Future Payments
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId }
      });

      res.json({
        success: true,
        message: 'Payment method attached successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async paymentAttatched(req, res) {
    const userinfo = getAuthenticatedUser(req);
    const client = await Client.findByPk(userinfo.id);
    const paymentMethods = await stripe.paymentMethods.list({
      customer: client.stripe_account_id,
      type: 'card'
    });
    console.log(paymentMethods);
    if (paymentMethods.data.length > 0) {
      res.json({
        success: true,
        hasPaymentMethod: true,
        paymentMethods: paymentMethods.data
      });
    } else {
      res.json({ success: true, hasPaymentMethod: false });
    }
  }

  async createSetupIntent(req, res) {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card']
    });

    res.json({ client_secret: setupIntent.client_secret });
  }
}

module.exports = new StripeController();
