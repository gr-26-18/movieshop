"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrorMsg(error.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              Movie<span className="text-indigo-600">Shop</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-1">Reset your password</p>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          {status === "sent" ? (
            <>
              <div className="text-5xl mb-4 text-center">📧</div>
              <h1 className="text-xl font-bold text-white mb-2 text-center">
                Check your inbox
              </h1>
              <p className="text-zinc-400 text-sm text-center">
                We sent a password reset link to{" "}
                <span className="text-zinc-300 font-medium">{email}</span>.
                Click it to reset your password.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white mb-2">
                Forgot your password?
              </h1>
              <p className="text-zinc-400 text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-300 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-zinc-500 mt-6">
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-700 transition"
            >
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}