"use client";

import * as React from "react";
import { PlayCircle, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistItemProps {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function PlaylistItem({ id, title, duration, thumbnail, isActive, onClick, onRemove, onMoveUp, onMoveDown }: PlaylistItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
        "border-l-4",
        isActive
          ? "bg-brand-muted border-brand text-brand shadow-sm ring-1 ring-brand/20"
          : "bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-darkbg-secondary hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-sm"
      )}
    >
      <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <PlayCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm font-medium truncate transition-colors",
          isActive ? "text-brand" : "text-slate-700 dark:text-slate-300"
        )}>
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-500">{duration}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
