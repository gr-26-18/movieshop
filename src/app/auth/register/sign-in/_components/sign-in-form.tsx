"use client"

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";



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
          return;
        }
        alert(error.message || "An unknown error occurred");
        return; 
      }

      router.push("/");
      router.refresh();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Fill out the form below to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form 
             id="sign-in-form"
             onSubmit={(ev) => {
              ev.preventDefault();
              form.handleSubmit(ev);
             }}
             >
        <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      type="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
      </CardContent>
    </Card>
  )
}