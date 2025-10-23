const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTestInvitation = async (req, res) => {
  const { email, testTitle, accessLink, firstName } = req.body;

  try {
    await resend.emails.send({
      from: 'Hire10xDevs <noreply@hire10xdevs.site>',
      to: email,
      subject: `Test Invitation: ${testTitle}`,
      html: `<p>Hi ${firstName || 'there'},</p>
             <p>You have been invited to take a test: <strong>${testTitle}</strong>.</p>
             <p>Access it here: <a href="${accessLink}">${accessLink}</a></p>
             <p>Good luck!</p>`,
    });

    res.status(200).json({ message: 'Test invitation sent successfully' });
  } catch (error) {
    console.error('Error sending test invitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendTestInvitation,
};