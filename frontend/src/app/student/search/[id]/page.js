"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [availabilities, setAvailabilities] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avail?facultyId=${id}`);
      setAvailabilities(response.data);
      if (response.data.length > 0) {
         setFaculty(response.data[0].faculty);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !purpose) {
        alert("Please select a time slot and state your purpose.");
        return;
    }
    setSubmitting(true);
    try {
        const payload = {
            facultyId: parseInt(id),
            start: selectedSlot.start,
            duration: (new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000,
            purpose,
            note
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      
      <Link href="/student/search" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A6FA5] hover:text-[#1F3A5F] transition mb-6">
          <ArrowLeft size={16} /> Back to Search
      </Link>

      {success ? (
         <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center shadow-md animate-fade-in">
             <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
             <h2 className="text-2xl font-bold text-[#1F3A5F] mb-2">Booking Request Sent!</h2>
             <p className="text-[#5A6C7D] mb-4">Your appointment request has been submitted successfully and is awaiting faculty approval.</p>
             <p className="text-xs text-gray-400">Redirecting to Dashboard...</p>
         </div>
      ) : (
         <div className="bg-white border border-[#DCE3ED] rounded-2xl shadow-sm p-6 md:p-8">
             <header className="mb-6 border-b border-[#E8EEF5] pb-4">
                 <p className="text-sm font-bold text-[#4A6FA5] tracking-wider uppercase">{faculty?.designation}</p>
                 <h1 className="text-2xl font-bold text-[#1F3A5F] mt-1">{faculty?.user?.name}</h1>
                 <p className="text-sm text-[#5A6C7D] mt-1">{faculty?.department}</p>
             </header>

             <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                     <label className="block text-sm font-bold text-[#1F3A5F] mb-3">Select available slot:</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                          {availabilities.map((slot, index) => {
                              const start = new Date(slot.start);
                              const end = new Date(slot.end);
                              const isSelected = selectedSlot === slot;
                              
                              return (
                                  <button
                                      type="button"
                                      key={index}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`p-3 border rounded-xl text-left transition ${
                                          isSelected 
                                          ? 'border-[#1F3A5F] bg-[#1F3A5F]/5 ring-2 ring-[#1F3A5F]' 
                                          : 'border-[#DCE3ED] hover:bg-gray-50'
                                      }`}
                                  >
                                      <p className="text-[14px] font-bold text-[#1F3A5F]">
                                          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric',   year: 'numeric'  })}
                                      </p>
                                      <p className="text-xs font-semibold text-[#4A6FA5] mt-1">
                                          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                  </button>
                              );
                          })}
                     </div>
                 </div>

                 <div>
                     <label className="block text-sm font-bold text-[#1F3A5F] mb-2">Purpose of Meeting</label>
                     <input 
                         type="text"
                         required
                         value={purpose}
                         onChange={(e) => setPurpose(e.target.value)}
                         placeholder="e.g., Doubts regarding assignment, Project Review"
                         className="w-full rounded-lg border border-[#DCE3ED] px-4 py-2.5 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] focus:ring-2"
                     />
                 </div>

                 <div>
                     <label className="block text-sm font-bold text-[#1F3A5F] mb-2">Note for Faculty (Optional)</label>
                     <textarea 
                         value={note}
                         onChange={(e) => setNote(e.target.value)}
                         placeholder="Add further details or context here..."
                         className="w-full min-h-[100px] rounded-lg border border-[#DCE3ED] px-4 py-2.5 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] focus:ring-2 resize-none"
                     />
                 </div>

                 <button
                     type="submit"
                     disabled={submitting}
                     className="w-full py-3 rounded-xl bg-[#1F3A5F] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#2A4A75] transition flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                     {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                     {submitting ? "Booking..." : "Request Appointment"}
                 </button>
             </form>
         </div>
      )}

    </div>
  );
}
