"use client";
import RaiseTicketForm from "@/components/RaiseTicketForm";
import { useState, useEffect } from "react";
import api from "../../../../axios";
import { Loader2 } from "lucide-react";

export default function FacultyRaiseTicketPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/get');
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center gap-3 text-[#5A6C7D]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] flex justify-center px-6 py-12 animate-fadeIn">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1F3A5F]">
            Raise Support Ticket
          </h1>
        </div>

        {/* Faculty Info */}
        <div className="border border-[#E0E0E0] rounded-lg bg-white p-6 mb-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#2A4A75] mb-1">
                Client (Faculty)
              </label>
              <input
                type="text"
                value={user?.name || "Loading..."}
                readOnly
                className="w-full rounded-md border border-[#E0E0E0] bg-[#F7F9FC] px-3 py-2 text-sm text-[#1F3A5F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2A4A75] mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || "Loading..."}
                readOnly
                className="w-full rounded-md border border-[#E0E0E0] bg-[#F7F9FC] px-3 py-2 text-sm text-[#1F3A5F]"
              />
            </div>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="border border-[#E0E0E0] rounded-lg bg-white p-6 shadow-sm">
          <RaiseTicketForm role="Faculty" />
        </div>

      </div>
    </main>
  );
}
