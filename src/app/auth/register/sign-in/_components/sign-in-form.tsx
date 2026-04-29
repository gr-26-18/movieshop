"use client"

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";



const formSchema = z.object({
  email: z.email().max(128),
  password: z.string().min(8).max(128),
});

export default function Signinform() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        if (error.code === "EMAIL_NOT_VERIFIED") {
          router.push("/auth/verify-email");
        }
      }
    }
  })
}