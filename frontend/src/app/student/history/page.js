"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, Clock, ChevronRight, Filter, Loader2, Video } from "lucide-react";
import api from "../../../axios";
import toast, { Toaster } from "react-hot-toast";

export default function StudentHistoryPage() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appmt');
                const formattedData = response.data.map(apt => {
                    const startDate = new Date(apt.start);
                    let displayStatus = apt.status.charAt(0) + apt.status.slice(1).toLowerCase();
                    if (apt.status === 'APPROVED') displayStatus = 'Confirmed';

                    return {
                        id: apt.id,
                        facultyId: apt.facultyId,
                        faculty: apt.faculty?.user?.name || "Faculty",
                        date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        status: displayStatus,
                        rescheduleRequested: apt.rescheduleRequested || false,
                        type: apt.purpose,
                        dept: apt.faculty?.department || "",
                        email: apt.faculty?.user?.email || "",
                        cancellationNote: apt.cancellationNote || "",
                        startRaw: apt.start,
                        capacity: apt.capacity || 1,
                        students: apt.students || [],
                        isOnline: apt.isOnline || false,
                        meetingLink: apt.meetingLink || null,
                        recurrenceId: apt.recurrenceId,
                        recurrenceRule: apt.recurrenceRule
                    };
                }).sort((a, b) => new Date(a.startRaw) - new Date(b.startRaw));
                
                const groupAppointments = (appts) => {
                    const grouped = [];
                    const seen = new Set();
                    for (const appt of appts) {
                        if (appt.recurrenceId) {
                            if (seen.has(appt.recurrenceId)) continue;
                            seen.add(appt.recurrenceId);
                            
                            const series = appts.filter(a => a.recurrenceId === appt.recurrenceId);
                            grouped.push({
                                ...appt,
                                isGroupedSeries: true,
                                seriesCount: series.length,
                                recurrenceRule: appt.recurrenceRule
                            });
                        } else {
                            grouped.push(appt);
                        }
                    }
                    return grouped;
                };

                setAppointments(groupAppointments(formattedData));
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const [activeTab, setActiveTab] = useState("pending");

    const rescheduleRequests = appointments.filter(
        (apt) => apt.rescheduleRequested && apt.status !== 'Cancelled' && apt.status !== 'Rejected'
    );

    const pendingAppointments = appointments.filter(a => a.status === 'Pending');
    const scheduledAppointments = appointments.filter(a => a.status === 'Confirmed');
    const historyAppointments = appointments.filter(a => ['Rejected', 'Cancelled', 'Completed'].includes(a.status));

    const filteredAppointments =
        activeTab === "pending" ? pendingAppointments :
        activeTab === "scheduled" ? scheduledAppointments :
        historyAppointments;

    const handleCancelAppointment = async (id) => {
        try {
            await api.post(`/appmt/student/cancel/${id}`);
            const updatedAppointments = appointments.filter(
                (apt) => apt.id !== id
            );
            setAppointments(updatedAppointments);
            toast.success("Appointment cancelled. Faculty will be notified.");
        } catch (e) {
            console.error(e);
            toast.error("Failed to cancel appointment");
        }
    };

    const handlePickNewSlot = (apt) => {
        window.location.href = `/student/search/${apt.facultyId}?rescheduleOldId=${apt.id}`;
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center bg-[#F4F7FB] text-[#5A6C7D] flex-col gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#1F3A5F]" />
                <p className="font-semibold">Loading History...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F4F7FB] py-8 font-sans">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <Toaster position="top-center" />

            {/* HEADER */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F]">
                        Appointment History
                    </h1>
                    <p className="text-[#5A6C7D] mt-1 text-sm md:text-base">
                        View past meetings, manage pending requests, and track cancellations.
                    </p>
                </div>

            </header>


            {/* RESCHEDULE REQUEST BOX */}
            {rescheduleRequests.length > 0 && (

                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">

                    <h3 className="font-semibold text-amber-800 mb-3">
                        Reschedule Requests
                    </h3>

                    {rescheduleRequests.map((apt) => (

                        <div
                            key={apt.id}
                            className="flex justify-between items-center mb-3"
                        >

                            <div>

                                <p className="text-sm font-medium text-[#1F3A5F]">
                                    {apt.faculty} requested to reschedule your appointment
                                </p>

                                <p className="text-xs text-[#5A6C7D]">
                                    {apt.date} • {apt.time}
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => handlePickNewSlot(apt)}
                                    className="px-3 py-1 text-sm bg-[#4A6FA5] text-white rounded-md hover:bg-[#3f5e8a]"
                                >
                                    Pick New Slot
                                </button>

                                <button
                                    onClick={() => handleCancelAppointment(apt.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}


            {/* APPOINTMENT LIST */}
            <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm flex flex-col md:min-h-[600px] overflow-hidden">
            
                {/* Tabs */}
                <div className="flex bg-[#F8FAFC] border-b border-[#DCE3ED] overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                            activeTab === "pending"
                            ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                            : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
                        }`}
                    >
                        Pending Requests <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs select-none">{pendingAppointments.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("scheduled")}
                        className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                            activeTab === "scheduled"
                            ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                            : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
                        }`}
                    >
                        Confirmed <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs select-none">{scheduledAppointments.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                            activeTab === "history"
                            ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                            : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
                        }`}
                    >
                        History <span className="rounded-full bg-gray-200 text-gray-700 px-2 py-0.5 text-xs select-none">{historyAppointments.length}</span>
                    </button>
                </div>

                {filteredAppointments.length > 0 ? (

                    <ul className="divide-y divide-[#DCE3ED]">

                        {filteredAppointments.map((apt) => (

                            <li
                                key={apt.id}
                                className="p-5 hover:bg-[#F8FAFC] group transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-transparent hover:border-[#4A6FA5]"
                            >

                                <div className="flex items-start gap-4">

                                    <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[60px] border border-[#4A6FA5]/20">
                                        <span className="block text-xs font-bold text-[#4A6FA5] uppercase">
                                            {apt.date.split(" ")[0]}
                                        </span>

                                        <span className="block text-lg font-bold text-[#1F3A5F]">
                                            {apt.date.split(" ")[1].replace(",", "")}
                                        </span>
                                    </div>

                                    <div>

                                        <h4 className="font-semibold text-[#1F3A5F] text-lg">
                                            {apt.faculty}
                                        </h4>

                                        <p className="text-sm text-[#5A6C7D] flex flex-wrap items-center gap-2 mt-1">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {apt.time} • {apt.type}</span>
                                            {apt.isOnline && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                                                    <Video size={10} /> Online
                                                </span>
                                            )}
                                            {apt.isGroupedSeries && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1 ml-1">
                                                    ⟳ {apt.recurrenceRule} ({apt.seriesCount}x)
                                                </span>
                                            )}
                                        </p>

                                        {apt.isOnline && apt.meetingLink && apt.status === 'Confirmed' && (
                                            <a href={apt.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition">
                                                <Video size={12} /> Join Meeting
                                            </a>
                                        )}

                                        {(apt.status === "Cancelled" || apt.status === "Rejected") && apt.cancellationNote && apt.cancellationNote !== "Cancelled by student" && (
                                            <div className="mt-2.5 bg-rose-50 border border-rose-100 rounded-md p-2.5 max-w-sm">
                                                <p className="text-xs font-bold text-rose-800 mb-0.5">Cancellation Note:</p>
                                                <p className="text-xs text-rose-700 leading-snug">{apt.cancellationNote}</p>
                                            </div>
                                        )}

                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === "Confirmed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : apt.status === "Pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {apt.status}
                                    </span>

                                    <Link
                                        href={`/student/history/manage?id=${apt.id}&name=${encodeURIComponent(apt.faculty)}&date=${encodeURIComponent(apt.date)}&time=${apt.time}&dept=${apt.dept}&email=${apt.email}&status=${apt.status}&cancelNote=${encodeURIComponent(apt.cancellationNote || '')}`}
                                        className="text-[#5A6C7D] group-hover:bg-[#4A6FA5] group-hover:text-white p-2 rounded-full transition-all duration-300"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>

                                </div>

                            </li>

                        ))}

                    </ul>

                ) : (

                    <div className="p-12 text-center text-[#5A6C7D]">

                        <Calendar className="mx-auto h-12 w-12 text-[#DCE3ED] mb-3" />

                        <p className="text-lg font-medium text-[#1F3A5F]">
                            No appointments found.
                        </p>

                        <p className="mt-1">
                            {activeTab === "pending" 
                                ? "You have no pending requests." 
                                : activeTab === "scheduled" 
                                    ? "You have no confirmed appointments coming up."
                                    : "No appointment history found."
                            }
                        </p>

                    </div>

                )}

            </div>

        </div>
        </div>
    );
}