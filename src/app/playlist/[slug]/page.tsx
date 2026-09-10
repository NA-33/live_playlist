import { PublicPlaylist } from "@/components/playlist/PublicPlaylist";

export default async function PlaylistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-darkbg-primary dark:to-slate-950 p-2 md:p-4 gap-4">
      {/* Top Header Bar - Simplified for public view */}
      <div className="bg-white dark:bg-darkbg-secondary rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">
              LP
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              LivePlaylist
            </span>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>

      {/* Playlist Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full bg-white dark:bg-darkbg-secondary rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <PublicPlaylist slug={slug} />
        </div>
      </div>
    </div>
  );
}
