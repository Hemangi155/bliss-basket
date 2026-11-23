"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { forgotPasswordAction } from "@/app/auth/actions";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(null, formData);
        if (result.success) {
          setSubmittedEmail(email);
          setSuccess(true);
        } else if (result.error) {
          setErrorMessage(result.error);
        }
      } catch {
        setErrorMessage("Unable to send reset instructions. Please try again.");
      }
    });
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-8 shadow-sm">
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center">
            <MaterialIcon name="mail" size={32} />
          </div>

          <span className="font-label text-label-sm text-light-secondary tracking-widest uppercase font-bold">
            Instructions Sent
          </span>
          <h2 className="font-headline text-headline-md text-light-primary mt-2">
            Check Your Email
          </h2>
          <p className="font-body text-body-md text-light-on-surface-variant mt-3 leading-relaxed">
            If an account is associated with:
          </p>
          <div className="my-3 py-2 px-4 rounded-xl bg-light-surface-container-low font-mono text-xs font-bold text-light-primary inline-block">
            {submittedEmail}
          </div>
          <p className="font-body text-body-sm text-light-outline mt-2 leading-relaxed">
            We have sent a secure password reset link. Please click the link within 1 hour to set a new password.
          </p>

          <div className="mt-8 pt-6 border-t border-light-outline-variant space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-bold hover:bg-light-on-primary-container transition-colors shadow-sm"
            >
              Return to Sign In
            </Link>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="w-full py-2.5 font-label text-label-sm text-light-outline hover:text-light-primary transition-colors"
            >
              Need to use a different email?
            </button>
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
          Account Recovery
        </span>
        <h1 className="font-headline text-headline-lg text-light-primary mt-2">
          Forgot Your Password?
        </h1>
        <p className="font-body text-body-md text-light-on-surface-variant mt-2">
          Enter your registered email address and we will send you a link to reset your password.
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
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block font-label text-label-md text-light-on-surface font-bold mb-1.5"
            >
              Registered Email Address
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
                <span>Sending Instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
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
            Remember your credentials?
          </span>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl border border-light-primary/30 text-light-primary font-label text-label-md font-bold hover:bg-light-primary-container/40 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
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
                Loading recovery...
              </p>
            </div>
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
