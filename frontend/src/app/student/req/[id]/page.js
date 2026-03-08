"use client"
import Link from "next/link";
import { useState } from "react";
import { getFacultyById, getFacultySlotsForNextDays } from "../../search/facultyData";
import { useParams } from "next/navigation";
import { Calendar, Clock, MapPin, Users, Video, FileText, CheckCircle2, ChevronDown, UserSquare2 } from "lucide-react";

export default function RequestFacultyPage({ params }) {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
  const [groupSize, setGroupSize] = useState("");
  const [recurrence, setRecurrence] = useState("Weekly");
  const [purpose, setPurpose] = useState("");
  const [meetingMode, setMeetingMode] = useState("In-Person");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const faculty = getFacultyById(id);

  if (!faculty) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
        <section className="mx-auto w-full max-w-3xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Faculty Not Found</h1>
          <p className="mt-2 text-sm text-[#5A6C7D]">
            The selected faculty ID does not exist in the demo data.
          </p>
          <Link
            href="/student/req"
            className="mt-5 inline-flex rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white"
          >
            Back to Faculty Profiles
          </Link>
        </section>
      </main>
    );
  }

  const slots = getFacultySlotsForNextDays(faculty, 5);
  const groupedSlots = slots.reduce((acc, slot) => {
    const [dateLabel, timeRange] = slot.split(" | ");

    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }

    acc[dateLabel].push(timeRange || slot);
    return acc;
  }, {});

  const availableDates = Object.keys(groupedSlots);
  const currentSelectedDate = selectedDate || availableDates[0];
  const activeDateSlots = currentSelectedDate ? groupedSlots[currentSelectedDate] : [];

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
        <section className="mx-auto w-full max-w-2xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6C8096]">Request Submitted</p>
          <h1 className="mt-2 text-2xl font-bold text-[#1F3A5F]">Appointment Request Sent</h1>
          <p className="mt-2 text-sm text-[#5A6C7D]">
            Your request has been shared with {faculty.name}. You will be notified once the faculty reviews it.
          </p>

          <div className="mt-5 rounded-md border border-[#DCE3ED] bg-[#F4F7FB] p-4 text-sm text-[#415A75]">
            <p>
              <span className="font-semibold text-[#1F3A5F]">Request ID:</span> {requestId}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Faculty:</span> {faculty.name}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Selected Slot:</span> {selectedSlot}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Meeting Mode:</span> {meetingMode}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Purpose:</span> {purpose || "Not Specified"}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Group Meeting:</span>{" "}
              {isGroupMeeting ? `Yes (Size: ${groupSize || "Not specified"})` : "No"}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[#1F3A5F]">Recurring Meeting:</span>{" "}
              {isRecurringMeeting ? `Yes (${recurrence})` : "No"}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedSlot("");
                setIsGroupMeeting(false);
                setIsRecurringMeeting(false);
                setGroupSize("");
                setPurpose("");
                setMeetingMode("In-Person");
                setRequestId("");
              }}
              className="rounded-md bg-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2A4A75]"
            >
              Request Another Slot
            </button>
            <Link
              href="/student/req"
              className="rounded-md border border-[#C5D1E0] bg-white px-5 py-2.5 text-sm font-medium text-[#2A4A75]"
            >
              Back to Faculty List
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="bg-[#E8EEF5] text-[#4A6FA5] p-4 rounded-2xl shadow-sm hidden sm:block">
            <UserSquare2 size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1F3A5F]">{faculty.name}</h1>
            <p className="text-sm font-medium text-[#4A6FA5] mt-1">{faculty.department}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE3ED] bg-[#F8FAFC] px-4 py-1.5 text-sm text-[#415A75]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-[#1F3A5F]">Focus:</span> {faculty.focus}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE3ED] bg-[#F8FAFC] px-4 py-1.5 text-sm text-[#415A75]">
            <MapPin size={14} className="text-[#4A6FA5]" />
            <span>{faculty.location}</span>
          </div>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1F3A5F]">Open Appointment Slots (Next 5 Days)</h2>
            <p className="mt-1 text-sm text-[#5A6C7D]">Pick a date first, then choose a time slot.</p>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {availableDates.map((dateLabel) => (
                <button
                  key={dateLabel}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateLabel);
                    setSelectedSlot("");
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer flex flex-col items-start gap-1 ${dateLabel === currentSelectedDate
                    ? "bg-[#4A6FA5] text-white border-[#4A6FA5] shadow-md ring-2 ring-[#4A6FA5]/30 ring-offset-1 ring-offset-white"
                    : "bg-white text-[#5A6C7D] border-[#DCE3ED] hover:bg-[#F4F7FB] hover:text-[#4A6FA5] hover:border-[#9CB3CC]"
                    }`}
                >
                  <div className="flex items-center gap-1.5 opacity-80 text-xs tracking-wider uppercase font-bold">
                    <Calendar size={14} /> DATE
                  </div>
                  <span className="text-base font-semibold">{dateLabel}</span>
                </button>
              ))}
            </div>

            {currentSelectedDate && (
              <div className="mt-4 p-5 rounded-xl border border-[#DCE3ED] bg-white shadow-sm">
                <h3 className="text-sm font-bold text-[#1F3A5F] mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-[#4A6FA5]" /> Available Times
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeDateSlots.map((timeRange) => {
                    const slotValue = `${currentSelectedDate} | ${timeRange}`;
                    const inputId = `slot-${currentSelectedDate}-${timeRange}`
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");

                    return (
                      <label key={slotValue} htmlFor={inputId} className="cursor-pointer">
                        <input
                          id={inputId}
                          type="radio"
                          name="slot"
                          value={slotValue}
                          onChange={() => setSelectedSlot(slotValue)}
                          className="peer sr-only"
                        />
                        <span className="inline-flex rounded-lg border border-[#DCE3ED] bg-[#F8FAFC] px-4 py-2 text-sm text-[#425A73] font-medium transition-all peer-checked:border-[#4A6FA5] peer-checked:bg-[#4A6FA5] peer-checked:text-white peer-checked:shadow hover:border-[#9CB3CC] hover:bg-white text-center justify-center">
                          {timeRange}
                        </span>
                      </label>
                    );
                  })}
                  {activeDateSlots.length === 0 && (
                    <p className="text-sm text-[#5A6C7D]">No available time slots on this date.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1F3A5F]">Meeting Options</h2>
            <div className="mt-3 space-y-4">
              <div className="rounded-md border border-[#DCE3ED] p-4 bg-[#F8FAFC]">
                <label className="flex items-center gap-3 text-sm font-medium text-[#1F3A5F]">
                  <input
                    type="checkbox"
                    name="groupMeeting"
                    checked={isGroupMeeting}
                    onChange={(event) => setIsGroupMeeting(event.target.checked)}
                    className="accent-[#1F3A5F] w-4 h-4 cursor-pointer"
                  />
                  <span>Group Meeting</span>
                </label>

                {isGroupMeeting && (
                  <div className="mt-3 ml-7 animate-fade-in">
                    <label className="block text-xs text-[#5A6C7D] mb-1">Expected Group Size</label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      placeholder="e.g., 4"
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      className="w-full sm:w-32 px-3 py-1.5 text-sm border border-[#DCE3ED] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5]"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-md border border-[#DCE3ED] p-4 bg-[#F8FAFC]">
                <label className="flex items-center gap-3 text-sm font-medium text-[#1F3A5F]">
                  <input
                    type="checkbox"
                    name="recurringMeeting"
                    checked={isRecurringMeeting}
                    onChange={(event) => setIsRecurringMeeting(event.target.checked)}
                    className="accent-[#1F3A5F] w-4 h-4 cursor-pointer"
                  />
                  <span>Recurring Meeting</span>
                </label>

                {isRecurringMeeting && (
                  <div className="mt-3 ml-7 animate-fade-in">
                    <label className="block text-xs text-[#5A6C7D] mb-1">Frequency</label>
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="w-full sm:w-48 px-3 py-1.5 text-sm border border-[#DCE3ED] bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5]"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCE3ED]">
            <h2 className="text-lg font-semibold text-[#1F3A5F] mb-4">Meeting Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Meeting Mode */}
              <div className="rounded-md border border-[#DCE3ED] p-4 bg-white shadow-sm">
                <label className="block text-sm font-medium text-[#1F3A5F] mb-3">Meeting Mode</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMeetingMode("In-Person")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm border transition-colors ${meetingMode === "In-Person" ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-sm" : "bg-[#F8FAFC] text-[#5A6C7D] border-[#DCE3ED] hover:bg-[#F4F7FB]"}`}
                  >
                    <MapPin size={16} /> In-Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingMode("Virtual")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm border transition-colors ${meetingMode === "Virtual" ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-sm" : "bg-[#F8FAFC] text-[#5A6C7D] border-[#DCE3ED] hover:bg-[#F4F7FB]"}`}
                  >
                    <Video size={16} /> Virtual
                  </button>
                </div>
              </div>

              {/* Purpose */}
              <div className="rounded-md border border-[#DCE3ED] p-4 bg-white shadow-sm">
                <label className="block text-sm font-medium text-[#1F3A5F] mb-3">Primary Purpose</label>
                <div className="relative">
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#DCE3ED] bg-[#F8FAFC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5] appearance-none"
                  >
                    <option value="">Select a purpose...</option>
                    <option value="Project/Thesis Guidance">Project/Thesis Guidance</option>
                    <option value="Doubt Clearance">Doubt Clearance</option>
                    <option value="General Advising">General Advising</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6C7D] pointer-events-none" size={16} />
                </div>
              </div>

            </div>

            <label htmlFor="note" className="flex items-center gap-2 text-sm font-medium text-[#1F3A5F] mb-2">
              <FileText size={16} className="text-[#4A6FA5]" /> Additional Notes
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Add any specific questions or context for the meeting..."
              className="w-full rounded-md border border-[#D4DDE8] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] transition focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!selectedSlot}
              className={`rounded-md px-5 py-2.5 text-sm font-medium text-white transition ${selectedSlot
                ? "bg-[#1F3A5F] hover:bg-[#2A4A75]"
                : "cursor-not-allowed bg-[#9AAABC]"
                }`}
              onClick={() => {
                if (!selectedSlot) return;
                const generatedId = `REQ-${Date.now().toString().slice(-6)}`;
                setRequestId(generatedId);
                setIsSubmitted(true);
              }}
            >
              Submit Request
            </button>
            <Link
              href="/student/req"
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
