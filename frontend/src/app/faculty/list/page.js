"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../../axios";
import { Loader2, CalendarClock, Clock, Check, X } from "lucide-react";

export default function FacultyAppointmentList() {
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/appmt');
      // sort by start date ascending, or creation date
      setAppointments(response.data.sort((a, b) => new Date(a.start) - new Date(b.start)));
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.post(`/appmt/update/${id}`, { status });
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleReschedule = (appointment) => {
    alert(`Reschedule request feature coming soon. (Student: ${appointment.student.user.name})`);
  };

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const scheduledAppointments = appointments.filter(a => a.status === 'APPROVED');
  const historyAppointments = appointments.filter(a => ['REJECTED', 'CANCELLED'].includes(a.status) || new Date(a.end) < new Date());

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Appointments...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4">
      
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Appointment Requests</h1>
          <p className="text-sm text-[#5A6C7D] mt-1">
            Review pending requests and manage your scheduled appointments
          </p>
        </div>
      </header>

      <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-[#DCE3ED] bg-[#FBFCFE]">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 px-4 py-3.5 text-sm font-semibold transition bg-transparent \${
              activeTab === "pending"
                ? "text-[#1F3A5F] border-b-2 border-[#1F3A5F] bg-white"
                : "text-[#5A6C7D] hover:text-[#1F3A5F] hover:bg-gray-50/50"
            }`}
          >
            Pending Requests <span className="ml-1.5 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs">{pendingAppointments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("scheduled")}
            className={`flex-1 px-4 py-3.5 text-sm font-semibold transition bg-transparent \${
              activeTab === "scheduled"
                ? "text-[#1F3A5F] border-b-2 border-[#1F3A5F] bg-white"
                : "text-[#5A6C7D] hover:text-[#1F3A5F] hover:bg-gray-50/50"
            }`}
          >
            Scheduled Appointments <span className="ml-1.5 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">{scheduledAppointments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3.5 text-sm font-semibold transition bg-transparent \${
              activeTab === "history"
                ? "text-[#1F3A5F] border-b-2 border-[#1F3A5F] bg-white"
                : "text-[#5A6C7D] hover:text-[#1F3A5F] hover:bg-gray-50/50"
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="p-0">
          {activeTab === "pending" && (
            pendingAppointments.length ? (
              <ul className="divide-y divide-[#DCE3ED]">
                {pendingAppointments.map((appt) => (
                  <AppointmentRow key={appt.id} data={appt} type="pending" onUpdate={handleStatusUpdate} />
                ))}
              </ul>
            ) : (
              <EmptyState text="No pending appointment requests at the moment." />
            )
          )}

          {activeTab === "scheduled" && (
            scheduledAppointments.length ? (
              <ul className="divide-y divide-[#DCE3ED]">
                {scheduledAppointments.map((appt) => (
                  <AppointmentRow key={appt.id} data={appt} type="scheduled" onReschedule={() => handleReschedule(appt)} />
                ))}
              </ul>
            ) : (
              <EmptyState text="No scheduled appointments." />
            )
          )}

          {activeTab === "history" && (
            historyAppointments.length ? (
               <ul className="divide-y divide-[#DCE3ED]">
                {historyAppointments.map((appt) => (
                  <AppointmentRow key={appt.id} data={appt} type="history" />
                ))}
              </ul>
            ) : (
              <EmptyState text="No past or cancelled appointments." />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function AppointmentRow({ data, type, onUpdate, onReschedule }) {
  const startDate = new Date(data.start);
  const timeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <li className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
          <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[70px] border border-[#4A6FA5]/20">
              <span className="block text-xs font-bold text-[#4A6FA5] uppercase">{dateString.split(' ')[0]} {dateString.split(' ')[1].replace(',', '')}</span>
              <span className="block text-[15px] font-bold text-[#1F3A5F]">{timeString}</span>
          </div>
          <div>
              <h4 className="font-semibold text-[#1F3A5F] text-lg">{data.student.user.name} <span className="text-sm font-normal text-[#5A6C7D]">({data.student.rollNumber})</span></h4>
              <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                  <Clock size={14} /> Duration: {(new Date(data.end) - new Date(data.start)) / 60000} min
              </p>
              <p className="text-sm text-[#5A6C7D] mt-1 space-x-1">
                 <span className="font-medium text-[#1F3A5F]">Purpose:</span> <span>{data.purpose}</span>
              </p>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
         {type === "pending" && (
            <>
               <button onClick={() => onUpdate(data.id, 'APPROVED')} className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer shadow-sm">
                   <Check size={16} /> Approve
               </button>
               <button onClick={() => onUpdate(data.id, 'REJECTED')} className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer shadow-sm">
                   <X size={16} /> Reject
               </button>
            </>
         )}

         {type === "scheduled" && (
            <button
              onClick={onReschedule}
              className="px-4 py-2 text-sm font-medium border border-[#C8D3E0] text-[#2A4A75] bg-white rounded-md hover:bg-[#F3F6FA] transition"
            >
              Request Reschedule
            </button>
         )}

         {type === "history" && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              data.status === 'REJECTED' || data.status === 'CANCELLED' 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {data.status}
            </span>
         )}
      </div>
    </li>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#5A6C7D]">
      <CalendarClock className="h-12 w-12 text-[#DCE3ED] mb-4" />
      <p className="font-medium">{text}</p>
    </div>
  );
}