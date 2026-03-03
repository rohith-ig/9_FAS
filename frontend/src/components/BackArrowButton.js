"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackArrowButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#C7D4E3] bg-white/95 px-3.5 text-sm font-medium text-[#1F3A5F] shadow-sm transition hover:-translate-y-0.5 hover:border-[#9FB5CE] hover:bg-[#F4F7FB] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAAC7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F9FC]"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>Back</span>
    </button>
  );
}
