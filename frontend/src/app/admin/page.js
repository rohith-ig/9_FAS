import Link from "next/link";
import {
  Users,
  LifeBuoy,
  CalendarClock,
  Database,
  UserPlus,
} from "lucide-react";
import BackArrowButton from "@/components/BackArrowButton";

const features = [
  {
    title: "Manage User Accounts",
    desc: "Create, update, or remove Student and Faculty accounts with role control.",
    icon: Users,
    action: "Manage",
    href: "/admin/users"
  },
  {
    title: "Support Tickets",
    desc: "Review, prioritize, and resolve issues raised by users.",
    icon: LifeBuoy,
    action: "View Tickets",
    href: "/admin/tickets",
  },
  {
    title: "Faculty Timetable",
    desc: "Assign courses, time slots, and rooms without conflicts.",
    icon: CalendarClock,
    action: "Set Timetable",
    href: "/admin/timetableset",
  },
  {
    title: "System Maintenance",
    desc: "Perform backups to ensure system reliability.",
    icon: Database,
    action: "Run Backup",
    href: "/admin/backup",
  },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 md:px-6 py-8 animate-fadeIn">
      {/* min-h-screen bg-[#F7F9FC] px-4 md:px-6 py-8 animate-fadeIn */}
      <section className="mx-auto w-full max-w-6xl">


        {/* Feature Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm"
            >
              <f.icon className="mb-3 h-6 w-6 text-[#2A4A75]" />
              <h2 className="mb-1 text-base font-semibold text-[#1F3A5F]">
                {f.title}
              </h2>
              <p className="mb-4 text-sm text-[#5A6C7D]">{f.desc}</p>

              {f.href ? (
                <Link
                  href={f.href}
                  className="inline-block rounded-md border border-[#4A6FA5] px-4 py-2 text-sm text-[#4A6FA5] transition hover:bg-[#4A6FA5]/10 cursor-pointer"
                >
                  {f.action}
                </Link>
              ) : (
                <button className="rounded-md border border-[#4A6FA5] px-4 py-2 text-sm text-[#4A6FA5] transition hover:bg-[#4A6FA5]/10 cursor-pointer">
                  {f.action}
                </button>
              )}
            </article>
          ))}
        </section>


      </section>
    </main>
  );
}
