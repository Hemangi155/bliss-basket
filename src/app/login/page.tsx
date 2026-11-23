"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { loginAction } from "@/app/auth/actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const next = searchParams.get("next") || "/account";
  const urlError = searchParams.get("error");
  const urlMessage = searchParams.get("message");
  const urlErrorDesc = searchParams.get("error_description");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlErrorDesc ||
      (urlError === "missing_code"
        ? "Verification code missing. Please click the link in your email again."
        : urlError === "verification_failed"
        ? "Email verification link has expired or is invalid. Please request a new one."
        : urlError === "auth_error"
        ? "Authentication failed. Please sign in again."
        : null)
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    urlMessage === "registered"
      ? "Account created successfully! Please sign in."
      : urlMessage === "password_updated"
      ? "Password updated successfully. Please sign in with your new password."
      : null
  );

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", next);

    startTransition(async () => {
      try {
        const result = await loginAction(null, formData);
        if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
          router.refresh();
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } catch {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="font-label text-label-sm text-light-secondary tracking-widest uppercase font-bold">
          Welcome to Bliss Basket
        </span>
        <h1 className="font-headline text-headline-lg text-light-primary mt-2">
          Customer Sign In
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant mt-2">
          Access your personal hamper collections, tracked orders and saved addresses.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-8 shadow-sm">
        {/* Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-900 text-sm">
            <MaterialIcon
              name="check"
              className="text-green-700 shrink-0 mt-0.5"
              size={18}
            />
            <span>{successMessage}</span>
          </div>
        )}

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
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Email Address
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="font-label text-label-md text-light-on-surface font-bold"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="font-label text-label-sm text-light-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-lg font-bold tracking-wide hover:bg-light-on-primary-container transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <>
                <MaterialIcon
                  name="refresh"
                  className="animate-spin"
                  size={18}
                />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Bliss Basket</span>
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
            New to Bliss Basket?
          </span>
        </div>

        {/* Create Account Link */}
        <div className="text-center">
          <Link
            href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl border border-light-primary/30 text-light-primary font-label text-label-md font-bold hover:bg-light-primary-container/40 transition-colors"
          >
            Create Your Account
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

export default function LoginPage() {
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
                Loading sign in...
              </p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
