import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles, User } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-base text-base-content/70">
          Manage your account, view usage, and configure team-wide preferences.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body space-y-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xl font-semibold">{user.fullName}</p>
                <p className="text-sm text-base-content/70">
                  {primaryEmail?.emailAddress ?? "No email"}
                </p>
              </div>
            </div>
            <div className="divider" />
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-base-content/60">Subscription</dt>
                <dd className="font-medium">Growth (Trial)</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-base-content/60">Token usage</dt>
                <dd className="font-medium">See dashboard</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-base-content/60">Member since</dt>
                <dd className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
            <div className="rounded-xl border border-dashed border-base-300 p-4 text-xs text-base-content/60">
              <p className="flex items-center gap-2 font-medium text-base-content">
                <ShieldCheck className="h-4 w-4" />
                Security best practices
              </p>
              <p className="mt-2">
                Enable two-factor authentication and invite teammates to share credits securely.
              </p>
            </div>
          </div>
        </section>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Account management</h2>
                <p className="text-sm text-base-content/70">
                  Update your personal details, email preferences, and security settings.
                </p>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-base-300">
              <UserProfile
                routing="path"
                path="/profile"
                appearance={{
                  elements: {
                    card: "shadow-none bg-base-100",
                    navbar: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
