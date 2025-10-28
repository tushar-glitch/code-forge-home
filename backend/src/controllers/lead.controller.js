const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateRandomPassword = () => {
  const charset = "ABCDEFGHIJKL!@#$_MNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_";
  let password = "", lengthOfPassword=Math.floor((Math.random()*3)+12)
  for(let i = 0; i < lengthOfPassword; i++){
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Create a new lead
const createLead = async (req, res) => {
  const { company_id, email, hiring_count, notes, role, status } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const password = generateRandomPassword();
    console.log("password", password)
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "recruiter",
        },
      });

      const lead = await prisma.lead.create({
        data: {
          company_id,
          email,
          hiring_count,
          notes,
          role,
          status,
          userId: user.id,
        },
      });

      return { user, lead };
    });
    // Send welcome email
    const temp = await resend.emails.send({
      from: 'Hire10xDevs <noreply@hire10xdevs.site>',
      to: email,
      subject: 'Welcome to hire10xdevs - Your Account Details',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366F1;">Welcome to hire10xdevs!</h1>
          <p>Your account has been created successfully. You can now sign in using the following credentials:</p>
          <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> hardcoded_password</p>
          </div>
          <p>Please sign in using the link below:</p>
          <a href="http://localhost:3000/signin" style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign In Now</a>
          <p style="margin-top: 20px;">For security reasons, we recommend changing your password after your first login.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Thanks for choosing Hire10xDevs for your technical assessments!</p>
        </div>
      `
    });
    console.log(temp)
    res.status(201).json(result.lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all leads
const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany();
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single lead by ID
const getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
    });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a lead
const updateLead = async (req, res) => {
  const { id } = req.params;
  const { company_id, email, hiring_count, notes, role, status } = req.body;
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        company_id,
        email,
        hiring_count,
        notes,
        role,
        status,
      },
    });
    res.status(200).json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a lead
const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lead.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};