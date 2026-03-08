import Navbar from "@/components/Navbar";

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F7F9FC]">
            <Navbar portalType="student" />
            <main className="pt-8 pb-16">{children}</main>
        </div>
    );
}
