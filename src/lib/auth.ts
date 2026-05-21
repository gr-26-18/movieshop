import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      if (!resend) {
        console.log(`[DEV] Reset password for ${user.email}: ${url}`);
        return;
      }

      await resend.emails.send({
        from: "MovieShop <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your MovieShop password",
        html: `
          <h2>Reset your password</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (!resend) {
        // No Resend key — log the link for local development
        console.log(`[DEV] Verify email for ${user.email}: ${url}`);
        return;
      }

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
    verificationCallbackURL: "/sign-in?verified=true",
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