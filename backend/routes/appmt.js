const express = require("express");
const router = express.Router();
const { 
    postAppointmentRequest, 
    getAppointments, 
    updateAppointmentStatus, 
    addGroupMember, 
    getAppointmentByTime, 
    bulkCancel, 
    getNextSlot, 
    rescheduleAppointment,
    requestReschedule,
    studentCancelAppointment 
} = require("../controllers/appointmentController");
const { check } = require("../middlewares/roleCheck");

router.post("/", check, postAppointmentRequest);
router.get("/", check, getAppointments);
router.post("/update/:id",check,updateAppointmentStatus);
router.post("/addMember",check,addGroupMember);
router.post("/requestReschedule/:id", check, requestReschedule);
router.post("/student/cancel/:id", check, studentCancelAppointment);
router.post("/time",check,getAppointmentByTime);
router.post("/bulkCancel",check,bulkCancel);
router.get("/nextSlot/:id",check,getNextSlot);
router.post("/reschedule/:id",check,rescheduleAppointment);

module.exports = router;