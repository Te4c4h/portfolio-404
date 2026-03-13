"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiExternalLink } from "react-icons/fi";

interface Stats {
  sectionsCount: number;
  contentCount: number;
  lastUpdated: string | null;
  contentPerSection: { name: string; count: number }[];
}

export default function UserAdminPage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const loadPublishStatus = useCallback(async () => {
    const r = await fetch("/api/user/publish");
    if (r.ok) {
      const data = await r.json();
      setIsPublished(data.isPublished);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) loadPublishStatus();
  }, [isAdmin, loadPublishStatus]);

  const togglePublish = async () => {
    setPublishing(true);
    const r = await fetch("/api/user/publish", { method: "PUT" });
    if (r.ok) {
      const data = await r.json();
      setIsPublished(data.isPublished);
    }
    setPublishing(false);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-[#fafafa]">Dashboard</h1>
        <div className="flex items-center gap-2">
          {!isAdmin && isPublished !== null && (
            <button
              onClick={togglePublish}
              disabled={publishing}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                isPublished
                  ? "bg-[#2a2a2a] text-[#888] hover:text-[#FE454E] hover:bg-[#FE454E]/10"
                  : "bg-[#70E844] text-[#131313] hover:bg-[#5ed636]"
              }`}
            >
              {publishing ? "..." : isPublished ? "Unpublish" : "Publish"}
            </button>
          )}
          {!isAdmin && isPublished !== null && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? "bg-[#70E844]/15 text-[#70E844]"
                : "bg-[#888]/15 text-[#888]"
            }`}>
              {isPublished ? "Live" : "Draft"}
            </span>
          )}
          <a
            href={isAdmin ? "/" : `/u/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#70E844] text-[#131313] hover:bg-[#5ed636] transition-colors"
          >
            <FiExternalLink size={14} />
            {isAdmin ? "View Home Page" : "View Portfolio"}
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-[#888] text-xs uppercase tracking-wider mb-1">Total Sections</p>
          <p className="text-3xl font-bold text-[#70E844]">{stats?.sectionsCount ?? "—"}</p>
        </div>
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-[#888] text-xs uppercase tracking-wider mb-1">Total Content Items</p>
          <p className="text-3xl font-bold text-[#70E844]">{stats?.contentCount ?? "—"}</p>
        </div>
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-[#888] text-xs uppercase tracking-wider mb-1">Last Updated</p>
          <p className="text-lg font-semibold text-[#70E844]">
            {stats?.lastUpdated
              ? new Date(stats.lastUpdated).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* Content Per Section */}
      {stats && stats.contentPerSection.length > 0 && (
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-[#fafafa] mb-3 uppercase tracking-wider">Content Per Section</h2>
          <div className="space-y-2">
            {stats.contentPerSection.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-[#ccc]">{s.name}</span>
                <span className="text-[#70E844] font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
