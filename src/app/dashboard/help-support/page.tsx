// Added 2026-05-11 — Help & Support dashboard route.
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    question: "How do I view my purchased movies?",
    answer:
      "Open Dashboard and go to the Order History section. Click 'View order' to see all items in a specific order.",
  },
  {
    question: "Can I change my account information now?",
    answer:
      "Account settings UI is available, but profile updates will be fully enabled after authentication integration is finalized.",
  },
  {
    question: "Why do I see no orders in my dashboard?",
    answer:
      "If your account has not completed a checkout yet, order history will be empty. Use the store and cart flow first.",
  },
  {
    question: "Who should I contact for technical issues?",
    answer:
      "Use the support email section below and include what page you were on, what you expected, and what happened.",
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
          Find quick answers and contact support when you need help.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-md border p-4">
              <h3 className="font-medium">{item.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Contact Support</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us an email and we will get back to you as soon as possible.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <a href="mailto:support@movieshop.local">Email Support</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
