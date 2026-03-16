"use client";

import { User, Mail, BookOpen, Phone, ShieldCheck, Bell, AcademicCap, Hash, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../../../axios.js";

export default function StudentProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        // Clear tokens or trigger redirect
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
                <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
                <p className="text-sm font-medium">Loading Profile Data...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-[#F7F9FC] mx-auto w-full max-w-4xl px-4 py-8">

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F3A5F]">My Profile</h1>
                <p className="text-sm text-[#5A6C7D] mt-1">
                    Manage your personal information and student account settings.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column - ID Card */}
                <div className="md:col-span-1 rounded-2xl border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col items-center h-fit">
                    <div className="w-full h-24 bg-[#1F3A5F] relative"></div>
                    <div className="relative -mt-12 mb-3">
                        <div className="h-24 w-24 rounded-full bg-white p-1 border border-[#DCE3ED] shadow-sm">
                            <div className="h-full w-full rounded-full bg-[#E8EEF5] flex items-center justify-center text-[#4A6FA5]">
                                <User size={40} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-[#1F3A5F]">{user?.name}</h2>
                    <p className="text-sm font-medium text-[#4A6FA5] mb-2">{user?.studentProfile?.department || 'Department Not Set'}</p>

                    <div className="w-full border-t border-[#F0F4F8] p-4 flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Hash size={16} className="text-[#A8BCD6]" />
                            <span className="font-medium">{user?.studentProfile?.rollNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Mail size={16} className="text-[#A8BCD6]" />
                            <span className="truncate">{user?.email}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                        >
                            <LogOut size={16} /> Log Out
                        </button>
                    </div>
                </div>

                {/* Right Column - Details & Settings */}
                <div className="md:col-span-2 space-y-6">

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Academic Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Degree Program</label>
                                <p className="font-medium text-[#1F3A5F]">B.Tech</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Current Semester</label>
                                <p className="font-medium text-[#1F3A5F]">Semester 6</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Department</label>
                                <p className="font-medium text-[#1F3A5F]">{user?.studentProfile?.department || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Enrollment Status</label>
                                <p className="font-medium text-[#1F3A5F]">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#1F3A5F]">Notification Preferences</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                        <Mail size={18} className="text-[#4A6FA5]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#1F3A5F] text-sm">Email Alerts</p>
                                        <p className="text-xs text-[#5A6C7D]">Receive updates about appointment statuses.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F3A5F]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                        <Bell size={18} className="text-[#4A6FA5]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#1F3A5F] text-sm">Push Notifications</p>
                                        <p className="text-xs text-[#5A6C7D]">Instant browser alerts for message replies.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F3A5F]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
