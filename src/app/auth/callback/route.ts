
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mergeGuestCartAction, mergeGuestWishlistAction } from '@/app/cart/actions';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const errorParam = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') ?? '/account';

  // Allow only safe local redirect paths.
  const safeNext =
    next.startsWith('/') && !next.startsWith('//')
      ? next
      : '/account';

  if (errorParam || errorDescription) {
    const redirectUrl = new URL('/login', requestUrl.origin);
    redirectUrl.searchParams.set('error', errorParam ?? 'auth_error');
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code', requestUrl.origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirectUrl = new URL('/login', requestUrl.origin);
    redirectUrl.searchParams.set('error', 'verification_failed');
    redirectUrl.searchParams.set('error_description', error.message);
    return NextResponse.redirect(redirectUrl);
  }

  // Merge guest cart and wishlist into customer's DB records after email verification
  try {
    await Promise.all([mergeGuestCartAction(), mergeGuestWishlistAction()]);
  } catch {
    // Non-blocking fallback
  }

  return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
}
