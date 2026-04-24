# Faculty Appointment Scheduler (FAS)

## Problem Statement
Scheduling academic appointments between students and faculty members within an educational institution is often a manual, fragmented, and inefficient process. Without a centralized system, coordinating meeting times, avoiding schedule conflicts, and tracking requests leads to significant administrative overhead and communication breakdowns. The Faculty Appointment Scheduler (FAS) aims to solve these issues by providing a streamlined, digital platform for requests, dynamic schedule auto-approvals, calendar management, and notifications.

## Technology Stack
- **Frontend Framework**: Next.js 16 (React, App Router)
- **Styling**: Tailwind CSS, Vanilla CSS (Globals)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono 

## Contribution Team (Group No: 9)

| Name | Role / ID | Email | Key Contributions |
| :--- | :--- | :--- | :--- |
| Janhvi Halder | B230352CS | janhvi_b230352cs@nitc.ac.in | <ul><li>Admin dashboard & user management (CRUD, bulk upload, search)</li><li>Ticket management system (view, resolve, client details)</li><li>System backup (JSON export)</li><li>Ticket support module (Student & Faculty)</li><li>Appointment rescheduling workflow (request/accept/cancel)</li><li>Faculty search & appointment history UI</li></ul> |
| Rohith S | B230527CS | rohith_b230527cs@nitc.ac.in | <ul><li><strong>Core scheduling engine</strong> (availability, slot management, conflict resolution)</li><li>Authentication & authorization (gAuth, JWT, RBAC)</li><li>End-to-end booking workflow (recurring & group)</li><li>Appointment lifecycle management (create, view, cancel)</li><li>Backend-driven dashboards (Student/Admin)</li><li>Deployment & production setup (DigitalOcean VM)</li></ul> |
| Nidhi Binu | B230075CS | nidhi_b230075cs@nitc.ac.in | <ul><li>Bulk timetable upload system (CSV-based admin import)</li><li>Visual slot management UI (time-slot mapping & consistency)</li><li>Manual slot control for admin (add/remove via slot map)</li><li>Faculty appointment dashboard (upcoming & history views)</li><li>Faculty slot editing & rescheduling UI</li><li>Backend logic for slot management & reschedule handling</li></ul> |
| Riya Seby John | B230086CS | riya_b230086cs@nitc.ac.in | <ul><li>Admin timetable management system (faculty scheduling & slot assignment)</li><li>DNS configuration & domain setup</li><li>Email notification system (Resend API integration)</li><li>Automated email workflows (request, approval, rejection triggers)</li><li>Real-time in-app notification system (user-specific alerts)</li></ul> |
| Muhammad Nubaise C K | B220414CS | muhammed_b220414cs@nitc.ac.in | <ul><li>Support ticket system UI & flow logic</li><li>Appointment lifecycle logic (cancel, reschedule, approval flows)</li><li>Meeting link integration (faculty → student flow)</li><li>Initial rescheduling system design & implementation</li></ul> |