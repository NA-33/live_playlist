"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { PlaylistItem } from "./PlaylistItem";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, Copy, Check, Share2 } from "lucide-react";

interface PublicPlaylistProps {
  slug: string;
}

export function PublicPlaylist({ slug }: PublicPlaylistProps) {
  const [playlist, setPlaylist] = React.useState<{ id: string; title: string } | null>(null);
  const [tracks, setTracks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    async function loadPlaylist() {
      try {
        // 1. Fetch Playlist Metadata
        const { data: playlistData, error: playlistError } = await supabase
          .from("playlists")
          .select("*")
          .eq("slug", slug)
          .single();

        if (playlistError || !playlistData) {
          throw new Error(playlistError?.message || "Playlist not found");
        }

        setPlaylist(playlistData);

        // 2. Fetch Initial Tracks
        const { data: tracksData, error: tracksError } = await supabase
          .from("tracks")
          .select("*")
          .eq("playlist_id", playlistData.id)
          .order("position", { ascending: true });

        if (tracksError) throw tracksError;
        setTracks(tracksData || []);

        // 3. Setup Real-time Subscription
        const channel = supabase
          .channel(`playlist-${playlistData.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tracks",
              filter: `playlist_id=eq.${playlistData.id}`,
            },
            (payload: any) => {
              console.log("Realtime update received:", payload);
              // Refetch tracks to ensure correct order and consistency
              refetchTracks(playlistData.id);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    async function refetchTracks(playlistId: string) {
      const { data: tracksData } = await supabase
        .from("tracks")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: true });
      if (tracksData) setTracks(tracksData);
    }

    const cleanup = loadPlaylist();
    return () => {
      cleanup.then((unsub) => {
        if (unsub) unsub();
      });
    };
  }, [slug]);

  const copyShareLink = async () => {
    const url = `${window.location.origin}/playlist/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Playlist Not Found</h3>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-darkbg-primary border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-darkbg-secondary/50">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{playlist?.title}</h3>
          <p className="text-xs text-slate-500">{tracks.length} tracks</p>
        </div>
        <button
          onClick={copyShareLink}
          className="flex items-center gap-2 py-2 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {tracks.map((track) => (
          <PlaylistItem
            key={track.id}
            id={track.id}
            title={track.url} // In a real app, we'd fetch the actual title
            duration="Unknown"
            thumbnail="https://picsum.photos/seed/playlist/200/120"
            isActive={false}
            onClick={() => {}}
            onRemove={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
          />
        ))}
        {tracks.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            This playlist is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}
