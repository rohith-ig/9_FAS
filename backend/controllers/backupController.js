const prisma = require("../config/database"); // Make sure this path matches your setup!

exports.generateBackup = async (req, res) => { 
    
  try { 
    // 1. Only admin allowed 
    if (req.user.role !== "ADMIN") { 
      return res.status(403).json({ error: "Access denied" }); 
    }

    // 2. Fetch absolutely everything from the database using Prisma
    const backupData = {
      timestamp: new Date(),
      users: await prisma.user.findMany({ include: { studentProfile: true, facultyProfile: true } }),
      tickets: await prisma.ticket.findMany(),
      appointments: await prisma.appointmentRequest.findMany({ include: { student: true, faculty: true } }),
      timetables: await prisma.timetable.findMany(),
      notifications: await prisma.notification.findMany()
    };

    // 3. Convert the entire database state into a nicely formatted JSON string
    const jsonString = JSON.stringify(backupData, null, 2);

    // 4. Send the JSON string to the frontend as a downloadable file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=database_backup.json");
    return res.status(200).send(jsonString);

  } catch (err) { 
    console.error("Backup error:", err); 
    // This is the error message you saw in your console!
    res.status(500).json({ error: "Failed to generate backup file" }); 
  } 
};