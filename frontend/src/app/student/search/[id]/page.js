"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
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
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
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
        const fullNote = `${note}${isGroupMeeting ? ' [Group Meeting]' : ''}${isRecurringMeeting ? ' [Recurring Meeting]' : ''}`.trim();
        const payload = {
            facultyId: parseInt(id),
            start: selectedSlot.start,
            duration: (new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000,
            purpose,
            note: fullNote || undefined
        };
        await api.post('/appmt', payload);
        setSuccess(true);
        setTimeout(() => {
            router.push('/student');
        }, 2500);
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
        <main className="min-h-screen bg-[#F7F9FC] px-4 py-10 flex items-center justify-center">
        <section className="mx-auto w-full max-w-2xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm text-center">
            <p className="text-lg font-semibold text-[#1F3A5F]">No Available Slots</p>
            <p className="text-sm text-[#5A6C7D] mt-1">This faculty member does not have any free availability slots right now.</p>
            <Link href="/student/search" className="mt-5 inline-flex rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2A4A75] transition">
               Back to Search
            </Link>
        </section>
        </main>
      );
  }

  const groupedSlots = availabilities.reduce((acc, slot) => {
    const start = new Date(slot.start);
    const dateLabel = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(slot);
    return acc;
  }, {});

  if (success) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
        <section className="mx-auto w-full max-w-2xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6C8096]">Request Submitted</p>
          <h1 className="mt-2 text-2xl font-bold text-[#1F3A5F]">Appointment Request Sent</h1>
          <p className="mt-2 text-sm text-[#5A6C7D]">
            Your request has been shared with {faculty?.user?.name || "the faculty member"}. You will be notified once they review it.
          </p>

          <div className="mt-5 rounded-md border border-[#DCE3ED] bg-[#F4F7FB] p-4 text-sm text-[#415A75]">
            <p>
              <span className="font-semibold text-[#1F3A5F]">Faculty:</span> {faculty?.user?.name}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Selected Slot:</span> {new Date(selectedSlot.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | {new Date(selectedSlot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Group Meeting:</span> {isGroupMeeting ? "Yes" : "No"}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Recurring Meeting:</span> {isRecurringMeeting ? "Yes" : "No"}
            </p>
          </div>

          <p className="text-xs text-center text-gray-400 mt-6 animate-pulse">Redirecting to Dashboard...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.12em] text-[#6C8096]">Request Faculty</p>
        <h1 className="mt-2 text-2xl font-bold text-[#1F3A5F]">{faculty?.user?.name}</h1>
        <p className="mt-1 text-sm text-[#5A6C7D]">{faculty?.department} • {faculty?.designation}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1F3A5F]">Open Appointment Slots (Next 7 Days)</h2>
            <p className="mt-1 text-sm text-[#5A6C7D]">Pick a date first, then choose a time slot.</p>
            <div className="mt-4 space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {Object.entries(groupedSlots).map(([dateLabel, slots]) => (
                <section key={dateLabel} className="rounded-md border border-[#DCE3ED] bg-[#FBFCFE] p-3">
                  <p className="text-sm font-semibold text-[#1F3A5F]">{dateLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot, index) => {
                      const start = new Date(slot.start);
                      const end = new Date(slot.end);
                      const timeRange = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      const inputId = `slot-${dateLabel}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                      return (
                        <label key={index} htmlFor={inputId} className="cursor-pointer">
                          <input
                            id={inputId}
                            type="radio"
                            name="slot"
                            onChange={() => setSelectedSlot(slot)}
                            className="peer sr-only"
                          />
                          <span className="inline-flex rounded-full border border-[#C6D3E2] bg-white px-3 py-1.5 text-sm text-[#425A73] transition peer-checked:border-[#1F3A5F] peer-checked:bg-[#1F3A5F] peer-checked:text-white hover:border-[#9CB3CC]">
                            {timeRange}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1F3A5F]">Meeting Options</h2>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-3 text-sm text-[#425A73]">
                <input
                  type="checkbox"
                  name="groupMeeting"
                  checked={isGroupMeeting}
                  onChange={(event) => setIsGroupMeeting(event.target.checked)}
                  className="accent-[#1F3A5F]"
                />
                <span>Group meeting</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-[#425A73]">
                <input
                  type="checkbox"
                  name="recurringMeeting"
                  checked={isRecurringMeeting}
                  onChange={(event) => setIsRecurringMeeting(event.target.checked)}
                  className="accent-[#1F3A5F]"
                />
                <span>Recurring meeting</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-[#1F3A5F]">
              Purpose of Meeting
            </label>
            <input
              id="purpose"
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Doubts regarding assignment, Project Review"
              className="mt-2 w-full rounded-md border border-[#D4DDE8] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] transition focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-[#1F3A5F]">
              Notes / Context (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a short note for the faculty member..."
              className="mt-2 w-full rounded-md border border-[#D4DDE8] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] transition focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className={`rounded-md px-5 py-2.5 text-sm font-medium text-white transition flex items-center gap-2 ${
                selectedSlot
                  ? "bg-[#1F3A5F] hover:bg-[#2A4A75]"
                  : "cursor-not-allowed bg-[#9AAABC]"
              }`}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <Link
              href="/student/search"
              className="rounded-md border border-[#C5D1E0] bg-white px-5 py-2.5 text-sm font-medium text-[#2A4A75]"
            >
              Back
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
