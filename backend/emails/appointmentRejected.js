const appointmentRejectedTemplate = ({ faculty, start, reason }) => {
    return `
        <h2>Appointment Rejected ❌</h2>
        <p>Your appointment was rejected.</p>
        <p><strong>Faculty:</strong> ${faculty.name}</p>
        <p><strong>Time:</strong> ${new Date(start).toLocaleString()}</p>
        <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
    `;
};

module.exports = appointmentRejectedTemplate;