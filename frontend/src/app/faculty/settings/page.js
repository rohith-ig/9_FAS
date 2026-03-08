"use client";

import { useState } from "react";
import { Settings, CheckSquare, ShieldCheck, Save, Clock, Users } from "lucide-react";

export default function SettingsPage() {
    const [autoApprove, setAutoApprove] = useState(false);
    const [allowGroup, setAllowGroup] = useState(true);
    const [allowRecurring, setAllowRecurring] = useState(false);
    const [maxDuration, setMaxDuration] = useState("30");

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">

            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F] flex items-center gap-3">
                        <Settings className="text-[#4A6FA5]" /> Appointment Settings
                    </h1>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Configure how you handle incoming appointment requests from students.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2A4A75] cursor-pointer">
                    <Save size={16} /> Save Preferences
                </button>
            </header>

            <div className="space-y-6">

                {/* Auto Approval Settings */}
                <section className="rounded-xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <CheckSquare size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-[#1F3A5F]">Auto-Approval Mode</h2>
                            <p className="text-sm text-[#5A6C7D]">Automatically approve requests if they fit within your available free slots.</p>
                        </div>
                        <div className="flex items-center h-full">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>

                    {autoApprove && (
                        <div className="ml-14 p-4 bg-[#F8FAFC] border border-[#DCE3ED] rounded-lg animate-fade-in">
                            <h3 className="font-semibold text-[#1F3A5F] mb-3 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" /> Apply Auto-Approval Only For:
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 cursor-pointer" />
                                    <span className="text-sm text-[#1F3A5F]">Project/Thesis guidance requests</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 cursor-pointer" />
                                    <span className="text-sm text-[#1F3A5F]">Doubt clearance sessions</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 cursor-pointer" />
                                    <span className="text-sm text-[#1F3A5F]">General advising</span>
                                </label>
                            </div>
                        </div>
                    )}
                </section>

                {/* Appointment Behaviors */}
                <section className="rounded-xl border border-[#DCE3ED] bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-6">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-lg font-bold text-[#1F3A5F] mb-1">Appointment Allowances</h2>
                        <p className="text-sm text-[#5A6C7D]">Set what type of meetings students are allowed to request.</p>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-sky-50 p-2 text-sky-600 mt-1">
                            <Users size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-[#1F3A5F]">Group Appointments</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={allowGroup} onChange={() => setAllowGroup(!allowGroup)} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                                </label>
                            </div>
                            <p className="text-sm text-[#5A6C7D] mt-1">Allow multiple students to book the same time slot.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-amber-50 p-2 text-amber-600 mt-1">
                            <Clock size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-[#1F3A5F]">Recurring Meetings</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={allowRecurring} onChange={() => setAllowRecurring(!allowRecurring)} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                            </div>
                            <p className="text-sm text-[#5A6C7D] mt-1">Allow students to request weekly or bi-weekly standing time slots.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
