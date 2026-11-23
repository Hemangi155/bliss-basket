"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { signupAction } from "@/app/auth/actions";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // After registration, always go to /login; "next" is preserved for post-login redirect
  const next = searchParams.get("next") || "/account";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Password strength
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!terms) {
      setErrorMessage("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("terms", "on");

    startTransition(async () => {
      try {
        const result = await signupAction(null, formData);
        if (result.success && result.redirectTo) {
          // Always redirects to /login?message=registered
          // Preserve the original "next" param so login → account flow works
          const loginUrl =
            result.redirectTo +
            (next !== "/account" ? `&next=${encodeURIComponent(next)}` : "");
          router.push(loginUrl);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } catch {
        setErrorMessage(
          "An unexpected registration error occurred. Please try again."
        );
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="font-label text-label-sm text-light-secondary tracking-widest uppercase font-bold">
          Join Bliss Basket
        </span>
        <h1 className="font-headline text-headline-lg text-light-primary mt-2">
          Create Your Account
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant mt-2">
          Curate personalized gift hampers, track your orders and unlock festive
          exclusives.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-8 shadow-sm">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 text-sm">
            <MaterialIcon
              name="error"
              className="text-red-700 shrink-0 mt-0.5"
              size={18}
            />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Full Name *
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/60 focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all text-sm"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="person" size={18} />
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Email Address *
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/60 focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all text-sm"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="mail" size={18} />
              </span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Phone / WhatsApp{" "}
              <span className="font-normal text-light-outline text-xs">
                (optional)
              </span>
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/60 focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all text-sm"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="call" size={18} />
              </span>
            </div>
            <p className="mt-1 text-xs text-light-outline font-label">
              For delivery updates and festive offers.
            </p>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/60 focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all text-sm"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="lock" size={18} />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-light-outline hover:text-light-primary transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <MaterialIcon
                  name={showPassword ? "visibility_off" : "visibility"}
                  size={18}
                />
              </button>
            </div>

            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div
                  className={`flex items-center gap-1.5 text-xs font-label ${hasMinLength ? "text-green-700" : "text-light-outline"}`}
                >
                  <MaterialIcon
                    name={hasMinLength ? "check_circle" : "radio_button_unchecked"}
                    size={13}
                  />
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-label ${hasNumberOrSymbol ? "text-green-700" : "text-light-outline"}`}
                >
                  <MaterialIcon
                    name={hasNumberOrSymbol ? "check_circle" : "radio_button_unchecked"}
                    size={13}
                  />
                  Contains a number or symbol
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/60 focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all text-sm"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="lock" size={18} />
              </span>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-600 font-label">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-body text-light-on-surface-variant leading-relaxed">
              <input
                type="checkbox"
                required
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 rounded text-light-primary focus:ring-light-primary accent-light-primary"
              />
              <span>
                I agree to the{" "}
                <span className="text-light-primary font-bold">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-light-primary font-bold">
                  Privacy Policy
                </span>
                .
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-lg font-bold tracking-wide hover:bg-light-on-primary-container transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <>
                <MaterialIcon name="refresh" className="animate-spin" size={18} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Bliss Basket Account</span>
                <MaterialIcon name="arrow_forward" size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-light-outline-variant" />
          </div>
          <span className="relative px-4 bg-light-surface-container-lowest text-light-outline text-xs uppercase tracking-wider font-label font-bold">
            Already a member?
          </span>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl border border-light-primary/30 text-light-primary font-label text-label-md font-bold hover:bg-light-primary-container/40 transition-colors"
          >
            Sign In to Existing Account
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 flex items-center justify-center gap-6 text-light-outline text-xs font-label">
        <span className="flex items-center gap-1.5">
          <MaterialIcon name="shield" size={15} />
          256-bit SSL Security
        </span>
        <span className="flex items-center gap-1.5">
          <MaterialIcon name="verified" size={15} />
          Verified Indian Luxury
        </span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-12 lg:py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto text-center py-16">
              <MaterialIcon
                name="refresh"
                className="animate-spin text-light-primary mx-auto"
                size={32}
              />
              <p className="font-label text-label-md text-light-outline mt-4">
                Loading registration...
              </p>
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
