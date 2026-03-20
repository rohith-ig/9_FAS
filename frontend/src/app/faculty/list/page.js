"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../../axios";
import { Loader2, CalendarClock, Clock, Eye, Sparkles, Filter, ChevronRight, User } from "lucide-react";
import Link from "next/link";

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

  

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const scheduledAppointments = appointments.filter(a => a.status === 'APPROVED');
  const historyAppointments = appointments.filter(a => ['REJECTED', 'CANCELLED'].includes(a.status) || new Date(a.end) < new Date());

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-slate-800" />
          <p className="text-sm font-semibold tracking-wide">Syncing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden font-sans">
      
      {/* Premium Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-sky-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col z-10 p-5 md:p-8 lg:p-10 max-w-[1400px] mx-auto">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 shrink-0 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
               <Sparkles size={12} className="text-indigo-500" />
               Workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Scheduler <span className="text-slate-400 font-light">Overview</span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg max-w-xl font-medium">
              Review requests and effortlessly manage your upcoming appointments in one centralized hub.
            </p>
          </div>
        </div>

        {/* Container */}
        <div className="flex flex-col flex-1 min-h-0 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden relative">
        
          {/* Top Glass Bar / Tabs */}
          <div className="border-b border-slate-100/80 bg-white/50 px-4 md:px-8 py-5 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
            
            {/* Soft Segmented Control Tabs */}
            <div className="flex bg-slate-100/60 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-hide border border-slate-200/50 shadow-inner">
              <TabButton 
                active={activeTab === "pending"} 
                onClick={() => setActiveTab("pending")}
                count={pendingAppointments.length}
                badgeColor="bg-amber-100 text-amber-700 border-amber-200"
              >
                Action Required
              </TabButton>
              <TabButton 
                active={activeTab === "scheduled"} 
                onClick={() => setActiveTab("scheduled")}
                count={scheduledAppointments.length}
                badgeColor="bg-emerald-100 text-emerald-700 border-emerald-200"
              >
                Scheduled
              </TabButton>
              <TabButton 
                active={activeTab === "history"} 
                onClick={() => setActiveTab("history")}
              >
                History Log
              </TabButton>
            </div>

            {/* Mock Filter Toggle */}
            <div className="hidden sm:flex shrink-0">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                  <Filter size={16} /> Filters
               </button>
            </div>
          </div>

          {/* List Scrolling Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-transparent">
            {activeTab === "pending" && (
              pendingAppointments.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {pendingAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="pending"  />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<CalendarClock />} title="All Caught Up" desc="No pending appointment requests to review right now." />
              )
            )}

            {activeTab === "scheduled" && (
              scheduledAppointments.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {scheduledAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="scheduled"  />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Clock />} title="Clear Schedule" desc="You don't have any upcoming scheduled appointments." />
              )
            )}

            {activeTab === "history" && (
              historyAppointments.length > 0 ? (
                 <div className="flex flex-col gap-4">
                  {historyAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="history" />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<User />} title="No Logs Found" desc="Your past records or cancelled appointments will appear here." />
              )
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, children, count, badgeColor }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 sm:flex-none px-5 py-2.5 text-[15px] font-bold rounded-xl transition-all duration-300 ease-out whitespace-nowrap flex items-center justify-center gap-2 relative ${
        active
          ? "text-slate-900 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] scale-[1.02]"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`px-2 py-0.5 text-[11px] rounded-lg border shadow-sm ${badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function AppointmentRow({ data, type }) {
  const startDate = new Date(data.start);
  const timeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const day = dateString.split(' ')[1].replace(',', '');
  const month = dateString.split(' ')[0];
  
  const isPast = ['REJECTED', 'CANCELLED'].includes(data.status);
  const duration = (new Date(data.end) - new Date(data.start)) / 60000;

  return (
    <Link href={`/faculty/view/${data.id}`} className="block group">
      <div className={`bg-white border text-left w-full border-slate-200/60 p-5 md:p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 ease-out flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden ${isPast ? 'opacity-70 saturate-[0.85]' : ''}`}>
        
        {/* Magic gradient strip on hover */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start gap-5 flex-1 min-w-0 z-10">
            {/* Calendar Block */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 text-center min-w-[76px] border border-slate-200 shadow-inner shrink-0 flex flex-col justify-center items-center">
                <span className="block text-[11px] font-black text-indigo-500 uppercase tracking-widest">{month}</span>
                <span className="block text-2xl font-black text-slate-800 leading-none my-1">{day}</span>
                <span className="block text-[11px] font-bold text-slate-500 w-full pt-1 border-t border-slate-200/80">{timeString}</span>
            </div>

            <div className="min-w-0 flex flex-col justify-center gap-1.5 pt-1">
                <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-900 text-lg truncate flex items-center gap-2">
                       {data.student.user.name} 
                    </h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                        {data.student.rollNumber}
                    </span>
                    {type === "history" && (
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm ml-1 ${
                        data.status === 'REJECTED' || data.status === 'CANCELLED' 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {data.status === 'APPROVED' ? 'COMPLETED' : data.status}
                      </span>
                    )}
                </div>

                <p className="text-sm text-slate-600 font-medium truncate max-w-full">
                   {data.purpose}
                </p>

                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <Clock size={12} className="text-indigo-400" />
                      {duration} Minutes
                   </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-end shrink-0 z-10 transition-transform duration-300 group-hover:translate-x-1">
            <div className="flex items-center justify-center p-3 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-sm transition-colors duration-300">
                <ChevronRight size={20} strokeWidth={2.5} />
            </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500 h-full">
      <div className="bg-white p-5 rounded-3xl mb-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 text-indigo-400 transform transition hover:scale-105 duration-300">
         <div className="scale-150">
           {icon}
         </div>
      </div>
      <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">{title}</h3>
      <p className="text-sm mt-2 text-slate-500 max-w-sm text-center font-medium leading-relaxed">{desc}</p>
    </div>
  );
}