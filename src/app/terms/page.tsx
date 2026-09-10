import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms and Conditions
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on this service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the service</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The materials on this service are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Limitations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this service, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The materials appearing on this service could include technical, typographical, or photographic errors. We do not warrant that any of the materials on this service are accurate, complete, or current. We may make changes to the materials contained on this service at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Links
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Modifications
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We may revise these terms of service for this service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Governing Law
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
