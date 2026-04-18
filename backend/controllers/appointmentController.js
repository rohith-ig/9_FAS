let resend = null;

if (process.env.RESEND_API_KEY) {
  const { Resend } = require("resend");
  resend = new Resend(process.env.RESEND_API_KEY);
}
const prisma = require('../config/database.js');

const sendEmail = require('../utils/mailer');

const appointmentRequestTemplate = require('../emails/appointmentRequest');
const appointmentApprovedTemplate = require('../emails/appointmentApproved');
const appointmentRejectedTemplate = require('../emails/appointmentRejected');

const postAppointmentRequest = async (req, res) => {
    try {
        if (req.user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Only students can create appointment requests' });
        }
        const { facultyId, start, duration, purpose, note, capacity = 1, isGroup = false, recurrenceRule, recurringEndDate } = req.body;

        if (!facultyId || !start || !duration || !purpose) {
            return res.status(400).json({ error: 'Missing required fields' });
        }   
        
        const appointmentDates = [];
        let currDate = new Date(start);
        const endLimit = recurringEndDate ? new Date(recurringEndDate) : new Date(start);
        if (recurringEndDate) {
            endLimit.setHours(23, 59, 59, 999);
        }

        if (recurrenceRule && endLimit <= currDate) {
            return res.status(400).json({ error: 'Recurring end date must be after the start date' });
        }
        
        do {
           appointmentDates.push(new Date(currDate));
           if (!recurrenceRule) break;
           
           if (recurrenceRule === 'DAILY') currDate.setDate(currDate.getDate() + 1);
           else if (recurrenceRule === 'WEEKLY') currDate.setDate(currDate.getDate() + 7);
           else if (recurrenceRule === 'BIWEEKLY') currDate.setDate(currDate.getDate() + 14);
           else if (recurrenceRule === 'MONTHLY') currDate.setMonth(currDate.getMonth() + 1);
           else break; 
           
        } while (currDate <= endLimit && appointmentDates.length <= 60);

        const validInstances = [];
        const recurrenceId = recurrenceRule ? Math.random().toString(36).substring(2, 15) : null;

        for (const date of appointmentDates) {
            const checkAvail = await prisma.facultyAvailability.findFirst({
                where: {
                    facultyId: facultyId,
                    start: { lte: date },
                    end: { gte: new Date(date.getTime() + duration * 60000) }
                }
            });
            if (!checkAvail) {
               if (date.getTime() === appointmentDates[0].getTime()) {
                   return res.status(400).json({ error: 'The selected time slot is not available for the chosen faculty member' });
               }
            }
            
            const existingCheck = await prisma.appointmentRequest.findFirst({
                where: {
                    facultyId: facultyId,
                    start : { lt : new Date(date.getTime() + duration * 60000) },
                    end : { gt : date },
                    status: 'APPROVED'
                }
            });
            if (existingCheck) {
               if (appointmentDates.length > 1) continue;
               else return res.status(400).json({ error: 'The selected time slot overlaps with an already approved appointment' });
            }

            const findBusy = await prisma.busyblocks.findFirst({
                where : {
                    facultyId : facultyId,
                    start : { lt : new Date(date.getTime() + duration * 60000) },
                    end : { gt : date }
                }
            });
            if (findBusy) {
               if (appointmentDates.length > 1) continue;
               else return res.status(400).json({ error: 'The selected time slot overlaps with a busy block of the faculty member' });
            }   

            validInstances.push({
                studentId: req.user.studentProfile.id,
                facultyId: facultyId,
                start: new Date(date),
                end : new Date(date.getTime() + duration * 60000),
                purpose: purpose,
                note: note,
                capacity: capacity,
                isGroup: isGroup,
                recurrenceId: recurrenceId,
                recurrenceRule: recurrenceRule
            });
        }
        
        if (validInstances.length === 0) {
            return res.status(400).json({ error: 'No available slots found for the requested recurring timeline.' });
        }

        const creates = await prisma.$transaction(
            validInstances.map(data => prisma.appointmentRequest.create({ data }))
        );


        const faculty = await prisma.facultyProfile.findUnique({
            where: { id: facultyId },
            include: { user: true }
        });

        const student = await prisma.studentProfile.findUnique({
            where: { id: req.user.studentProfile.id },
            include: { user: true }
        });

        sendEmail({
            to: faculty.user.email,
            subject: 'New Appointment Request',
            html: appointmentRequestTemplate({
                student: student.user,
                purpose,
                start,
                duration,
                note
            })
        }).catch(console.error);
        await prisma.$transaction(
            creates.map(c => prisma.appointmentUsers.create({
                data: { appointmentId: c.id, userId: req.user.studentProfile.id }
            }))
        );

        res.status(201).json(creates[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'STUDENT') {
            appointments = await prisma.appointmentRequest.findMany({
                where: 
                { 
                    OR : [
                        { studentId: req.user.studentProfile.id },
                        { students : {
                                some : {
                                    userId : req.user.studentProfile.id
                                }
                            } 
                        }
                    ]
                },
                include : {
                    faculty : {
                        include : {
                            user : {
                                select : {
                                    name : true,
                                    email : true,
                                }
                            }
                        }
                    },
                    students : {
                        include : {
                            student : {
                                include : {
                                    user : {
                                        select : {
                                            name : true,
                                            email : true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { start: 'asc' },
            });     
        }
        else if (req.user.role === 'FACULTY') {
            appointments = await prisma.appointmentRequest.findMany({
                where: { facultyId: req.user.facultyProfile.id },
                include: {
                    students : {
                        include : {
                            student : {
                                include : {
                                    user : {
                                        select : {
                                            name : true,
                                            email : true
                                        }
                                    }
                                }
                            }
                        }
                    }
            },
                orderBy: { start: 'asc' },
            });     
        }
        else {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.json(appointments); 
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error' });
    }   
}

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancel, cancelSeries } = req.body;
        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty members can update appointment status' });
        }
        const appointment = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) },
            include: { student: { include: { user: true } }, faculty: { include: { user: true } } }
        });
        if (!appointment || appointment.facultyId !== req.user.facultyProfile.id) {
            return res.status(404).json({ error: 'Appointment request not found' });
        }
        if (appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') {
            return res.status(400).json({ error: 'This appointment has already been rejected' });
        }
        if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        if (appointment.status === 'APPROVED') {
            if (status !== 'CANCELLED') {
                return res.status(400).json({error : 'This appointment is confirmed and can only be cancelled'});
            }
            let successResult;
            if (cancelSeries && appointment.recurrenceId) {
                successResult = await prisma.appointmentRequest.updateMany({
                    where : { recurrenceId: appointment.recurrenceId, status: 'APPROVED', start: { gte: appointment.start } },
                    data: {status : status, cancellationNote: cancel}
                });
            } else {
                successResult = await prisma.appointmentRequest.update({
                    where : {id : Number(id)},
                    data: {status : status, cancellationNote: cancel}
                });
            }
            if (cancel) {
                sendEmail({
                    to: appointment.student.user.email,
                    subject: `Appointment Cancelled`,
                    html: `<h2>Appointment Cancelled ❌</h2><p>Your appointment with <strong>${appointment.faculty.user.name}</strong> was cancelled.</p><p><strong>Reason:</strong> ${cancel}</p>`
                }).catch(console.error);
            }
            return res.json({success: successResult});
        }
        if (appointment.status === 'PENDING') {
            if (status === 'APPROVED' || status === 'REJECTED') {
                if (appointment.recurrenceId) {
                    const updateMany = await prisma.appointmentRequest.updateMany({
                        where: { recurrenceId: appointment.recurrenceId, status: 'PENDING' },
                        data: { status: status, cancellationNote: cancel }
                    });
                    
                    if (status === 'APPROVED') {
                        await prisma.appointmentRequest.updateMany({
                            where: {
                                facultyId: appointment.facultyId,
                                status: "PENDING",
                                start: { lt: appointment.end },
                                end: { gt: appointment.start },
                                id: { not: appointment.id }
                            },
                            data: {
                                status: "REJECTED",
                                cancellationNote: "This appointment was automatically rejected because the time slot was taken."
                            }
                        });
                    }
                    return res.json({ success: true, count: updateMany.count });
                } else {
                    const updateMain = await prisma.appointmentRequest.update({
                        where: { id: Number(id) },
                        data: { status: status, cancellationNote: cancel }
                    });
                    if (status === 'APPROVED') {
                        await prisma.appointmentRequest.updateMany({
                            where: {
                                facultyId: appointment.facultyId,
                                status: "PENDING",
                                start: { lt: appointment.end },
                                end: { gt: appointment.start },
                                id: { not: appointment.id }
                            },
                            data: {
                                status: "REJECTED",
                                cancellationNote: "This appointment was automatically rejected because the time slot was taken."
                            }
                        });
                    }
                    if (status === 'REJECTED' && cancel) {
                        sendEmail({
                            to: appointment.student.user.email,
                            subject: `Appointment Rejected`,
                            html: `<h2>Appointment Rejected ❌</h2><p>Your appointment with <strong>${appointment.faculty.user.name}</strong> was rejected.</p><p><strong>Reason:</strong> ${cancel}</p>`
                        }).catch(console.error);
                    }
                    return res.json(updateMain);
                }
            }
            return res.status(400).json({ error: 'Invalid status transition' });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json("Internal Server Error");
    }
}

const addGroupMember = async (req,res) => {
    try {
        const { appmtId, email } = req.body;
        const user = await prisma.user.findUnique({
            where : {email : email},
            include : {
                studentProfile : true
            }
        });
        if(!user || user.role !== 'STUDENT') {
            return res.status(404).json({error : "User not found"});
        }
        const appmt = await prisma.appointmentRequest.findUnique({
            where : {id : Number(appmtId)},
            include : {
                _count : {
                    select : {
                        students : true
                    }
                }
            }
        });
        if(!appmt || appmt.studentId !== req.user.studentProfile.id) {
            return res.status(404).json({error : "Appointment not found"});
        }
        if (!appmt.isGroup) {
            return res.status(400).json({error : "This appointment is not a group appointment"});
        }
        const currentMembers = appmt._count.students;
        if (currentMembers >= appmt.capacity) {
            return res.status(400).json({error : "Appointment capacity reached"});
        }
        const existingMember = await prisma.appointmentUsers.findFirst({
            where : {
                appointmentId : Number(appmtId),
                userId : user.studentProfile.id
            }
        });
        if(existingMember) {
            return res.status(400).json({error : "User is already a member of this appointment"});
        }
        const addUserGroup = await prisma.appointmentUsers.create({
            data: {
                appointmentId: Number(appmtId),
                userId: user.studentProfile.id
            }
        });
        res.json({success : addUserGroup});
    }   
    catch (e) {
        console.log(e);
        res.status(500).json({"Error": "Internal Server Error"});
    } 
}

const requestReschedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty members can request appointment rescheduling' });
        }
        const appointment = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) },
            include: { student: { include: { user: true } }, faculty: { include: { user: true } } }
        });
        if (!appointment || appointment.facultyId !== req.user.facultyProfile.id) {
            return res.status(404).json({ error: 'Appointment request not found' });
        }
        if (appointment.status === 'CANCELLED' || appointment.status === 'REJECTED') {
            return res.status(400).json({ error: 'Cannot reschedule a cancelled or rejected appointment' });
        }
        
        const update = await prisma.appointmentRequest.update({
            where: { id: Number(id) },
            data: { rescheduleRequested: true, status: 'PENDING', cancellationNote: note }
        });
        
        if (note) {
            sendEmail({
                to: appointment.student.user.email,
                subject: `Reschedule Requested`,
                html: `<h2>Reschedule Requested 📅</h2><p>Faculty <strong>${appointment.faculty.user.name}</strong> has requested to reschedule.</p><p><strong>Note:</strong> ${note}</p>`
            }).catch(console.error);
        }
        
        res.json({ success: true, update });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const studentCancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Only students can cancel' });
        }
        const appmt = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) }
        });
        if (!appmt || appmt.studentId !== req.user.studentProfile.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const update = await prisma.appointmentRequest.update({
            where: { id: Number(id) },
            data: { status: 'CANCELLED', cancellationNote: "Cancelled by student" }
        });
        res.json({ success: true, update });
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Server Error"});
    }
}

