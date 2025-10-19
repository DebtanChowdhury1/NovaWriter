"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <SignUp
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
