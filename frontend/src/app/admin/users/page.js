"use client";
import { useState } from "react";
import { Users, UserPlus, Search, Edit2, Trash2, Shield } from "lucide-react";
import { mockFacultyList } from "@/lib/dummyData";

const mockStudents = [
    { id: "B230001CS", name: "Ada Lovelace", email: "ada@nitc.ac.in", role: "Student" },
    { id: "B230002CS", name: "Charles Babbage", email: "charles@nitc.ac.in", role: "Student" },
];

export default function ManageUsersPage() {
    const [activeTab, setActiveTab] = useState("Students");
    const [searchQuery, setSearchQuery] = useState("");

    const facultyData = mockFacultyList.map(f => ({
        id: `F-${f.id}`,
        name: f.name,
        email: f.email,
        role: "Faculty",
        department: f.department
    }));

    const displayData = activeTab === "Students" ? mockStudents : facultyData;
    const filteredData = displayData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="mx-auto w-full max-w-6xl px-4 py-8">

                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1F3A5F] flex items-center gap-3">
                            <Users className="text-[#4A6FA5]" /> Manage Users
                        </h1>
                        <p className="text-sm text-[#5A6C7D] mt-1">
                            Create, update, or remove system accounts for students and faculty.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A4A75] cursor-pointer">
                        <UserPlus size={16} /> Add User
                    </button>
                </header>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex bg-[#E8EEF5] p-1 rounded-lg w-full sm:w-auto">
                        {["Students", "Faculty"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:w-32 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${activeTab === tab
                                    ? "bg-white text-[#1F3A5F] shadow-sm"
                                    : "text-[#5A6C7D] hover:text-[#1F3A5F]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6C7D]" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-[#DCE3ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5]"
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-[#5A6C7D] border-b border-[#DCE3ED]">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User ID</th>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    {activeTab === "Faculty" && <th className="px-6 py-4 font-semibold">Department</th>}
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DCE3ED]">
                                {filteredData.length > 0 ? (
                                    filteredData.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#F4F7FB]/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-[#1F3A5F]">{user.id}</td>
                                            <td className="px-6 py-4 text-[#1F3A5F]">{user.name}</td>
                                            <td className="px-6 py-4 text-[#5A6C7D]">{user.email}</td>
                                            {activeTab === "Faculty" && <td className="px-6 py-4 text-[#5A6C7D]">{user.department}</td>}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "Faculty" ? "bg-indigo-100 text-indigo-700" : "bg-sky-100 text-sky-700"
                                                    }`}>
                                                    <Shield size={12} /> {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1.5 text-[#5A6C7D] hover:text-[#4A6FA5] hover:bg-[#F4F7FB] rounded transition-colors cursor-pointer" title="Edit User">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer" title="Delete User">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#5A6C7D]">
                                            No users found matching "{searchQuery}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
