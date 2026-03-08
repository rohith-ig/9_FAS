export const studentAppointments = [
    {
        id: 1,
        faculty: "Dr. Alan Turing",
        date: "Oct 24, 2026",
        time: "10:30 AM",
        status: "Confirmed",
        type: "Project Review"
    },
    {
        id: 2,
        faculty: "Prof. Grace Hopper",
        date: "Oct 26, 2026",
        time: "2:00 PM",
        status: "Pending",
        type: "Guidance"
    }
];

export const mockFacultyList = [
    {
        id: 1,
        name: "Dr. Alan Turing",
        department: "Computer Science",
        designation: "Professor",
        email: "alan.turing@nitc.ac.in",
        availableSlots: ["Mon 10:00 AM", "Wed 2:00 PM"]
    },
    {
        id: 2,
        name: "Prof. Grace Hopper",
        department: "Computer Science",
        designation: "Associate Professor",
        email: "grace.hopper@nitc.ac.in",
        availableSlots: ["Tue 11:30 AM", "Thu 3:00 PM"]
    },
    {
        id: 3,
        name: "Dr. John von Neumann",
        department: "Mathematics",
        designation: "HOD",
        email: "john.neumann@nitc.ac.in",
        availableSlots: ["Fri 9:00 AM"]
    }
];

export const facultyAppointments = [
    {
        id: 101,
        studentName: "Ada Lovelace",
        studentId: "B230001CS",
        date: "Oct 24, 2026",
        time: "10:30 AM",
        status: "Pending",
        purpose: "Final Year Project Discussion"
    },
    {
        id: 102,
        studentName: "Charles Babbage",
        studentId: "B230002CS",
        date: "Oct 25, 2026",
        time: "11:00 AM",
        status: "Confirmed",
        purpose: "Doubt Clearance - OS"
    }
];

export const mockTickets = [
    {
        id: "TKT-001",
        user: "Ada Lovelace",
        role: "Student",
        issue: "Cannot book an appointment with Dr. Turing",
        status: "Open",
        date: "Oct 20, 2026"
    },
    {
        id: "TKT-002",
        user: "Prof. Grace Hopper",
        role: "Faculty",
        issue: "Calendar sync not working",
        status: "Resolved",
        date: "Oct 18, 2026"
    }
];
