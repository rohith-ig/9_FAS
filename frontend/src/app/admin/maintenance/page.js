"use client";

import { Database, HardDrive, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

const maintenanceLogs = [
    { id: "LOG-1049", type: "Full Backup", date: "Oct 23, 2026 - 02:00 AM", status: "Success", size: "1.4 GB" },
    { id: "LOG-1048", type: "Database Cleanup", date: "Oct 20, 2026 - 03:15 AM", status: "Success", size: "Removed 240 MB" },
    { id: "LOG-1047", type: "Incremental Backup", date: "Oct 20, 2026 - 02:00 AM", status: "Warning", size: "120 MB", note: "Timeout on archive table" },
    { id: "LOG-1046", type: "Full Backup", date: "Oct 16, 2026 - 02:00 AM", status: "Success", size: "1.38 GB" },
];

export default function MaintenancePage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">

            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F] flex items-center gap-3">
                        <Database className="text-[#4A6FA5]" /> System Maintenance
                    </h1>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Perform routine operations to ensure reliability and secure operation of the application.
                    </p>
                </div>
            </header>

            {/* System Status Banner */}
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-4">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-emerald-800">System is Healthy</h3>
                    <p className="text-sm text-emerald-700">All services are operational. Last backup was performed 18 hours ago.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Actions */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="rounded-xl border border-[#DCE3ED] bg-white p-5 shadow-sm text-center">
                        <div className="mx-auto w-fit p-3 bg-[#4A6FA5]/10 rounded-full text-[#4A6FA5] mb-3">
                            <HardDrive size={28} />
                        </div>
                        <h3 className="font-bold text-[#1F3A5F] mb-1">Create Backup</h3>
                        <p className="text-sm text-[#5A6C7D] mb-4">Instantly backup the entire database and static assets.</p>
                        <button className="w-full justify-center inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A4A75] cursor-pointer">
                            Start Backup
                        </button>
                    </div>

                    <div className="rounded-xl border border-[#DCE3ED] bg-white p-5 shadow-sm text-center">
                        <div className="mx-auto w-fit p-3 bg-amber-100 rounded-full text-amber-600 mb-3">
                            <RefreshCw size={28} />
                        </div>
                        <h3 className="font-bold text-[#1F3A5F] mb-1">Data Cleanup</h3>
                        <p className="text-sm text-[#5A6C7D] mb-4">Remove redundant logs and orphan records older than 90 days.</p>
                        <button className="w-full justify-center inline-flex items-center gap-2 rounded-md border border-amber-600 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 transition cursor-pointer">
                            Run Cleanup
                        </button>
                    </div>
                </div>

                {/* Logs */}
                <div className="col-span-1 lg:col-span-2 rounded-xl border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[#DCE3ED] bg-[#F8FAFC]">
                        <h2 className="font-semibold text-[#1F3A5F]">Recent Maintenance Logs</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-[#5A6C7D] border-b border-[#DCE3ED]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Log ID</th>
                                    <th className="px-5 py-3 font-semibold">Operation</th>
                                    <th className="px-5 py-3 font-semibold">Date & Time</th>
                                    <th className="px-5 py-3 font-semibold">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DCE3ED]">
                                {maintenanceLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#F4F7FB]/50 transition-colors">
                                        <td className="px-5 py-3 text-[#5A6C7D] font-mono text-xs">{log.id}</td>
                                        <td className="px-5 py-3 font-medium text-[#1F3A5F]">{log.type}</td>
                                        <td className="px-5 py-3 text-[#5A6C7D]">{log.date}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${log.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {log.status === "Success" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                                {log.status}
                                            </span>
                                            <div className="text-xs text-[#5A6C7D] mt-1 ml-1">{log.size} {log.note && `• ${log.note}`}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
