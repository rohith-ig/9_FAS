"use client";
import { useState } from "react";
import { Settings, Check, Clock, UserCheck, Shield, ChevronRight, Zap } from "lucide-react";

export default function FacultySettingsPage() {
    const [autoApproveEnabled, setAutoApproveEnabled] = useState(false);
    const [fcfsEnabled, setFcfsEnabled] = useState(false);

    // Rule states
    const [allowedRoles, setAllowedRoles] = useState({
        "Final Year (B.Tech)": true,
        "M.Tech": false,
        "Ph.D.": true,
        "Junior Students (1st - 3rd Year)": false,
    });

    const [allowedPurposes, setAllowedPurposes] = useState({
        "Project Review": true,
        "Thesis Discussion": true,
        "Doubt Clearance": false,
        "General Advising": false,
    });

    const toggleRole = (role) => {
        setAllowedRoles(prev => ({ ...prev, [role]: !prev[role] }));
    };

    const togglePurpose = (purpose) => {
        setAllowedPurposes(prev => ({ ...prev, [purpose]: !prev[purpose] }));
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 relative">

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F3A5F]">Appointment Settings</h1>

            </header>

            <div className="space-y-6">

                {/* Master Toggle Card */}
                <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-colors ${autoApproveEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-[#E8EEF5] text-[#5A6C7D]'}`}>
                                <Settings size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#1F3A5F]">Smart Auto-Approval</h2>
                                <p className="text-sm text-[#5A6C7D] mt-1 max-w-xl">
                                    When enabled, the system will automatically confirm appointment requests that match your specific rules below, saving you manual review time.
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={autoApproveEnabled}
                                onChange={() => setAutoApproveEnabled(!autoApproveEnabled)}
                            />
                            <div className="w-14 h-7 bg-[#DCE3ED] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                {/* Conditional Rules Section */}
                <div className={`transition-all duration-300 ease-in-out ${autoApproveEnabled ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 pointer-events-none -translate-y-4 h-0 overflow-hidden absolute'}`}>

                    {/* FCFS Toggle */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 mt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#1F3A5F]">First-Come, First-Served (FCFS)</h3>
                                    <p className="text-sm text-[#5A6C7D]">Instantly approve ANY request that fits an available slot, ignoring specific rules below.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={fcfsEnabled}
                                    onChange={() => setFcfsEnabled(!fcfsEnabled)}
                                />
                                <div className="w-11 h-6 bg-[#DCE3ED] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out ${fcfsEnabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <h3 className="text-lg font-bold text-[#1F3A5F] mb-4 mt-8 flex items-center gap-2">
                            <Shield size={20} className="text-[#4A6FA5]" />
                            Granular Auto-Approval Rules
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Rule 1: Student Designation */}
                            <div className="rounded-2xl border border-[#DCE3ED] bg-white overflow-hidden shadow-sm">
                                <div className="bg-[#F8FAFC] px-5 py-4 border-b border-[#DCE3ED]">
                                    <h4 className="font-bold text-[#1F3A5F] flex items-center gap-2">
                                        <UserCheck size={18} className="text-[#4A6FA5]" />
                                        By Student Designation
                                    </h4>
                                    <p className="text-xs text-[#5A6C7D] mt-1">Select which student levels are instantly approved.</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    {Object.entries(allowedRoles).map(([role, isAllowed]) => (
                                        <label
                                            key={role}
                                            className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3ED] hover:bg-[#F8FAFC] transition cursor-pointer group"
                                            onClick={(e) => { e.preventDefault(); toggleRole(role); }}
                                        >
                                            <span className={`text-sm font-medium ${isAllowed ? 'text-[#1F3A5F]' : 'text-[#5A6C7D]'}`}>{role}</span>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAllowed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[#A8BCD6] text-transparent group-hover:border-indigo-400'}`}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rule 2: Appointment Type */}
                            <div className="rounded-2xl border border-[#DCE3ED] bg-white overflow-hidden shadow-sm">
                                <div className="bg-[#F8FAFC] px-5 py-4 border-b border-[#DCE3ED]">
                                    <h4 className="font-bold text-[#1F3A5F] flex items-center gap-2">
                                        <Clock size={18} className="text-[#4A6FA5]" />
                                        By Appointment Purpose
                                    </h4>
                                    <p className="text-xs text-[#5A6C7D] mt-1">Select which meeting reasons are instantly approved.</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    {Object.entries(allowedPurposes).map(([purpose, isAllowed]) => (
                                        <label
                                            key={purpose}
                                            className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3ED] hover:bg-[#F8FAFC] transition cursor-pointer group"
                                            onClick={(e) => { e.preventDefault(); togglePurpose(purpose); }}
                                        >
                                            <span className={`text-sm font-medium ${isAllowed ? 'text-[#1F3A5F]' : 'text-[#5A6C7D]'}`}>{purpose}</span>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAllowed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[#A8BCD6] text-transparent group-hover:border-indigo-400'}`}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button className="flex items-center gap-2 rounded-lg bg-[#1F3A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2A4A75] shadow-sm">
                        Save Configuration <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
