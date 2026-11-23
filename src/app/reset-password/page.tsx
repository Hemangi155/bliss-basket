"use client";

import { Suspense, useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { resetPasswordAction } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);

  const [isPending, startTransition] = useTransition();

  // Verify that an active session or recovery token exists
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSessionValid(true);
      } else {
        setIsSessionValid(false);
      }
    });
  }, []);

  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      try {
        const result = await resetPasswordAction(null, formData);
        if (result.success) {
          setSuccessMessage(
            "Your password has been successfully updated. Redirecting to your account..."
          );
          setTimeout(() => {
            router.push("/account");
            router.refresh();
          }, 2000);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } catch {
        setErrorMessage("An unexpected error occurred while updating password.");
      }
    });
  };

  if (isSessionValid === null) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-16">
        <MaterialIcon
          name="refresh"
          className="animate-spin text-light-primary mx-auto"
          size={32}
        />
        <p className="font-label text-label-md text-light-outline mt-4">
          Verifying security token...
        </p>
      </div>
    );
  }

  if (isSessionValid === false) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-8 shadow-sm">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            <MaterialIcon name="error" size={32} />
          </div>

          <span className="font-label text-label-sm text-red-700 tracking-widest uppercase font-bold">
            Link Expired
          </span>
          <h2 className="font-headline text-headline-md text-light-primary mt-2">
            Invalid or Expired Link
          </h2>
          <p className="font-body text-body-md text-light-on-surface-variant mt-3 leading-relaxed">
            This password reset link is invalid or has already been used. For your security, password links expire after 1 hour.
          </p>

          <div className="mt-8 pt-6 border-t border-light-outline-variant space-y-3">
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-bold hover:bg-light-on-primary-container transition-colors shadow-sm"
            >
              Request a New Reset Link
            </Link>
            <Link
              href="/login"
              className="w-full inline-block py-2.5 font-label text-label-sm text-light-outline hover:text-light-primary transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="font-label text-label-sm text-light-secondary tracking-widest uppercase font-bold">
          Account Security
        </span>
        <h1 className="font-headline text-headline-lg text-light-primary mt-2">
          Set New Password
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant mt-2">
          Choose a secure, strong password for your Bliss Basket account.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              New Password
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
                placeholder="At least 8 characters"
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

            {/* Password Validation Pills */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-label">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  hasMinLength
                    ? "bg-green-100 text-green-800"
                    : "bg-light-surface-container-low text-light-outline"
                }`}
              >
                <MaterialIcon
                  name={hasMinLength ? "check" : "shield"}
                  size={12}
                />
                8+ characters
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  hasNumberOrSymbol
                    ? "bg-green-100 text-green-800"
                    : "bg-light-surface-container-low text-light-outline"
                }`}
              >
                <MaterialIcon
                  name={hasNumberOrSymbol ? "check" : "shield"}
                  size={12}
                />
                Number or symbol
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Confirm New Password
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
                placeholder="Re-enter your new password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || Boolean(successMessage)}
            className="w-full py-3.5 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-lg font-bold tracking-wide hover:bg-light-on-primary-container transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isPending ? (
              <>
                <MaterialIcon
                  name="refresh"
                  className="animate-spin"
                  size={18}
                />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <MaterialIcon name="arrow_forward" size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
                Loading password reset...
              </p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
