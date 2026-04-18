"use client";

import { useState } from "react";
import api from "../../../axios";
import { Database, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import BackArrowButton from "@/components/BackArrowButton";

export default function SystemBackup() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleBackup = async () => {
    setLoading(true);
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await api.post("/backup/generate", {}, {
        responseType: "blob" // Important for downloading files!
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "database_backup.json");
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setStatus("success");
    } catch (error) {
      console.error("Backup error:", error);
      setStatus("error");
      // Handle blob response error message if it is returned as JSON buffer inside the blob
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const jsonError = JSON.parse(text);
          setErrorMsg(jsonError.details ? `${jsonError.error}: ${jsonError.details}` : (jsonError.error || "Failed to generate backup."));
        } catch (e) {
          setErrorMsg("An unexpected error occurred while generating the backup.");
        }
      } else {
         setErrorMsg(error.response?.data?.error || "An unexpected error occurred while generating the backup.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 md:px-6 py-8 animate-fadeIn">
      <section className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <BackArrowButton />
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A5F]">System Backup</h1>
            <p className="text-sm text-[#5A6C7D]">Manage and generate database backups</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#DCE3ED] bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-[#4A6FA5]/10 p-6">
              <Database className="h-12 w-12 text-[#4A6FA5]" />
            </div>
            
            <h2 className="mb-2 text-xl font-semibold text-[#1F3A5F]">Generate System Backup</h2>
            <p className="mb-8 max-w-md text-sm text-[#5A6C7D]">
              Click the button below to generate a complete backup of the database in JSON format. This will include all users, tickets, appointments, timetables, and notifications.
            </p>

            <button
              onClick={handleBackup}
              disabled={loading}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-white transition-all duration-200 ${
                loading 
                  ? "cursor-not-allowed bg-[#4A6FA5]/70" 
                  : "bg-[#1F3A5F] hover:bg-[#2A4A75] hover:shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Backup...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download Backup File
                </>
              )}
            </button>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mt-6 flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Backup generated and downloaded successfully!</span>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
