"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, CalendarClock, Clock, User, Check, X, CalendarOff, MessageSquare, Hash, BookOpen } from "lucide-react";
import Link from "next/link";

export default function FacultyAppointmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      const response = await api.get('/appmt');
      const found = response.data.find(a => String(a.id) === String(id));
      if (found) {
        setAppointment(found);
      } else {
         router.push('/faculty/list'); // Not found, redirect back
      }
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const payload = { status };
      if ((status === 'CANCELLED' || status === 'REJECTED') && cancelNote.trim() !== '') {
          payload.cancel = cancelNote;
      }
      await api.post(`/appmt/update/${id}`, payload);
      await fetchAppointmentDetails(); // refresh specific appointment locally
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleReschedule = () => {
    alert(`Reschedule request feature coming soon.`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-slate-800" />
          <p className="text-sm font-semibold tracking-wide">Securely retrieving data...</p>
      </div>
    );
  }

  if (!appointment) return null;

  const startDate = new Date(appointment.start);
  const endDate = new Date(appointment.end);
  const dateString = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeString = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const duration = (endDate - startDate) / 60000;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden font-sans p-4 md:p-8">
      
      {/* Premium Ambient Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-sky-400/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="w-full max-w-3xl z-10 flex flex-col max-h-[calc(100vh-100px)]">
        
        <Link href="/faculty/list" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4 w-fit px-2 py-1 rounded-lg hover:bg-slate-200/50">
            <ArrowLeft size={16} strokeWidth={2.5} /> Back to Appointments
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col flex-1 shrink min-h-0">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-6 md:p-8 border-b border-slate-100 bg-white/50 shrink-0">
              <div className="space-y-3">
                  <div className="flex items-center gap-3">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm border ${
                          appointment.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200/60' :
                          appointment.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                          'bg-rose-50 text-rose-600 border-rose-200/60'
                      }`}>
                          {appointment.status === 'APPROVED' ? 'CONFIRMED' : appointment.status}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 rounded-md px-2 py-1">
                          <Hash size={12} /> {appointment.id.substring(0, 8)}
                      </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">{appointment.purpose}</h1>
              </div>
              
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 min-w-[180px] shrink-0 text-center shadow-sm">
                  <p className="text-indigo-600 font-extrabold text-sm uppercase tracking-wider">{dateString.split(' ')[0]} {dateString.split(' ')[1].replace(',', '')}</p>
                  <p className="text-slate-800 font-black text-xl mb-2">{dateString.split(' ')[2]}</p>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />
                  <p className="text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5">
                     <Clock size={14} className="text-slate-400" /> {timeString}
                  </p>
              </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
              
              {/* Core Information Section */}
              <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} className="text-slate-300" /> Student Profile
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50/80">
                      <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg select-none">
                              {appointment.student.user.name.charAt(0)}
                          </div>
                          <div>
                              <p className="text-lg font-bold text-slate-900">{appointment.student.user.name}</p>
                              <p className="text-slate-500 text-sm font-medium mt-0.5">{appointment.student.user.email}</p>
                          </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50/50 border border-indigo-100 px-3 py-1 rounded-lg">
                             Roll: {appointment.student.rollNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                             <BookOpen size={12} className="text-slate-400" /> {appointment.student.department}
                          </span>
                      </div>
                  </div>
              </div>

              {/* Auxiliary Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <CalendarClock size={14} className="text-slate-300" /> Time Block
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 h-[72px]">
                          <div className="h-10 w-10 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                             <Clock size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                             <p className="text-slate-900 text-base font-extrabold">{duration} Minutes</p>
                             <p className="text-xs text-slate-500 font-medium">Reserved Duration</p>
                          </div>
                      </div>
                  </div>

                  {appointment.note && (
                  <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={14} className="text-slate-300" /> Message Attached
                      </h3>
                      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start h-[72px] overflow-y-auto custom-scrollbar">
                          <p className="text-amber-800 font-medium text-sm leading-relaxed">
                             "{appointment.note}"
                          </p>
                      </div>
                  </div>
                  )}
              </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50/50 p-6 md:p-8 border-t border-slate-100 shrink-0">
               {appointment.status === 'PENDING' && (
                    <div className="flex flex-col gap-4 max-w-xl mx-auto">
                         <div className="flex flex-col gap-2">
                             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                 Response Note <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">(Optional)</span>
                             </label>
                             <textarea 
                                 placeholder="Add a remark (e.g. why you are declining or confirmation details)..."
                                 value={cancelNote}
                                 onChange={(e) => setCancelNote(e.target.value)}
                                 className="w-full text-sm rounded-xl border border-slate-200 p-3.5 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all resize-none h-[70px] bg-white placeholder-slate-400"
                             />
                         </div>
                         <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                            <button 
                               onClick={() => handleStatusUpdate('REJECTED')}
                               disabled={updating}
                               className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 py-3 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                            >
                               <X size={18} strokeWidth={2.5} /> Decline
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate('APPROVED')}
                              disabled={updating}
                              className="w-full sm:w-auto flex-[2] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                            >
                               <Check size={18} strokeWidth={2.5} /> Approve Request
                            </button>
                        </div>
                    </div>
               )}

               {appointment.status === 'APPROVED' && (
                    <div className="flex flex-col gap-4 max-w-xl mx-auto">
                         <div className="flex flex-col gap-2">
                             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                 Cancellation Note <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">(Optional)</span>
                             </label>
                             <textarea 
                                 placeholder="State a reason for cancelling this confirmed appointment..."
                                 value={cancelNote}
                                 onChange={(e) => setCancelNote(e.target.value)}
                                 className="w-full text-sm rounded-xl border border-slate-200 p-3.5 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all resize-none h-[70px] bg-white placeholder-slate-400"
                             />
                         </div>
                         <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                            <button 
                               onClick={() => handleStatusUpdate('CANCELLED')}
                               disabled={updating}
                               className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 py-3 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                            >
                               <CalendarOff size={18} strokeWidth={2.5} /> Cancel Booking
                            </button>
                            <button 
                              onClick={handleReschedule}
                              disabled={updating}
                              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            >
                               <Clock size={18} strokeWidth={2.5} /> Suggest Reschedule
                            </button>
                        </div>
                    </div>
               )}

               {(appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') && (
                    <div className="text-center py-4 px-6 bg-slate-100/50 rounded-xl border border-slate-200/60 max-w-sm mx-auto">
                        <p className="text-slate-500 font-bold text-sm flex justify-center items-center gap-2">
                            <Check size={16} className="text-slate-400" /> Closed. No further action needed.
                        </p>
                    </div>
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
