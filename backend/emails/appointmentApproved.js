const appointmentApprovedTemplate = ({ student, appointment, meetingLink }) => {
    return `
        <h2>Appointment Confirmed ✅</h2>
        <p>Hi ${student.name}, your appointment has been confirmed.</p>
        <p><strong>Date & Time:</strong> ${new Date(appointment.start).toLocaleString()}</p>
        <p><strong>Purpose:</strong> ${appointment.purpose}</p>
        ${meetingLink ? `
        <p><strong>Meeting Type:</strong> Online</p>
        <p><strong>Join Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
        ` : `<p><strong>Meeting Type:</strong> In-Person</p>`}
    `;
};

module.exports = appointmentApprovedTemplate;