const getAppointmentByTime = async (req, res) => {
    try {
        const { start , end } = req.body;
        if(req.user.role === 'STUDENT') {
            return res.status(403).json({error : "Unauthorized"});
        }
        const appointments = await prisma.appointmentRequest.findMany({
            where : {
                facultyId : req.user.facultyProfile.id,
                start : {
                    gte : new Date(start)
                },
                end : {
                    lte : new Date(end)
                },
                status : "APPROVED"
            },
            include : {
                students : {
                    include : {
                        student : {
                            include : {
                                user : {
                                    select : {
                                        name : true,
                                        email : true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { start: 'asc' },
        });
        res.json(appointments);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({"Error": "Internal Server Error"});
    }
}

const bulkCancel = async (req, res) => {
    try {
        const { appointmentIds, cancelNote } = req.body;
        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty members can bulk cancel appointments' });
        }
        const update = await prisma.appointmentRequest.updateMany({
            where: {
                id: { in: appointmentIds.map(id => Number(id)) },
                facultyId: req.user.facultyProfile.id,
                status: 'APPROVED'
            },
            data: {
                status: 'CANCELLED',
                cancellationNote: cancelNote
            }
        });
        res.json({ success: update });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const findNextAvailableSlot = async (facultyId, afterTime, duration = 30) => {
    let currentTime = new Date(afterTime);

    for (let i = 0; i < 100; i++) {

        const newStart = new Date(currentTime);
        const newEnd = new Date(newStart.getTime() + duration * 60000);

        // availability
        const checkAvail = await prisma.facultyAvailability.findFirst({
            where: {
                facultyId,
                start: { lte: newStart },
                end: { gte: newEnd }
            }
        });

        if (checkAvail) {
            // conflict
            const conflict = await prisma.appointmentRequest.findFirst({
                where: {
                    facultyId,
                    start: { lt: newEnd },
                    end: { gt: newStart },
                    status: 'APPROVED'
                }
            });

            // busyblock 
            const busy = await prisma.busyblocks.findFirst({
                where: {
                    facultyId,
                    start: { lt: newEnd },
                    end: { gt: newStart }
                }
            });

            if (!conflict && !busy) {
                return { start: newStart, end: newEnd };
            }
        }

        currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return null;
};

const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty can reschedule' });
        }

        const appointment = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) },
            include: {
                student: {
                    include: { user: true }
                }
            }
        });

        if (!appointment || appointment.facultyId !== req.user.facultyProfile.id) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (appointment.status !== 'APPROVED') {
            return res.status(400).json({ error: 'Only approved appointments can be rescheduled' });
        }

        // ── FIX: compute real duration instead of defaulting to 30 min ──
        const duration =
            (new Date(appointment.end) - new Date(appointment.start)) / 60000;

        const slot = await findNextAvailableSlot(
            appointment.facultyId,
            appointment.end,
            duration
        );
        // ────────────────────────────────────────────────────────────────

        if (!slot) {
            return res.status(400).json({ error: "No available slot found" });
        }

        const updated = await prisma.appointmentRequest.update({
            where: { id: Number(id) },
            data: {
                start: slot.start,
                end: slot.end
            }
        });

        // (optional: add email later)
        // sendEmail...

        res.json(updated);

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getNextSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // FIX: compute real duration instead of defaulting to 30 min 
        const duration =
            (new Date(appointment.end) - new Date(appointment.start)) / 60000;

        const slot = await findNextAvailableSlot(
            appointment.facultyId,
            appointment.end,
            duration
        );
        // 

        if (!slot) {
            return res.status(400).json({ error: "No available slot found" });
        }

        res.json(slot);

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    postAppointmentRequest,
    getAppointments,
    updateAppointmentStatus,
    addGroupMember,
    requestReschedule,
    studentCancelAppointment,
    getAppointmentByTime,
    bulkCancel,
    getNextSlot,
    rescheduleAppointment
};