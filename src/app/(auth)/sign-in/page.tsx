"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;
type FieldErrors = Partial<Record<keyof SignInForm, string>>;

export default function SignInPage() {
  const router = useRouter();
  const [justVerified, setJustVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJustVerified(params.get("verified") === "true");
  }, []);
  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const result = signInSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignInForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (error) {
        if (error.code === "EMAIL_NOT_VERIFIED") {
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}&resend=true`);
          return;
        }
        setServerError(error.message ?? "Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          <p className="text-muted-foreground text-sm mt-1">Welcome back</p>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          {justVerified && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
              ✅ Email verified! You can now sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full h-9 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition ${
                  errors.email ? "border-red-500" : "border-input"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-400 hover:text-amber-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                className={`w-full h-9 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition ${
                  errors.password ? "border-red-500" : "border-input"
                }`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-medium transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
