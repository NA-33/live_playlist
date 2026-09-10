import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Privacy Policy
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the site includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Personal Data: Email address, password, and authentication information</li>
              <li>Usage Data: How you interact with our service, including playlists and preferences</li>
              <li>Device Data: Device type, browser type, IP address, and other technical information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Use of Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Create and manage your account</li>
              <li>Provide, operate, and maintain our service</li>
              <li>Improve, personalize, and expand our service</li>
              <li>Understand and analyze how you use our service</li>
              <li>Communicate with you, including responding to your inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Disclosure of Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates for the purposes outlined above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Security of Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We use administrative, technical, and physical security measures to protect your personal information. However, despite our efforts, no security measures are completely secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at privacy@example.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting to the website.
            </p>
          </section>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
