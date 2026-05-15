"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, changePassword } from "./actions";
import { toast } from "sonner";

export function SettingsForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateProfile({ name });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8" aria-labelledby="settings-title">
      <div>
        <h1
          id="settings-title"
          className="text-3xl font-bold tracking-tight mb-2"
        >
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-8 max-w-2xl">
        <form onSubmit={handleProfileUpdate}>
          <div className="rounded-lg border bg-white p-6 space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              Profile Information
            </h2>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Display name for your account.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input value={initialEmail} disabled />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support for email changes.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const currentPassword = formData.get("currentPassword") as string;
            const newPassword = formData.get("newPassword") as string;
            const confirmPassword = formData.get("confirmPassword") as string;

            if (newPassword !== confirmPassword) {
              toast.error("Passwords do not match");
              return;
            }

            if (newPassword.length < 8) {
              toast.error("Password must be at least 8 characters");
              return;
            }

            setSaving(true);
            try {
              const result = await changePassword({
                currentPassword,
                newPassword,
              });
              if (result.error) {
                toast.error(result.error);
              } else {
                toast.success("Password updated");
                form.reset();
              }
            } catch {
              toast.error("Something went wrong");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="rounded-lg border bg-white p-6 space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Security</h2>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Current Password
                </label>
                <Input
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  name="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
