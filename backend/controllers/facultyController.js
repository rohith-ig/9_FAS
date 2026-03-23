const prisma = require("../prismaClient");

const slotMap = {
  F:[["Mon","08:00-08:50"],["Tue","05:00-05:50"],["Thu","08:00-08:50"]],
  H:[["Tue","08:00-08:50"],["Wed","05:00-05:50"],["Fri","08:00-08:50"]],
  G:[["Wed","08:00-08:50"],["Mon","05:00-05:50"],["Thu","05:00-05:50"]],

  A1:[["Mon","09:00-09:50"],["Thu","11:00-11:50"],["Fri","10:00-10:50"],["Wed","12:00-12:50"]],
  B1:[["Mon","10:00-10:50"],["Tue","09:00-09:50"],["Fri","11:00-11:50"],["Thu","12:00-12:50"]],
  C1:[["Mon","11:00-11:50"],["Tue","10:00-10:50"],["Fri","12:00-12:50"]],
  D1:[["Tue","11:00-11:50"],["Wed","10:00-10:50"],["Thu","09:00-09:50"],["Mon","12:00-12:50"]],
  E1:[["Wed","11:00-11:50"],["Thu","10:00-10:50"],["Fri","09:00-09:50"],["Tue","12:00-12:50"]],

  A2:[["Mon","02:00-02:50"],["Thu","04:00-04:50"],["Fri","03:00-03:50"],["Wed","01:00-01:50"]],
  B2:[["Mon","03:00-03:50"],["Tue","02:00-02:50"],["Fri","04:00-04:50"],["Thu","01:00-01:50"]],
  C2:[["Mon","04:00-04:50"],["Tue","03:00-03:50"],["Wed","02:00-02:50"],["Fri","01:00-01:50"]],
  D2:[["Tue","04:00-04:50"],["Wed","03:00-03:50"],["Thu","02:00-02:50"],["Mon","01:00-01:50"]],
  E2:[["Wed","04:00-04:50"],["Thu","03:00-03:50"],["Fri","02:00-02:50"],["Tue","01:00-01:50"]],

  P1:[["Mon","02:00-02:50"],["Mon","03:00-03:50"],["Mon","04:00-04:50"]],
  Q1:[["Tue","02:00-02:50"],["Tue","03:00-03:50"],["Tue","04:00-04:50"]],
  R1:[["Wed","02:00-02:50"],["Wed","03:00-03:50"],["Wed","04:00-04:50"]],
  S1:[["Thu","02:00-02:50"],["Thu","03:00-03:50"],["Thu","04:00-04:50"]],
  T1:[["Fri","02:00-02:50"],["Fri","03:00-03:50"],["Fri","04:00-04:50"]],

  P2:[["Mon","09:00-09:50"],["Mon","10:00-10:50"],["Mon","11:00-11:50"]],
  Q2:[["Tue","09:00-09:50"],["Tue","10:00-10:50"],["Tue","11:00-11:50"]],
  R2:[["Wed","09:00-09:50"],["Wed","10:00-10:50"],["Wed","11:00-11:50"]],
  S2:[["Thu","09:00-09:50"],["Thu","10:00-10:50"],["Thu","11:00-11:50"]],
  T2:[["Fri","09:00-09:50"],["Fri","10:00-10:50"],["Fri","11:00-11:50"]],
};


exports.facultyAddSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    const facultyName = req.user.name; // ✅ from token

    let insertedCount = 0;

    for (let slot of slots) {
      if (!slotMap[slot]) continue;

      for (let [day, time] of slotMap[slot]) {
        await prisma.timetable.create({
          data: {
            facultyName,
            day,
            time
          }
        });

        insertedCount++;
      }
    }

    res.json({
      message: "Slots added",
      inserted: insertedCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding slots" });
  }
};

exports.facultyDeleteSlots = async (req, res) => {
  try {
    const { slots } = req.body;

    const facultyName = req.user.name; // ✅ from middleware

    if (!slots || slots.length === 0) {
      return res.status(400).json({ message: "Slots required" });
    }

    let deletedCount = 0;

    for (let slot of slots) {
      if (!slotMap[slot]) continue;

      for (let [day, time] of slotMap[slot]) {
        const result = await prisma.timetable.deleteMany({
          where: {
            facultyName,
            day,
            time
          }
        });

        deletedCount += result.count;
      }
    }

    res.json({
      message: "Slots removed successfully",
      deleted: deletedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting slots"
    });
  }
};