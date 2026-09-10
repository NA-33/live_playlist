import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-darkbg-primary p-8 md:p-24">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Privacy Policy</h1>

        <section className="space-y-6 text-slate-600 dark:text-slate-400">
          <div className="p-6 bg-slate-50 dark:bg-darkbg-secondary rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-slate-900 dark:text-white">Guest Users:</strong> Data is held for 48 hours since the last activity. After this, playlists and tracks are automatically deleted.</li>
              <li><strong className="text-slate-900 dark:text-white">Registered Users:</strong> Data is kept indefinitely until the user requests account deletion.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Zero Data Sales</h2>
            <p>
              We believe in your privacy. LivePlaylist does NOT sell, rent, or trade any user data
              to third parties. Your playlists are for your use and those you choose to share with.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Third-Party Cookies</h2>
            <p>
              Because we embed media from YouTube, SoundCloud, etc., these third parties may set cookies
              on your device. Please refer to their respective privacy policies for more details.
            </p>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all shadow-md active:scale-95"
          >
            I Accept and Agree
          </Link>
        </div>
      </div>
    </div>
  );
}
