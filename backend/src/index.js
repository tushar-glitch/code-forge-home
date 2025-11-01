const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const templateRoutes = require('./routes/template.routes');
const testRoutes = require('./routes/test.routes');
const testAssignmentRoutes = require('./routes/testassignment.routes');
const submissionRoutes = require('./routes/submission.routes');
const testResultRoutes = require('./routes/testresult.routes');
const candidateRoutes = require('./routes/candidate.routes');
const companyRoutes = require('./routes/company.routes');
const contestRoutes = require('./routes/contest.routes');
const contestParticipantRoutes = require('./routes/contestparticipant.routes');
const developerBadgeRoutes = require('./routes/developerbadge.routes');
const developerProfileRoutes = require('./routes/developerprofile.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const leadRoutes = require('./routes/lead.routes');
const profileRoutes = require('./routes/profile.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const testConfigurationRoutes = require('./routes/testconfiguration.routes');
const userActivityRoutes = require('./routes/useractivity.routes');
const userBadgeRoutes = require('./routes/userbadge.routes');
const userSkillRoutes = require('./routes/userskill.routes');
const userRoutes = require('./routes/user.routes');
const githubRoutes = require('./routes/github.routes');
const invitationRoutes = require('./routes/invitation.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const evaluationRoutes = require('./routes/evaluation.routes');
const execRoutes = require('./routes/exec.routes'); // Add this line
const { WebSocketServer } = require('ws');
const url = require('url');
const { saveProctoringEvent } = require('./controllers/proctoring.controller');
const { suspicionEngine } = require('./services/suspicion.service');
const morgan = require('morgan');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3001;


// Integrate morgan with winston
const stream = {
  write: (message) => logger.info(message.trim())
};

app.use(morgan('combined', { stream }));


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-assignments', testAssignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/contest-participants', contestParticipantRoutes);
app.use('/api/developer-badges', developerBadgeRoutes);
app.use('/api/developer-profiles', developerProfileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/test-configurations', testConfigurationRoutes);
app.use('/api/user-activities', userActivityRoutes);
app.use('/api/user-badges', userBadgeRoutes);
app.use('/api/user-skills', userSkillRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/exec', execRoutes); // Add this line

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const server = app.listen(port,'0.0.0.0', () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const { query } = url.parse(req.url, true);
  const accessLink = query.accessLink;

  if (!accessLink) {
    console.log('Connection rejected: No access link provided.');
    ws.terminate();
    return;
  }

  console.log(`Client connected with access link: ${accessLink}`);
  ws.accessLink = accessLink;

  const questionInterval = setInterval(() => {
    ws.send(JSON.stringify({ type: 'request.code.snapshot' }));
  }, 120000); // 2 minutes

  ws.on('message', async (message) => {
    try {
      const event = JSON.parse(message);
      event.accessLink = ws.accessLink;
      if (event.type === 'answer') {
        await saveProctoringEvent(event);
      } else if (event.type === 'code.snapshot') {
        suspicionEngine(event.payload.files, ws);
      } else {
        // For other events like file.change, we can still save them
        await saveProctoringEvent(event);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(questionInterval);
  });
});