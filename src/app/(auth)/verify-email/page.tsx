"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "sending" | "sent" | "error" | "verified";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const justSent = searchParams.get("sent") === "true";
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<Status>(justSent ? "sent" : "idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function verify() {
      setStatus("sending");
      try {
        const { error } = await authClient.verifyEmail({
          query: { token: token! },
        });
        if (error) {
          setErrorMsg(error.message ?? "Verification failed.");
          setStatus("error");
        } else {
          setStatus("verified");
          setTimeout(() => router.push("/"), 2500);
        }
      } catch {
        setErrorMsg("Something went wrong during verification.");
        setStatus("error");
      }
    }

    verify();
  }, [token, router]);

  async function handleResend() {
    if (!email) return;
    setStatus("sending");
    setErrorMsg(null);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/verify-email",
      });

      if (error) {
        setErrorMsg(error.message ?? "Could not resend. Please try again.");
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="text-3xl font-black tracking-tighter text-slate-900">
            Movie<span className="text-indigo-600">Shop</span>
          </span>
        </Link>

        <div className="bg-white border rounded-xl p-8 shadow-sm">

          {status === "verified" && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Email Verified!
              </h1>
              <p className="text-muted-foreground text-sm">
                Your account is confirmed. Redirecting you to home\u2026
              </p>
            </>
          )}

          {status === "sending" && token && (
            <>
              <div className="text-5xl mb-4">⏳</div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Verifying\u2026
              </h1>
              <p className="text-muted-foreground text-sm">
                Please wait while we confirm your email.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-5xl mb-4">⚠️</div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-red-600 text-sm mb-6">{errorMsg}</p>
              {email && (
                <ResendSection
                  email={email}
                  setEmail={setEmail}
                  onResend={handleResend}
                  loading={false}
                />
              )}
            </>
          )}

          {(status === "idle" || status === "sent" ||
            (status === "sending" && !token)) && (
            <>
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 7.19L2.25 6.75"
                  />
                </svg>
              </div>

              <h1 className="text-xl font-bold text-foreground mb-2">
                Check your inbox
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                {status === "sent"
                  ? "A new verification email has been sent."
                  : "We sent a verification link to your email. Click it to activate your account."}
                {email && (
                  <span className="block mt-1 text-foreground font-medium">
                    {email}
                  </span>
                )}
              </p>

              <ResendSection
                email={email}
                setEmail={setEmail}
                onResend={handleResend}
                loading={status === "sending"}
              />
            </>
          )}

          <div className="mt-6 pt-5 border-t">
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-indigo-600 transition"
            >
              \u2190 Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResendSection({
  email,
  setEmail,
  onResend,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  onResend: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Didn&apos;t receive it? Enter your email and resend.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
      />
      <button
        onClick={onResend}
        disabled={loading || !email}
        className="w-full h-9 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending\u2026" : "Resend verification email"}
      </button>
    </div>
  );
}
