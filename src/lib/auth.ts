import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "MovieShop <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your MovieShop email",
        html: `
          <h2>Welcome to MovieShop!</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}">Verify Email</a>
          <p>This link expires in 24 hours.</p>
        `,
      });
    },
    verificationCallbackURL: "/verify-email",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
    },
  },
});