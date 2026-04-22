"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import api from "../axios";

export default function RaiseTicketForm({ role }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets/create-ticket', {
        topic: title,
        description: description,
      });
      alert("Ticket created!");
      const targetDashboard = role?.toLowerCase() === "student" ? "student" : "faculty";
      router.push(`/${targetDashboard}/tickets`);
    } catch (error) {
      console.error("Failed to create ticket:", error);
      alert("Failed to create ticket.");
    }
  };

const router = useRouter();


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#1F3A5F]">
          Issue Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
          className="mt-1 w-full rounded-md border border-[#E0E0E0] px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#1F3A5F]">
          Description
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the issue in detail"
          className="mt-1 w-full rounded-md border border-[#E0E0E0] px-3 py-2 text-sm"
        />
      </div>


      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-[#1F3A5F] px-4 py-2 text-sm text-white hover:bg-[#2A4A75] cursor-pointer"
        >
          Submit Ticket
        </button>

        <button
          type="reset"
          className="rounded-md border border-[#E0E0E0] px-4 py-2 text-sm cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
