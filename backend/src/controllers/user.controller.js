const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserRole = async (req, res) => {
  const { id } = req.params; // This 'id' is the userId from the JWT

  if (!req.userId || req.userId !== id) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own role' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { role: true }, // Select only the role field
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserRole,
};