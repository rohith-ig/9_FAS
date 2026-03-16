"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, Calendar, Clock, CheckCircle2, User, BookOpen, Clock3, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [availabilities, setAvailabilities] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avail?facultyId=${id}`);
      // Sort by increasing date (earliest first)
      const sortedSlots = response.data.sort((a, b) => new Date(a.start) - new Date(b.start));
      setAvailabilities(sortedSlots);
      if (sortedSlots.length > 0) {
         setFaculty(sortedSlots[0].faculty);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const startObj = new Date(slot.start);
    setStartTime(`${String(startObj.getHours()).padStart(2, '0')}:${String(startObj.getMinutes()).padStart(2, '0')}`);
    const maxDur = (new Date(slot.end) - startObj) / 60000;
    setDuration(Math.min(30, maxDur));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !purpose) {
        alert("Please select a time slot and state your purpose.");
        return;
    }
    setSubmitting(true);
    try {
        const fullNote = `${note}${isGroupMeeting ? ' [Group Meeting]' : ''}${isRecurringMeeting ? ' [Recurring Meeting]' : ''}`.trim();
        const startFull = new Date(selectedSlot.start);
        const [h, m] = startTime.split(':').map(Number);
        startFull.setHours(h, m, 0, 0);

        const payload = {
            facultyId: parseInt(id),
            start: startFull.toISOString(),
            duration: parseInt(duration),
            purpose,
            note: fullNote || undefined
        };
        await api.post('/appmt', payload);
        setSuccess(true);
        setTimeout(() => {
            router.push('/student');
        }, 2000);
    } catch (error) {
         console.error("Booking error:", error);
         alert(error.response?.data?.error || "Failed to book appointment");
    } finally {
         setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Faculty Availability...</p>
      </div>
    );
  }

  if (availabilities.length === 0) {
      return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8 text-center text-[#5A6C7D]">
            <Calendar className="mx-auto h-16 w-16 text-[#DCE3ED] mb-4" />
            <p className="text-lg font-semibold">No Available Slots</p>
            <p className="text-sm">This faculty member does not have any free availability slots right now.</p>
            <Link href="/student/search" className="mt-4 inline-block text-[#4A6FA5] font-medium hover:underline">
               Back to Search
            </Link>
        </div>
      );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center justify-center p-4 bg-[#F8FBFF]">
      
      {/* Dynamic Aesthetic Background Micro-glows */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-3xl -z-10" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row h-[550px]">
          
          {/* Left Panel - Faculty List and Time selecting grid */}
          <div className="md:w-7/12 border-r border-[#E8EEF5] flex flex-col p-5 h-full">
              <div className="mb-3">
                  <Link href="/student/search" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A6FA5] hover:text-[#1F3A5F] transition">
                      <ArrowLeft size={14} /> Back to Search
                  </Link>
              </div>

              <header className="mb-4 flex items-center gap-3 pb-3 border-b border-[#F0F4F8]">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1F3A5F] to-[#2B4E7A] flex items-center justify-center text-white shadow-md">
                      <User size={20} />
                  </div>
                  <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#4A6FA5] uppercase tracking-wider">{faculty?.designation || 'Faculty'}</p>
                      <h1 className="text-lg font-extrabold text-[#1F3A5F] mt-0.5 truncate">{faculty?.user?.name}</h1>
                      <p className="text-xs font-semibold text-[#5A6C7D] truncate">{faculty?.department}</p>
                  </div>
              </header>

              <div className="flex-1 flex flex-col overflow-hidden">
                  <label className="block text-xs font-bold text-[#1F3A5F] mb-2.5 flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#1F3A5F]" /> Selected Open Slot Mappings
                  </label>
                  
                  <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
                       {availabilities.map((slot, index) => {
                           const start = new Date(slot.start);
                           const end = new Date(slot.end);
                           const isSelected = selectedSlot === slot;
                           
                           return (
                               <button
                                   type="button"
                                   key={index}
                                   onClick={() => handleSlotSelect(slot)}
                                   className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between h-20 ${
                                       isSelected 
                                       ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500 shadow-md scale-[1.02]' 
                                       : 'border-[#DCE3ED] bg-white hover:border-[#1F3A5F]/40 hover:shadow-sm'
                                   }`}
                               >
                                   <div>
                                       <p className="text-xs font-extrabold text-[#1F3A5F]">
                                           {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric',   year: 'numeric'  })}
                                       </p>
                                       <p className="text-[11px] font-semibold text-[#4A6FA5] mt-1 flex items-center gap-1">
                                           <Clock size={12} /> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                       </p>
                                   </div>
                                   <div className="text-right w-full">
                                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-indigo-500 text-white' : 'bg-[#F0F4F8] text-[#5A6C7D]'}`}>
                                           {(end - start) / 60000}m max
                                       </span>
                                   </div>
                               </button>
                           );
                       })}
                  </div>
              </div>
          </div>

          {/* Right Panel - Confirmation Forms Index */}
          <div className="md:w-5/12 bg-[#F9FBFE] flex flex-col p-5 h-full">
               {success ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-3 animate-bounce" />
                      <h2 className="text-lg font-bold text-[#1F3A5F] mb-1">Booking Sent!</h2>
                      <p className="text-xs text-[#5A6C7D] mb-4">Your request has been submitted successfully.</p>
                      <p className="text-[10px] text-gray-400">Redirecting to Dashboard...</p>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full justify-between">
                      <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-[#E8EEF5] pb-2 mb-2">
                              <BookOpen size={16} className="text-[#1F3A5F]" />
                              <h2 className="text-sm font-bold text-[#1F3A5F]">Appointment Details</h2>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-[#1F3A5F] mb-1 flex items-center gap-1">
                                  Purpose of Meeting
                              </label>
                              <input 
                                  type="text"
                                  required
                                  value={purpose}
                                  onChange={(e) => setPurpose(e.target.value)}
                                  placeholder="e.g., Doubts regarding assignment"
                                  className="w-full rounded-lg border border-[#DCE3ED] bg-white px-3 py-1.5 text-xs text-[#1F3A5F] font-semibold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              />
                          </div>

                          {selectedSlot && (
                              <div className="flex gap-2.5">
                                  <div className="flex-1">
                                      <label className="block text-[11px] font-bold text-[#1F3A5F] mb-1 flex items-center gap-1">
                                          <Clock3 size={12} /> Starting Time
                                      </label>
                                      <input 
                                          type="time"
                                          required
                                          value={startTime}
                                          min={`${String(new Date(selectedSlot.start).getHours()).padStart(2, '0')}:${String(new Date(selectedSlot.start).getMinutes()).padStart(2, '0')}`}
                                          max={`${String(new Date(selectedSlot.end).getHours()).padStart(2, '0')}:${String(new Date(selectedSlot.end).getMinutes()).padStart(2, '0')}`}
                                          onChange={(e) => setStartTime(e.target.value)}
                                          className="w-full rounded-lg border border-[#DCE3ED] bg-white px-2 py-1.5 text-xs text-[#1F3A5F] font-bold outline-none focus:border-indigo-500"
                                      />
                                  </div>
                                  <div className="flex-1">
                                      <label className="block text-[11px] font-bold text-[#1F3A5F] mb-1">Duration (Mins)</label>
                                      <input 
                                          type="number"
                                          required
                                          value={duration}
                                          min={5}
                                          max={(new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000}
                                          onChange={(e) => setDuration(Math.min(e.target.value, (new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000))}
                                          className="w-full rounded-lg border border-[#DCE3ED] bg-white px-2 py-1.5 text-xs text-[#1F3A5F] font-bold outline-none focus:border-indigo-500"
                                      />
                                  </div>
                              </div>
                          )}

                          <div>
                              <label className="block text-xs font-bold text-[#1F3A5F] mb-1 flex items-center gap-1">Options</label>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <button 
                                      type="button"
                                      onClick={() => setIsGroupMeeting(!isGroupMeeting)}
                                      className={`flex items-center justify-center gap-1.5 p-1.5 border rounded-lg font-bold cursor-pointer transition ${isGroupMeeting ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-white text-[#4A6FA5] border-[#DCE3ED] hover:bg-gray-50'}`}
                                  >
                                      Group Meet
                                  </button>
                                  <button 
                                      type="button"
                                      onClick={() => setIsRecurringMeeting(!isRecurringMeeting)}
                                      className={`flex items-center justify-center gap-1.5 p-1.5 border rounded-lg font-bold cursor-pointer transition ${isRecurringMeeting ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-white text-[#4A6FA5] border-[#DCE3ED] hover:bg-gray-50'}`}
                                  >
                                      Recurring
                                  </button>
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-[#1F3A5F] mb-1 flex items-center gap-1">
                                  <MessageSquare size={12} /> Notes (Optional)
                              </label>
                              <textarea 
                                  value={note}
                                  onChange={(e) => setNote(e.target.value)}
                                  placeholder="Scope or descriptors..."
                                  className="w-full min-h-[60px] max-h-[80px] text-xs font-semibold rounded-lg border border-[#DCE3ED] bg-white px-3 py-1.5 text-[#1F3A5F] outline-none focus:border-indigo-500 resize-none"
                              />
                          </div>
                      </div>

                      <button
                          type="submit"
                          disabled={submitting || !selectedSlot}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1F3A5F] to-[#2B4E7A] text-white font-bold text-xs shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                      >
                          {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                          {submitting ? "Booking..." : "Request Appointment"}
                      </button>
                  </form>
               )}
          </div>

      </div>

    </div>
  );
}
