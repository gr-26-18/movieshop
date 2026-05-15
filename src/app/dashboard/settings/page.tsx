import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SettingsForm
      initialName={session.user.name ?? ""}
      initialEmail={session.user.email}
    />
  );
}
