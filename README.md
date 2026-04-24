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
| Janhvi Halder | B230352CS | janhvi_b230352cs@nitc.ac.in | 
• Admin dashboard & user management (CRUD, bulk upload, search)  
• Ticket management system (view, resolve, client details)  
• System backup (export database as JSON)  
• Ticket support module (Student & Faculty)  
• Appointment rescheduling workflow (request/accept/cancel)  
• Faculty search & appointment history UI |
| Rohith S | B230527CS | rohith_b230527cs@nitc.ac.in | 
• Core scheduling engine (availability, slot management, conflict resolution)  
• Authentication & authorization system (gAuth, JWT, RBAC)  
• End-to-end booking workflow (student ↔ faculty, recurring & group)  
• System-wide appointment lifecycle management (create, view, cancel)  
• Backend-driven dashboards (Student/Admin integration)  
• Deployment & production setup (DigitalOcean VM) |
| Nidhi Binu | B230075CS | nidhi_b230075cs@nitc.ac.in | 
• Bulk timetable upload system (CSV-based admin import)  
• Visual slot management UI (time-slot mapping & consistency)  
• Manual slot control for admin (add/remove via slot map)  
• Faculty appointment dashboard (upcoming & history views)  
• Faculty slot editing & rescheduling UI  
• Backend logic for slot management & reschedule handling |
| Riya Seby John | B230086CS | riya_b230086cs@nitc.ac.in | 
• Admin timetable management system (faculty scheduling & slot assignment)  
• DNS configuration & domain setup  
• Email notification system (Resend API integration)  
• Automated email workflows (request, approval, rejection triggers)  
• Real-time in-app notification system (user-specific alerts) |
| Muhammad Nubaise C K | B220414CS | muhammed_b220414cs@nitc.ac.in | 
• Support ticket system UI & flow logic  
• Appointment lifecycle logic (cancel, reschedule, approval flows)  
• Meeting link integration (faculty → student flow)  
• Initial rescheduling system design & implementation |