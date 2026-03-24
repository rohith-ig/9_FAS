const appointmentRequestTemplate = ({ student, purpose, start, duration, note }) => {
    return `
        <h2>New Appointment Request</h2>
        <p><strong>Student:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Start Time:</strong> ${new Date(start).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p><strong>Note:</strong> ${note || 'N/A'}</p>
        <p>Please login to your dashboard to approve/reject.</p>
    `;
};

module.exports = appointmentRequestTemplate;