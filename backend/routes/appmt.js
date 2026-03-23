const express = require("express");
const router = express.Router();
const { postAppointmentRequest, getAppointments, updateAppointmentStatus, addGroupMember, getAppointmentByTime, bulkCancel } = require("../controllers/appointmentController");
const { check } = require("../middlewares/roleCheck");

router.post("/", check, postAppointmentRequest);
router.get("/", check, getAppointments);
router.post("/update/:id",check,updateAppointmentStatus);
router.post("/addMember",check,addGroupMember);
router.post("/time",check,getAppointmentByTime);
router.post("/bulkCancel",check,bulkCancel);

module.exports = router;