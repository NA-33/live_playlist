"use client";

import * as React from "react";
import { PlaylistItem } from "./PlaylistItem";
import { cn } from "@/lib/utils";
import { Plus, Link as LinkIcon, Copy, Check } from "lucide-react";

const INITIAL_PLAYLIST = [
  { id: "1", title: "Introduction to Live Streaming", duration: "10:05", thumbnail: "https://picsum.photos/seed/1/200/120", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "2", title: "Mastering Next.js 14 App Router", duration: "25:40", thumbnail: "https://picsum.photos/seed/2/200/120", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "3", title: "Tailwind CSS v4 Deep Dive", duration: "15:20", thumbnail: "https://picsum.photos/seed/3/200/120", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "4", title: "TypeScript Advanced Patterns", duration: "42:10", thumbnail: "https://picsum.photos/seed/4/200/120", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "5", title: "Building Professional UIs", duration: "30:00", thumbnail: "https://picsum.photos/seed/5/200/120", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
];

interface PlaylistContainerProps {
  activeVideo: { url: string; title: string } | null;
  setActiveVideo: (video: { url: string; title: string } | null) => void;
}

export function PlaylistContainer({ activeVideo, setActiveVideo }: PlaylistContainerProps) {
  const [playlist, setPlaylist] = React.useState(INITIAL_PLAYLIST);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [generatedLink, setGeneratedLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    try {
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(videoUrl)}`);
      const metadata = await response.json();

      const newVideo = {
        id: Math.random().toString(36).substr(2, 9),
        title: metadata.title || `Video from ${videoUrl.substring(0, 20)}...`,
        duration: metadata.duration || "Unknown",
        thumbnail: metadata.thumbnail || `https://picsum.photos/seed/${Math.random()}/200/120`,
        url: videoUrl,
      };

      setPlaylist([...playlist, newVideo]);
    } catch (error) {
      console.error("Failed to fetch metadata, adding with defaults", error);
      const newVideo = {
        id: Math.random().toString(36).substr(2, 9),
        title: videoUrl,
        duration: "Unknown",
        thumbnail: `https://picsum.photos/seed/${Math.random()}/200/120`,
        url: videoUrl,
      };
      setPlaylist([...playlist, newVideo]);
    }
    setVideoUrl("");
  };

  const removeVideo = (id: string) => {
    const filtered = playlist.filter(v => v.id !== id);
    setPlaylist(filtered);

    if (activeVideo && playlist.find(v => v.id === id)?.url === activeVideo.url) {
      setActiveVideo(filtered[0] ? { url: filtered[0].url, title: filtered[0].title } : null);
    }
  };

  const moveVideo = (index: number, direction: "up" | "down") => {
    const newPlaylist = [...playlist];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPlaylist.length) return;

    [newPlaylist[index], newPlaylist[targetIndex]] = [newPlaylist[targetIndex], newPlaylist[index]];
    setPlaylist(newPlaylist);
  };

  const generatePlaylistLink = () => {
    const ids = playlist.map(v => v.id).join(",");
    const link = `${window.location.origin}/playlist?ids=${ids}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-darkbg-secondary border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-darkbg-secondary/50">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Up Next</h3>
        <span className="text-xs text-slate-500">{playlist.length} Videos</span>
      </div>

      {/* Add Video Section */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-darkbg-secondary/30">
        <form onSubmit={addVideo} className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste video link..."
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-darkbg-primary/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand/50 shadow-inner transition-all"
          />
          <button
            type="submit"
            className="p-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all active:scale-95 shadow-[0_2px_0_0_var(--color-brand-dark)] dark:shadow-[0_2px_0_0_var(--color-brand-darkest)]"
            title="Add Video"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {playlist.map((video, index) => (
          <PlaylistItem
            key={video.id}
            {...video}
            isActive={activeVideo?.url === video.url}
            onClick={() => setActiveVideo({ url: video.url, title: video.title })}
            onRemove={() => removeVideo(video.id)}
            onMoveUp={() => moveVideo(index, "up")}
            onMoveDown={() => moveVideo(index, "down")}
          />
        ))}
        {playlist.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            Playlist is empty. Add some videos!
          </div>
        )}
      </div>

      {/* Share Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-darkbg-secondary/30">
        {!generatedLink ? (
          <button
            onClick={generatePlaylistLink}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <LinkIcon className="w-4 h-4" />
            Generate Playlist Link
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-darkbg-primary border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-inner">
              <span className="flex-1 text-xs text-slate-500 truncate">{generatedLink}</span>
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-500 hover:text-brand transition-colors"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={() => setGeneratedLink("")}
              className="text-xs text-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Reset Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
