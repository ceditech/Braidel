import { SignUp } from "@clerk/nextjs";

export default function AdminSignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e] px-4">
      <SignUp
        fallbackRedirectUrl="/admin/setup"
        forceRedirectUrl="/admin/setup"
        signInUrl="/admin/sign-in"
      />
    </div>
  );
}
