const { Op, fn, col, literal } = require('sequelize');
const { getDateRanges } = require('../../utils/Time.cjs');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Client = require('../../models/Client');

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

  async sendInvoice(req) {
    try {
      const { clientId, amount, description } = req.body;

      // Fetch the client's Stripe account ID from the database
      const client = await Client.findByPk(clientId);
      if (!client || !client.stripe_account_id) {
        return res
          .status(400)
          .json({ error: 'Client not found or not connected to Stripe' });
      }

      // Create an invoice item for the client
      const invoiceItem = await stripe.invoiceItems.create({
        customer: client.stripe_account_id,
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        description
      });

      // Create the invoice
      const invoice = await stripe.invoices.create({
        customer: client.stripe_account_id,
        collection_method: 'send_invoice',
        days_until_due: 7 // Payment due in 7 days
      });

      // Finalize and send the invoice
      await stripe.invoices.finalizeInvoice(invoice.id);

      res.json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInvoices() {
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
