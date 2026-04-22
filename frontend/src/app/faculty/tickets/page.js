"use client";

import { useEffect, useState } from "react"; 
import Link from "next/link";
import api from "../../../axios.js";
 
export default function FacultyTickets() { 
  const [view, setView] = useState("open");
  const [tickets, setTickets] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get('/tickets/my-tickets');
        setTickets(res.data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };
    
    fetchMyTickets();
  }, []);

  const openTickets = tickets.filter(ticket => ticket.ticketStatus === "OPEN");
  const closedTickets = tickets.filter(ticket => ticket.ticketStatus === "RESOLVED");

  const currentTickets = view === "open" ? openTickets : closedTickets;

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-inter p-6 md:p-10 animate-fadeIn">

      <div className="max-w-6xl mx-auto">

        {/* Page Heading + Button */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#1F3A5F]">
            Support Tickets
          </h1>

          <Link
            href="/faculty/tickets/raise"
            className="px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-sm font-medium hover:bg-[#2A4A75] transition"
          >
            Raise Ticket
          </Link>
        </div>

        {/* Ticket Count */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
          <p className="text-lg text-gray-700">
            Total Tickets:{" "}
            <span className="font-semibold">
              {openTickets.length + closedTickets.length}
            </span>
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView("open")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              view === "open"
                ? "bg-[#1F3A5F] text-white"
                : "bg-white border border-[#E0E0E0]"
            }`}
          >
            Open Tickets
          </button>

          <button
            onClick={() => setView("closed")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              view === "closed"
                ? "bg-[#1F3A5F] text-white"
                : "bg-white border border-[#E0E0E0]"
            }`}
          >
            Closed Tickets
          </button>
        </div>

        {/* Ticket Table */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-6 bg-gray-50 text-sm font-medium text-gray-600 p-4">
            <div>Ticket Number</div>
            <div>Date Created</div>
            <div>Client</div>
            <div>Status</div>
            <div>Topic</div>
            <div></div> {/* Arrow column */}
          </div>

          {/* Ticket Rows */}
          {currentTickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No tickets found.
            </div>
          ) : (
            currentTickets.map((ticket) => (
              <div key={ticket.id} className="border-t border-[#E0E0E0]">
                {/* Row */}
                <div className="grid grid-cols-6 p-4 text-sm items-center">
                  {/* Ticket ID */}
                  <div className="font-medium text-[#1F3A5F]">
                    {ticket.id}
                  </div>

                  {/* Date */}
                  <div>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>

                  {/* Client */}
                  <div className="text-xs text-gray-600">
                    <p className="font-medium text-[#1F3A5F]">{ticket.user?.name}</p>
                    <p>{ticket.user?.email}</p>
                  </div>

                  {/* Status */}
                  <div className="text-[#1F3A5F]">
                    {ticket.ticketStatus === "OPEN" ? "Open" : "Resolved"}
                  </div>

                  {/* Topic */}
                  <div>{ticket.topic}</div>

                  {/* Arrow */}
                  <div className="text-right">
                    <button
                      onClick={() =>
                        setOpenId(openId === ticket.id ? null : ticket.id)
                      }
                      className="text-[#1F3A5F] text-lg"
                    >
                      {openId === ticket.id ? "▲" : "▼"}
                    </button>
                  </div>
                </div>

                {/* Expanded Description */}
                {openId === ticket.id && (
                  <div className="px-6 pb-5 pt-3 bg-[#F7F9FC] border-t border-[#E0E0E0]">
                    <p className="text-xs font-semibold text-[#2A4A75] mb-1">
                      Description
                    </p>
                    <p className="text-sm text-[#4A6FA5] leading-relaxed break-all">
                      {ticket.description || "No description provided."}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}