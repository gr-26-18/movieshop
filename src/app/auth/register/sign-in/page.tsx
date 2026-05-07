import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./_components/sign-in-form";


export default async function SigninPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/")
    }

    return (
        <div className="max-w-sm mx-auto">
          <SignInForm />
        </div>
    )
}