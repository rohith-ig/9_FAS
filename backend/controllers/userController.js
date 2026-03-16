const prisma = require("../config/database");

// ADD USER
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, roll, program, dept, designation1} = req.body;

    let userData = {
      name,
      email,
      role,
      profilePic:''
    };

    // If the user is a STUD
    if (role === "STUDENT") {
      userData.studentProfile = {
        create: {
          rollNumber:roll,
          designation:program,
          department:dept,
        },
      };
    }

    // If the user is a FACULTY
    if (role === "FACULTY") {
      userData.facultyProfile = {
        create: {
          department: dept,
          designation: designation1,
          // location,
          // subjects,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    res.json({ success: true, user: newUser });

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
    if (req.user.role !== 'ADMIN') {
      console.log("Forbidden error at getusers");
      return res.status(401).json({"Error":"Unauthorised"});
    }
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

