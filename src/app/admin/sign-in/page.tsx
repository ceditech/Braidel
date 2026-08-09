import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e] px-4">
      <SignIn
        fallbackRedirectUrl="/admin/setup"
        forceRedirectUrl="/admin/setup"
        signUpUrl="/admin/sign-up"
      />
    </div>
  );
}
