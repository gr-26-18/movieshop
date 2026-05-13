// Help & Support — FAQ + contact (dashboard scope).
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CopySupportEmailButton } from "./copy-support-email-button";

const SUPPORT_EMAIL = "support@movieshop.local";

const faqItems: { question: string; content: ReactNode }[] = [
  {
    question: "How do I view my purchased movies?",
    content: (
      <>
        <p>
          Open{" "}
          <Link href="/dashboard" className="text-primary font-medium underline-offset-4 hover:underline">
            Dashboard
          </Link>{" "}
          and scroll to{" "}
          <strong>Order History</strong>, or use{" "}
          <Link
            href="/dashboard?section=order-history"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            My Movies
          </Link>{" "}
          in the sidebar. Click <strong>View order</strong> on an order to see the movies you bought.
        </p>
      </>
    ),
  },
  {
    question: "Can I change my account information?",
    content: (
      <>
        <p>
          You sign in with{" "}
          <strong>Better Auth</strong> (email and password). Open{" "}
          <Link
            href="/dashboard/settings"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Settings
          </Link>{" "}
          to view your profile; editing name, email, and password in the UI is coming soon—the fields are read-only for now.
        </p>
      </>
    ),
  },
  {
    question: "How do I sign in or sign out?",
    content: (
      <>
        <p>
          Use{" "}
          <Link href="/sign-in" className="text-primary font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>{" "}
          from the header when you are logged out. When you are logged in, use your account button and{" "}
          <strong>Sign out</strong> in the header to end your session.
        </p>
      </>
    ),
  },
  {
    question: "Why is my order history empty?",
    content: (
      <>
        <p>
          Orders only appear after you complete a purchase. Browse movies on the{" "}
          <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
            store
          </Link>
          , add items to your{" "}
          <Link href="/cart" className="text-primary font-medium underline-offset-4 hover:underline">
            cart
          </Link>
          , and finish checkout. If you still see nothing, make sure you are signed in with the same account you used to buy.
        </p>
      </>
    ),
  },
  {
    question: "Who do I contact for technical issues?",
    content: (
      <>
        <p>
          Email{" "}
          <a className="text-primary font-medium underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          . Please include your browser, the page URL, what you expected, and what happened instead—that helps us reproduce the issue.
        </p>
      </>
    ),
  },
];

export default function HelpSupportPage() {
  return (
    <section className="space-y-6" aria-labelledby="help-support-title">
      <div>
        <h1 id="help-support-title" className="text-3xl font-bold tracking-tight">
          Help & Support
        </h1>
        <p className="text-muted-foreground mt-2">
          Quick answers about your account, orders, and how to reach us.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Open a question to read the answer.</p>
        <div className="mt-4 space-y-2">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-md border bg-background px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none font-medium outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm">
                <span className="flex items-center justify-between gap-2">
                  {item.question}
                  <span className="text-muted-foreground text-xs shrink-0 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground [&_p]:leading-relaxed">{item.content}</div>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Contact support</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us an email and we will get back to you as soon as we can.
        </p>
        <p className="mt-4 font-mono text-sm font-medium">{SUPPORT_EMAIL}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Email support</a>
          </Button>
          <CopySupportEmailButton email={SUPPORT_EMAIL} />
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
