"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { PlaylistContainer } from "@/components/playlist/PlaylistContainer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [dividerPos, setDividerPos] = useState(60);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    }

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById("main-content");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      setDividerPos(Math.max(20, Math.min(80, newPos)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-darkbg-primary">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-darkbg-primary dark:to-slate-950 p-2 md:p-4 gap-4">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-darkbg-secondary rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Header />
      </div>

      {/* Guest Welcome Banner */}
      {!user && (
        <div className="bg-brand/10 border border-brand/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="max-w-md">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Welcome, Guest!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your playlist is temporary and will expire after 48 hours of inactivity.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-all shadow-sm active:scale-95"
          >
            Save Permanently
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <div id="main-content" className="flex-1 overflow-hidden relative flex flex-row">
        {/* Video Player Panel */}
        <div style={{ width: `${dividerPos}%` }} className="h-full w-full bg-white dark:bg-darkbg-secondary rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-75">
          <VideoPlayer
            video={activeVideo}
            onVideoChange={(v) => setActiveVideo(v)}
          />
        </div>

        {/* Horizontal Resize Handle */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className="w-2 bg-transparent hover:bg-brand/20 transition-all duration-200 cursor-col-resize group flex items-center justify-center"
        >
          <div className="h-12 w-1 bg-slate-300 dark:bg-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
        </div>

        {/* Playlist Panel */}
        <div style={{ width: `${100 - dividerPos}%` }} className="h-full w-full bg-white dark:bg-darkbg-secondary rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-75">
          <PlaylistContainer
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        </div>
      </div>
    </div>
  );
}
