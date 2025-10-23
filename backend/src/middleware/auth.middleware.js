const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const accessLink = req.headers['x-access-link'] || req.query.access_link;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Token is invalid or expired
      }
      req.userId = user.userId;
      req.isRecruiterAccess = true; // Indicate this is a recruiter access
      next();
    });
  } else if (accessLink) {
    // Authenticate via accessLink for candidates
    prisma.testAssignment.findFirst({
      where: { access_link: accessLink },
      select: { id: true, candidate_id: true, test_id: true, access_link: true },
    })
    .then(assignment => {
      if (!assignment) {
        return res.status(403).json({ message: 'Invalid access link' });
      }
      req.assignmentId = assignment.id;
      req.candidateId = assignment.candidate_id;
      req.accessLink = assignment.access_link;
      req.isCandidateAccess = true; // Indicate this is a candidate access
      next();
    })
    .catch(error => {
      console.error('Error authenticating access link:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
  } else {
    return res.sendStatus(401); // No token or access link provided
  }
};

module.exports = { authenticateToken };