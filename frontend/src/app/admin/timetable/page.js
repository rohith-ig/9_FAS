"use client";

import { useState } from "react";
import { CalendarClock, Plus, Search, MapPin, Clock, Save, Trash2 } from "lucide-react";
import { mockFacultyList } from "@/lib/dummyData";

export default function TimetablePage() {
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [courses, setCourses] = useState([
        { id: 1, courseCode: "CS3001", name: "Operating Systems", day: "Monday", time: "10:00 AM - 11:30 AM", room: "MB 201" },
        { id: 2, courseCode: "CS4012", name: "Machine Learning", day: "Wednesday", time: "2:00 PM - 4:00 PM", room: "MB 104" }
    ]);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">

            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F] flex items-center gap-3">
                        <CalendarClock className="text-[#4A6FA5]" /> Manage Faculty Timetable
                    </h1>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Assign courses, time slots, and rooms ensuring no conflicts.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A4A75] cursor-pointer">
                    <Save size={16} /> Publish Changes
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Column - Select Faculty */}
                <div className="lg:col-span-1 rounded-xl border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col h-fit">
                    <div className="p-4 border-b border-[#DCE3ED] bg-[#F8FAFC]">
                        <h2 className="font-semibold text-[#1F3A5F] mb-3">Select Faculty</h2>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6C7D]" size={14} />
                            <input
                                type="text"
                                placeholder="Search faculty..."
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#DCE3ED] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5]"
                            />
                        </div>
                    </div>

                    <div className="p-2 max-h-[400px] overflow-y-auto">
                        {mockFacultyList.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setSelectedFaculty(f.name)}
                                className={`w-full text-left p-3 rounded-md transition-colors text-sm mb-1 ${selectedFaculty === f.name
                                        ? "bg-[#4A6FA5]/10 border border-[#4A6FA5]/20"
                                        : "hover:bg-[#F4F7FB] border border-transparent"
                                    }`}
                            >
                                <div className="font-medium text-[#1F3A5F]">{f.name}</div>
                                <div className="text-xs text-[#5A6C7D] mt-0.5">{f.department}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column - Timetable Edit */}
                <div className="lg:col-span-3">
                    {selectedFaculty ? (
                        <div className="rounded-xl border border-[#DCE3ED] bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-[#DCE3ED]">
                                <div>
                                    <h2 className="text-lg font-bold text-[#1F3A5F]">{selectedFaculty}'s Timetable</h2>
                                    <p className="text-sm text-[#5A6C7D]">Add or modification class assignments below.</p>
                                </div>
                                <button className="inline-flex items-center gap-2 rounded-md border border-[#DCE3ED] px-4 py-2 text-sm font-medium text-[#1F3A5F] hover:bg-[#F4F7FB] transition cursor-pointer">
                                    <Plus size={16} /> Add Class
                                </button>
                            </div>

                            <div className="p-5">
                                {courses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {courses.map((course) => (
                                            <div key={course.id} className="border border-[#DCE3ED] rounded-lg p-4 group hover:border-[#4A6FA5]/40 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#E8EEF5] text-[#1F3A5F] mb-1">
                                                            {course.courseCode}
                                                        </span>
                                                        <h3 className="font-semibold text-[#1F3A5F]">{course.name}</h3>
                                                    </div>
                                                    <button className="text-[#5A6C7D] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="space-y-2 mt-4 text-sm text-[#5A6C7D]">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarClock size={14} className="text-[#4A6FA5]" />
                                                        <span className="font-medium text-[#1F3A5F]">{course.day}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-[#4A6FA5]" /> {course.time}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-[#4A6FA5]" /> {course.room}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-[#5A6C7D] mb-4">No classes assigned to this faculty yet.</p>
                                        <button className="inline-flex items-center gap-2 rounded-md border border-[#DCE3ED] px-4 py-2 text-sm font-medium text-[#1F3A5F] hover:bg-[#F4F7FB] transition cursor-pointer">
                                            <Plus size={16} /> Add First Class
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full rounded-xl border border-[#DCE3ED] border-dashed bg-[#F8FAFC] flex flex-col items-center justify-center p-10 text-center text-[#5A6C7D]">
                            <CalendarClock size={48} className="text-[#C8D3E0] mb-4" />
                            <h3 className="text-lg font-medium text-[#1F3A5F] mb-1">No Faculty Selected</h3>
                            <p>Select a faculty member from the list to view and manage their timetable.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
