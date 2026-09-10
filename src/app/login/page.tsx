"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  React.useEffect(() => {
    async function checkExistingSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
      setLoading(false);
    }
    checkExistingSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // For sign up, require terms acceptance
    if (isSignUp && !acceptedTerms) {
      setError("You must accept the Terms and Conditions to sign up");
      setLoading(false);
      return;
    }

    try {
      let userId: string;

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        userId = data.user?.id;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        userId = data.user?.id;
      }

      // If sign up, send terms acceptance to backend
      if (isSignUp && userId) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;

          const response = await fetch('/api/auth/accept-terms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!response.ok) {
            throw new Error('Failed to record terms acceptance');
          }
        } catch (err: any) {
          console.error('Terms acceptance error:', err);
          // Don't fail the sign up, but log the error
        }
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // For sign up with Google, require terms acceptance
    if (isSignUp && !acceptedTerms) {
      setError("You must accept the Terms and Conditions to sign up");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-darkbg-primary dark:to-slate-950 p-4">
      {loading ? (
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-darkbg-secondary rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isSignUp
                  ? "Join us and start organizing your videos"
                  : "Please enter your details to sign in"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-darkbg-primary/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 shadow-inner transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-darkbg-primary/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 shadow-inner transition-all"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 cursor-pointer accent-brand"
                  />
                  <label htmlFor="accept-terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline font-medium"
                    >
                      Terms and Conditions
                    </a>
                    {" "}and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (isSignUp && !acceptedTerms)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand text-white rounded-xl font-medium transition-all duration-200 hover:bg-brand-dark active:scale-[0.98] active:translate-y-[2px] shadow-[0_4px_0_0_rgba(0,140,125,1)] dark:shadow-[0_4px_0_0_rgba(0,166,147,1)] active:shadow-none disabled:opacity-70",
                  loading && "cursor-not-allowed"
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
              <div className="relative flex justify-center px-3">
                <span className="text-xs uppercase tracking-widest text-slate-400 bg-white dark:bg-darkbg-secondary px-2 font-medium">Or continue with</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:translate-y-[1px] active:shadow-sm disabled:opacity-70"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09C5.71 13.38 5.62 12.65 5.62 12s.11-.67.24-1.09V7.02H2.18C1.46 8.13 1 9.42 1 10.75c0 1.33.46 2.62 1.18 3.73l3.66-2.64z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.18l3.66 2.64c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Footer Toggle */}
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-brand font-semibold hover:underline transition-all"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
