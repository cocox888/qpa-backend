const { roundToNearestHours } = require('date-fns');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const Stripe = require('stripe');
const sendEmail = require('./sendEmail');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class authClientService {
  // Create a new Client
  async createClient(req) {
    const {
      full_name,
      business_name,
      personal_address,
      business_address,
      position,
      email,
      phone,
      preferred_contact_method,
      timezone,

      // Step 2: Services & Goals
      services,
      other_services,
      deadlines,
      hours_needed,

      // Step 3: Tools and Access
      use_tools,
      need_access,
      tools_to_access,
      file_share_method,

      // Step 4: Communication Preferences
      update_frequency,
      update_method,
      stakeholders,

      // Step 5: Priorities
      priority_tasks,
      start_date,

      // Step 6: Billing & Agreements
      billing_method,
      billing_cycle,
      invoice_email,

      // Step 7: Emergency Contact & Agreement
      emergency_contact_name,
      emergency_phone,
      emergency_relationship,
      digital_sign,
      agreementDate,
      agree_to_terms,
      password
    } = req.body;
    const first_name = full_name.split(' ')[0];
    const last_name = full_name.split(' ')[1];
    const default_services = Object.keys(services)
      .filter((key) => services[key])
      .join(', ');

    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      throw new Error('Email already in use');
    }
    const photo = req.file ? req.file.path : '/src/avatars/no-image.jpg';
    // Create and return new client
    try {
      const stripeAccount = await stripe.accounts.create({
        country: 'US',
        email,
        controller: {
          fees: {
            payer: 'application'
          },
          losses: {
            payments: 'application'
          },
          stripe_dashboard: {
            type: 'express'
          }
        }
      });

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccount.id,
        refresh_url: `${process.env.PUBLIC_URL}/reauth`,
        return_url: `${process.env.PUBLIC_URL}/dashboard`,
        type: 'account_onboarding'
      });

      // await sendEmail({
      //   to: email,
      //   subject: 'Complete Your Stripe Onboarding',
      //   text: `Click the link to complete your Stripe setup: ${accountLink.url}`
      // });

      const client = await Client.create({
        first_name,
        last_name,
        full_name,
        business_name,
        personal_address,
        business_address,
        position,
        email,
        phone,
        preferred_contact_method,
        timezone,

        // Step 2: Services & Goals
        default_services,
        other_services,
        deadlines,
        hours_needed,

        // Step 3: Tools and Access
        use_tools,
        need_access,
        tools_to_access,
        file_share_method,

        // Step 4: Communication Preferences
        update_frequency,
        update_method,
        stakeholders,

        // Step 5: Priorities
        priority_tasks,
        start_date,

        // Step 6: Billing & Agreements
        billing_method,
        billing_cycle,
        invoice_email,

        // Step 7: Emergency Contact & Agreement
        emergency_contact_name,
        emergency_phone,
        emergency_relationship,
        digital_sign,
        agreementDate,
        agree_to_terms,
        password,
        stripe_account_id: stripeAccount.id,
        stripe_account_link: accountLink.url,
        status: req.body.status || 0
      });

      client.setDataValue('accountLink', accountLink.url);
      client.setDataValue('stripeAccountId', stripeAccount.id);

      return client;
    } catch (e) {
      throw new Error(e);
    }
  }

  async confClient(data) {
    const { email } = data;
    //console.log(email);
    // Check if email already exists
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      throw new Error('Email Already In Use.');
    }
  }

  async findClientByEmail(data) {
    const { email } = data;
    return await Client.findOne(
      { where: { email } },
      {
        include: [
          {
            model: Project,
            as: 'requestedClientProject'
          },
          {
            model: Task,
            as: 'clientTask'
          }
        ]
      }
    );
  }
  // Get all Clients
  async getAllClients() {
    return await Client.findAll({
      include: [
        {
          model: Project,
          as: 'clientProject',
          attributes: ['id', 'title']
        },
        {
          model: Task,
          as: 'clientTask',
          attributes: ['id', 'title']
        }
      ]
    });
  }

  // Get a Client by ID
  async getClientById(id) {
    const client = await Client.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'requestedClientProject',
          attributes: ['id', 'title']
        },
        {
          model: Task,
          as: 'clientTask',
          attributes: ['id', 'title']
        }
      ]
    });
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  // Update a Client by ID
  async updateClient(id, updates) {
    const client = await Client.findByPk(id);
    console.log(client);
    return await client.update(updates);
  }

  // Delete a Client by ID
  async deleteClient(id) {
    const client = await Client.getClientById(id);
    // client.removeAssignedClientProject();
    // client.removeClientTask();
    if (client.photo) {
      try {
        fs.unlinkSync(path.resolve(client.photo));
      } catch (error) {
        console.error('Error deleting avatar file:', error);
      }
    }
    return await client.destroy();
  }
}

module.exports = new authClientService();
