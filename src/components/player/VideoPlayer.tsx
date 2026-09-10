"use client";

import * as React from "react";
import { Play, Volume2, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: { url: string; title: string } | null;
  onVideoChange?: (video: { url: string; title: string }) => void;
}

const VideoPlayerComponent = ({ video }: VideoPlayerProps) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("instagram.com/")) {
      const parts = url.split("/");
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      return `https://www.instagram.com/p/${id}/embed`;
    }
    if (url.includes("tiktok.com/")) {
      const parts = url.split("/");
      const id = parts[parts.length - 1].split("?")[0];
      return `https://www.tiktok.com/embed/v2/${id}`;
    }
    if (url.includes("soundcloud.com/")) {
      // SoundCloud embeds are usually handled via their own widget,
      // but we can try a simple iframe for basic playback.
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
    }
    return null;
  };

  const embedUrl = video ? getEmbedUrl(video.url) : null;

  return (
    <div className="relative w-full h-full bg-black group overflow-hidden flex items-center justify-center">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_30px_rgba(0,166,147,0.3)]">
              <Play className="w-10 h-10 text-brand fill-brand" />
            </div>
            <h3 className="text-white font-medium text-xl mb-2">
              {video ? "Unsupported Video Format" : "Live Stream Ready"}
            </h3>
            <p className="text-slate-400 text-sm">
              {video
                ? "This platform is not currently supported for embedded playback."
                : "Select a video from the playlist to start watching."}
            </p>
          </div>
        </div>
      )}

      {/* Professional Controls Overlay - Only show if not using iframe or as a wrapper */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group/vol">
              <Volume2 className="w-6 h-6" />
              <div className="w-0 group-hover/vol:w-24 transition-all duration-300 overflow-hidden">
                <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-brand" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-brand transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <button className="hover:text-brand transition-colors">
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoPlayer = React.memo(VideoPlayerComponent);
