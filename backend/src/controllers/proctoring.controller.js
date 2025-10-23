const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveProctoringEvent = async (event) => {
  try {
    if (event.type === 'answer') {
      await prisma.proctoringEvent.update({
        where: { id: event.id },
        data: {
          answer: event.payload.answer,
        },
      });
    } else {
      const assignment = await prisma.testAssignment.findUnique({
        where: { access_link: event.accessLink },
      });

      if (assignment) {
        await prisma.proctoringEvent.create({
          data: {
            assignmentId: assignment.id,
            type: event.type,
            payload: event.payload,
          },
        });
      } else {
        console.error(`Assignment not found for access link: ${event.accessLink}`);
      }
    }
  } catch (error) {
    console.error('Error saving proctoring event:', error);
  }
};

module.exports = {
  saveProctoringEvent,
};