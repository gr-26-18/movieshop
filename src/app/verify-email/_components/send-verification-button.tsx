"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


export default function SendVerificationButton() {
    async function handleClick() {
        const { error } = await authClient.sendVerificationEmail({
            email:"",
        });

        if (error) {
          alert(error.message || "Unknown error occurred");
          return;
        }

        alert("Email sent successfully")
    }

    return (
        <Button className="w-full" onClick={handleClick}>
            Re-send Verfication Email
        </Button>
    );
}