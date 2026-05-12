"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;
type FieldErrors = Partial<Record<keyof SignUpForm, string>>;

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignUpForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: "/verify-email",
      });

      if (error) {
        setServerError(error.message ?? "Sign up failed. Please try again.");
        return;
      }

      router.push("/verify-email?sent=true");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-black tracking-tighter text-white">
              Movie<span className="text-amber-400">Shop</span>
            </span>
          </Link>
          <p className="text-zinc-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-800 border text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${
                  errors.name ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-800 border text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${
                  errors.email ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-800 border text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${
                  errors.password ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-800 border text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${
                  errors.confirmPassword ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-amber-400 hover:text-amber-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}