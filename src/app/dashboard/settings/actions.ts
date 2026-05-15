"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateProfile(data: { name: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: data.name,
      },
    });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update profile";
    return { error: message };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    });
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to change password";
    return { error: message };
  }
}
