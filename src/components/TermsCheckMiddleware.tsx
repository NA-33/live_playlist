"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function TermsCheckMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showTermsPrompt, setShowTermsPrompt] = useState(false);

  useEffect(() => {
    async function checkTermsAcceptance() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          setIsChecking(false);
          return;
        }

        // Check if user has accepted terms
        const response = await fetch(`/api/auth/check-terms/${session.user.id}`);
        
        if (!response.ok) {
          console.warn("Failed to check terms status");
          setIsChecking(false);
          return;
        }

        const data = await response.json();
        
        if (!data.accepted) {
          setTermsAccepted(false);
          setShowTermsPrompt(true);
        } else {
          setTermsAccepted(true);
        }
      } catch (err) {
        console.error("Error checking terms:", err);
      } finally {
        setIsChecking(false);
      }
    }

    checkTermsAcceptance();
  }, []);

  const handleAcceptTerms = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        return;
      }

      const token = session.access_token;
      const response = await fetch("/api/auth/accept-terms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: session.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept terms");
      }

      setTermsAccepted(true);
      setShowTermsPrompt(false);
    } catch (err) {
      console.error("Error accepting terms:", err);
      alert("Failed to accept terms. Please try again.");
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showTermsPrompt && !termsAccepted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md mx-4 p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Accept Terms & Conditions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            To continue using our service, you must accept our Terms and Conditions and Privacy Policy.
          </p>
          
          <div className="space-y-3 mb-6">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-brand hover:underline text-sm font-medium"
            >
              Read Terms and Conditions →
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-brand hover:underline text-sm font-medium"
            >
              Read Privacy Policy →
            </a>
          </div>

          <button
            onClick={handleAcceptTerms}
            className="w-full bg-brand text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-dark transition-colors"
          >
            Accept & Continue
          </button>
          
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full mt-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
