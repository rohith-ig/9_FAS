const prisma = require("../config/database");

// ADD USER
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, roll, program, dept, location, subjects } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    });

    if (role == "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          roll,
          program,
        },
      });
    }

    if (role === "Faculty") {
      await prisma.facultyProfile.create({
        data: {
          userId: user.id,
          department: dept,
          location,
          subjects,
        },
      });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding user" });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
};



// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {

    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    res.status(200).json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

