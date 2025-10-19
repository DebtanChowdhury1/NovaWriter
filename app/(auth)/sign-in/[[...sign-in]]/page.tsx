"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-content hover:bg-primary-focus",
            headerSubtitle: "hidden",
          },
        }}
      />
    </div>
  );
}
