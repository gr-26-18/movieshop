"use client"

import { useRouter } from "next/navigation";
import { z} from "zod"
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().min(1,"Name required").max(32),
  email: z.email().max(40),
  password: z.string().min(1).max(20)
});

export default function RegisterForm() {
    const router = useRouter();

    const form = useForm({
      defaultValues: {
        name: "",
        email: "",
      },
      validators: {
        onSubmit: formSchema,
      },
      onSubmit: async ({ value }) => {
        const { error } = await authClient.signUp.email({

        })
      }
    })
}
