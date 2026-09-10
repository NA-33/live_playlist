"use client";

import * as React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-primary transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-slate-500 dark:text-slate-400 text-xs">
          © {new Date().getFullYear()} LivePlaylist. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/legal"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-darkbg-secondary hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand dark:hover:text-brand transition-all"
          >
            Legal
          </Link>
          <Link
            href="/terms"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-darkbg-secondary hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand dark:hover:text-brand transition-all"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-darkbg-secondary hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand dark:hover:text-brand transition-all"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
