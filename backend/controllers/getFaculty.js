const prisma = require("../prismaClient");

getFaculty = async (req, res) => {
  try {
    const faculty = await prisma.facultyProfile.findMany({
      include: {
        user : true
      }
    });
    res.status(200).json(faculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching faculty" });
  }
};

module.exports = getFaculty;