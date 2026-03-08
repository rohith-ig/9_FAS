import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />
      <main className="pt-8 pb-16">{children}</main>
    </div>
  );
}