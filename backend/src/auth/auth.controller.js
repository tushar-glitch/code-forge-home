const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const register = async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Create associated profile based on role
    if (role === 'candidate') {
      await prisma.developerProfile.create({
        data: {
          id: user.id, // Link to the User's ID
          username: email, // Use email as username for now
          full_name: `${firstName || ''} ${lastName || ''}`.trim(),
          userId: user.id,
        },
      });
    } else if (role === 'recruiter') {
      // For recruiters, we might create an entry in a 'Profile' table or similar
      // For now, we'll just create a basic profile linked to the user
      await prisma.profile.create({
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
          role: 'recruiter',
          userId: user.id,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed for email
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, password: true, role: true } // Select role
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user.id, role: user.role }); // Include role in response
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
