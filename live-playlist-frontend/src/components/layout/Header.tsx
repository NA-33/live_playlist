"use client";

import * as React from "react";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  user?: any;
}

export function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-darkbg-secondary/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
            LP
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            LivePlaylist
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 ml-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand transition-colors"
          >
            Home
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-darkbg-secondary text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200 group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-brand-muted hover:text-brand transition-all duration-200 group"
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Login</span>
          </Link>
        )}

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
