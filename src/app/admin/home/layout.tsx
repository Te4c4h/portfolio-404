"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHomeSidebar from "@/components/AdminHomeSidebar";

export default function AdminHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!session.user.isAdmin) {
      router.replace(`/u/${session.user.username}/admin`);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="text-[#888] text-sm">Loading...</div>
      </div>
    );
  }

  if (!session || !session.user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#131313] text-[#fafafa]">
      <style>{`
        html, body {
          background-color: #131313 !important;
          color: #fafafa !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `}</style>
      <AdminHomeSidebar username={session.user.username} />
      <main className="lg:ml-60 min-h-screen p-6 pt-16 lg:pt-6">
        {children}
      </main>
    </div>
  );
}
