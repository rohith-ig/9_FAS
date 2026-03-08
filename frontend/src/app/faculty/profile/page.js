import { User, Mail, BookOpen, MapPin, ShieldCheck, Hash, UserSquare2, Award } from "lucide-react";

export default function FacultyProfilePage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F3A5F]">Faculty Profile</h1>
                <p className="text-sm text-[#5A6C7D] mt-1">
                    Manage your public directory information and credentials.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column - ID Card */}
                <div className="md:col-span-1 border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col items-center rounded-2xl">
                    <div className="w-full h-24 bg-[#1F3A5F] relative"></div>
                    <div className="relative -mt-12 mb-3">
                        <div className="h-24 w-24 rounded-full bg-white p-1 border border-[#DCE3ED] shadow-sm">
                            <div className="h-full w-full rounded-full bg-[#E8EEF5] flex items-center justify-center text-[#4A6FA5]">
                                <UserSquare2 size={40} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-[#1F3A5F] px-4 text-center">Dr. Alan Turing</h2>
                    <p className="text-sm font-medium text-[#4A6FA5] mb-2 px-4 text-center">Associate Professor</p>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6">
                        <ShieldCheck size={14} /> Verified Faculty
                    </span>

                    <div className="w-full border-t border-[#F0F4F8] p-4 flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Hash size={16} className="text-[#A8BCD6]" />
                            <span className="font-medium">F-2093</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Mail size={16} className="text-[#A8BCD6]" />
                            <span className="truncate">aturing@nitc.ac.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <MapPin size={16} className="text-[#A8BCD6]" />
                            <span>Room 304, Main Block</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Academic & Public Info */}
                <div className="md:col-span-2 space-y-6">

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Academic & Research Profile</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-[#5A6C7D] mb-1">Department</label>
                                <p className="font-medium text-[#1F3A5F]">Computer Science and Engineering</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-[#5A6C7D] mb-1">Primary Research Focus</label>
                                <p className="font-medium text-[#1F3A5F]">Artificial Intelligence & Theory of Computation</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Highest Qualification</label>
                                <p className="font-medium text-[#1F3A5F]">Ph.D. in Computer Science</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Years of Experience</label>
                                <p className="font-medium text-[#1F3A5F]">15+ Years</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#1F3A5F]">Current Courses (Semester 6)</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                                <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                    <BookOpen size={16} className="text-[#4A6FA5]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#1F3A5F] text-sm">CS3001 - Operating Systems</p>
                                    <p className="text-xs text-[#5A6C7D]">Tuesdays & Thursdays</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                                <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                    <BookOpen size={16} className="text-[#4A6FA5]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#1F3A5F] text-sm">CS4012 - Machine Learning</p>
                                    <p className="text-xs text-[#5A6C7D]">Wednesdays & Fridays</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
