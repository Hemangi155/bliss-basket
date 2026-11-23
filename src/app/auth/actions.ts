"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mergeGuestCartAction, mergeGuestWishlistAction } from "@/app/cart/actions";

interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
  requiresEmailConfirmation?: boolean;
  redirectTo?: string;
}

/**
 * Validates email format using RFC 5322 compatible regex
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Resolves current request origin safely
 */
async function getRequestOrigin(): Promise<string> {
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin) return origin;

  const referer = headersList.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // Ignore URL parsing errors
    }
  }

  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

/**
 * 1. Customer Login Action
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const nextParam = (formData.get("next") as string) || "/account";

  if (!email || !isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password || password.length === 0) {
    return { success: false, error: "Please enter your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Provide clean, user-friendly error messages
    if (error.message.includes("Invalid login credentials")) {
      return {
        success: false,
        error: "Incorrect email or password. Please verify your credentials.",
      };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        success: false,
        error:
          "Your email address has not been confirmed yet. Please contact support or try registering again.",
      };
    }
    return { success: false, error: error.message };
  }

  const safeNext =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/account";

  // Merge any guest cart and wishlist into user's DB records after successful login
  try {
    await Promise.all([mergeGuestCartAction(), mergeGuestWishlistAction()]);
  } catch {
    // Non-blocking fallback
  }

  revalidatePath("/", "layout");
  return { success: true, redirectTo: safeNext };
}

/**
 * 2. Customer Registration Action
 */
export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const termsAccepted = formData.get("terms") === "on";

  if (!fullName || fullName.length < 2) {
    return {
      success: false,
      error: "Please enter your full name (at least 2 characters).",
    };
  }

  if (phone && phone.length > 0) {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        success: false,
        error: "Please enter a valid phone number (10 to 15 digits).",
      };
    }
  }

  if (!email || !isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password || password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  if (!termsAccepted) {
    return {
      success: false,
      error: "Please agree to the Terms of Service & Privacy Policy.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
      },
      // No emailRedirectTo — email confirmation is disabled in Supabase Auth settings.
      // If confirmation is ever re-enabled, this URL will be used for the redirect.
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    // "User already registered" comes back when email confirmation is OFF and
    // a confirmed user already exists with that address.
    if (
      error.message.includes("User already registered") ||
      error.message.includes("already been registered")
    ) {
      return {
        success: false,
        error:
          "An account with this email address already exists. Please sign in instead.",
      };
    }
    if (error.message.toLowerCase().includes("sending confirmation email")) {
      // Supabase SMTP quota hit or email confirmation is still ON in dashboard.
      // Treat the user as created (data.user exists) and direct them to sign in.
      // The admin must disable "Confirm email" in Supabase Auth → Providers → Email.
      return {
        success: false,
        error:
          "Account creation failed: email confirmation is enabled on this project. " +
          "Please ask the site owner to disable it in Supabase Auth settings.",
      };
    }
    return { success: false, error: error.message };
  }

  // At this point signUp succeeded without an email-sending error.
  // Always redirect to /login with a success banner — the customer signs in next.
  // This works whether email confirmation is ON or OFF:
  //   • OFF → data.session exists; we sign out immediately so the customer logs in fresh.
  //   • ON  → data.session is null; the customer logs in after clicking the email link.
  if (data.session) {
    // Sign the auto-session out so the customer goes through the explicit login step.
    await supabase.auth.signOut();
  }

  return {
    success: true,
    requiresEmailConfirmation: false,
    redirectTo: "/login?message=registered",
  };
}

/**
 * 3. Forgot Password Action
 */
export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email || !isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: `Password reset instructions have been sent to ${email}. If an account exists, you will receive an email shortly.`,
  };
}

/**
 * 4. Password Reset Action (for authenticated recovery session)
 */
export async function resetPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters long.",
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Your password has been successfully updated.",
    redirectTo: "/account",
  };
}

/**
 * 5. Sign Out Action
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * 6. Customer Profile Update Action
 * Updates public.profiles and keeps auth user_metadata in sync securely.
 * Enforces RLS by executing through the authenticated customer session client.
 */
export async function updateProfileAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!fullName || fullName.length < 2) {
    return {
      success: false,
      error: "Please enter your full name (at least 2 characters).",
    };
  }

  if (phone && phone.length > 0) {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        success: false,
        error: "Please enter a valid phone number (10 to 15 digits).",
      };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "You must be signed in to update your profile.",
    };
  }

  // Update public.profiles through authenticated client enforcing RLS (auth.uid() = id)
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    return {
      success: false,
      error: `Failed to update profile: ${profileError.message}`,
    };
  }

  // Synchronize auth user_metadata
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone: phone || null,
    },
  });

  revalidatePath("/account");
  return {
    success: true,
    message: "Your profile has been successfully updated.",
  };
}
