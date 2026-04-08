let resend = null;

if (process.env.RESEND_API_KEY) {
  const { Resend } = require("resend");
  resend = new Resend(process.env.RESEND_API_KEY);
}

const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!resend) {
            console.log("Email skipped (no RESEND_API_KEY)");
            return;
        }

        const response = await resend.emails.send({
            from: 'noreply@fasapp.tech',
            to,
            subject,
            html
        });

        console.log("Email sent:", response);
    } catch (err) {
        console.error("Email error:", err);
        throw err;
    }
};

module.exports = sendEmail;