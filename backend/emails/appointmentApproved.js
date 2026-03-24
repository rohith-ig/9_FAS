const appointmentApprovedTemplate = ({ faculty, start }) => {
    return `
        <h2>Appointment Approved ✅</h2>
        <p>Your appointment has been approved.</p>
        <p><strong>Faculty:</strong> ${faculty.name}</p>
        <p><strong>Time:</strong> ${new Date(start).toLocaleString()}</p>
    `;
};

module.exports = appointmentApprovedTemplate;