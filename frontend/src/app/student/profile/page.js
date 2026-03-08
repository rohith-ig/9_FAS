import { User, Mail, BookOpen, Phone, ShieldCheck, Bell, AcademicCap, Hash } from "lucide-react";

export default function StudentProfilePage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F3A5F]">My Profile</h1>
                <p className="text-sm text-[#5A6C7D] mt-1">
                    Manage your personal information and student account settings.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column - ID Card */}
                <div className="md:col-span-1 rounded-2xl border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col items-center">
                    <div className="w-full h-24 bg-[#1F3A5F] relative"></div>
                    <div className="relative -mt-12 mb-3">
                        <div className="h-24 w-24 rounded-full bg-white p-1 border border-[#DCE3ED] shadow-sm">
                            <div className="h-full w-full rounded-full bg-[#E8EEF5] flex items-center justify-center text-[#4A6FA5]">
                                <User size={40} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-[#1F3A5F]">Ada Lovelace</h2>
                    <p className="text-sm font-medium text-[#4A6FA5] mb-2">Computer Science & Engineering</p>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-6">
                        <ShieldCheck size={14} /> Registered Student
                    </span>

                    <div className="w-full border-t border-[#F0F4F8] p-4 flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Hash size={16} className="text-[#A8BCD6]" />
                            <span className="font-medium">B230001CS</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Mail size={16} className="text-[#A8BCD6]" />
                            <span className="truncate">ada@nitc.ac.in</span>
                        </div>
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
                                <label className="block text-xs text-[#5A6C7D] mb-1">Academic Advisor</label>
                                <p className="font-medium text-[#1F3A5F]">Dr. Alan Turing</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Enrollment Status</label>
                                <p className="font-medium text-[#1F3A5F]">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Notifications</h3>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                            <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                <Mail size={18} className="text-[#4A6FA5]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#1F3A5F] text-sm">System Alerts</p>
                                <p className="text-xs text-[#5A6C7D]">All appointment updates and alerts will be sent directly to your registered email.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
