"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (!token) {
      setErrorMsg("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setErrorMsg(error.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push("/sign-in"), 2500);
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
          <p className="text-muted-foreground text-sm mt-1">Set a new password</p>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          {status === "success" ? (
            <>
              <div className="text-5xl mb-4 text-center">✅</div>
              <h1 className="text-xl font-bold text-slate-900 mb-2 text-center">
                Password reset!
              </h1>
              <p className="text-muted-foreground text-sm text-center">
                Your password has been updated. Redirecting to sign in…
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-slate-900 mb-2">
                Set new password
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your new password below.
              </p>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Resetting…" : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
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