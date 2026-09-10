import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-darkbg-primary p-8 md:p-24">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Terms of Service</h1>

        <section className="space-y-6 text-slate-600 dark:text-slate-400">
          <div className="p-6 bg-slate-50 dark:bg-darkbg-secondary rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nature of Service</h2>
            <p>
              LivePlaylist is an embed-link aggregator. We do not host, store, or stream media files on our own servers.
              All content is served via the original platforms (YouTube, SoundCloud, etc.) through their official embed APIs.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Liability</h2>
            <p>
              Users hold sole liability for the URLs they add to their playlists. By using this service,
              you agree not to add links to content that violates the terms of the hosting platform
              or any applicable laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">DMCA & Takedowns</h2>
            <p>
              If you are a copyright holder and believe a link on our platform violates your rights,
              please contact us at support@liveplaylist.com with a valid DMCA notice.
              We will promptly remove offending links upon verification.
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
