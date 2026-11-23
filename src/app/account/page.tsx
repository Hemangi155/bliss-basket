import { redirect } from "next/navigation";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import ProfileDetailsCard from "@/components/account/ProfileDetailsCard";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  // Fetch profile record from public.profiles
  let initialProfile: {
    full_name?: string | null;
    phone?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null = null;

  let completedOrderCount = 0;

  try {
    const [profileResult, cartResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, phone, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle(),
      // Count carts with status=completed as a proxy for placed orders
      supabase
        .from("carts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed"),
    ]);

    if (!profileResult.error && profileResult.data) {
      initialProfile = {
        full_name: profileResult.data.full_name,
        phone: profileResult.data.phone,
        created_at: profileResult.data.created_at,
        updated_at: profileResult.data.updated_at,
      };
    }

    if (!cartResult.error) {
      completedOrderCount = cartResult.count ?? 0;
    }
  } catch {
    // Fallback to user metadata if DB is temporarily unreachable
  }

  // Fallback: use auth user_metadata if no profile row yet
  const displayName =
    initialProfile?.full_name || user.user_metadata?.full_name || "";
  const displayPhone =
    initialProfile?.phone || user.user_metadata?.phone || null;

  const profileSummary = initialProfile || {
    full_name: displayName,
    phone: displayPhone,
    created_at: user.created_at,
    updated_at: null,
  };

  const userSummary = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    email_confirmed_at: user.email_confirmed_at,
  };

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-14">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-light-outline-variant">
          <div>
            <div className="flex items-center gap-2 text-xs font-label text-light-outline mb-1">
              <Link href="/" className="hover:text-light-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-light-primary font-bold">My Account</span>
            </div>
            <h1 className="font-headline text-headline-lg text-light-primary">
              Welcome back,{" "}
              {displayName || user.email?.split("@")[0] || "Valued Customer"}
            </h1>
            <p className="font-body text-body-md text-light-on-surface-variant mt-1">
              Manage your personal hamper reservations, shipping destinations and
              security.
            </p>
          </div>

          {/* Sign Out */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface-container-lowest text-light-primary font-label text-label-md font-bold hover:bg-light-primary-container transition-colors shadow-2xs"
            >
              <MaterialIcon name="logout" size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            {
              icon: "shopping_bag",
              label: "Total Orders",
              value: completedOrderCount.toString(),
            },
            {
              icon: "favorite",
              label: "Wishlist Items",
              value: "—",
            },
            {
              icon: "local_shipping",
              label: "Active Deliveries",
              value: "0",
            },
            {
              icon: "calendar_today",
              label: "Member Since",
              value: memberSince,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-4 shadow-2xs flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-light-secondary">
                <MaterialIcon name={icon} size={18} />
                <span className="font-label text-label-sm text-light-outline">
                  {label}
                </span>
              </div>
              <span className="font-headline text-title-lg text-light-primary font-bold">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileDetailsCard
              user={userSummary}
              initialProfile={profileSummary}
            />

            {/* Quick Links */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-6 shadow-2xs">
              <h3 className="font-headline text-title-md text-light-primary mb-4">
                Quick Navigation
              </h3>
              <ul className="space-y-3 font-label text-label-md">
                <li>
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-surface-container-low text-light-on-surface hover:text-light-primary transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <MaterialIcon name="favorite" size={18} />
                      My Wishlist
                    </span>
                    <MaterialIcon name="arrow_forward" size={16} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-surface-container-low text-light-on-surface hover:text-light-primary transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <MaterialIcon name="shopping_cart" size={18} />
                      My Cart
                    </span>
                    <MaterialIcon name="arrow_forward" size={16} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-surface-container-low text-light-on-surface hover:text-light-primary transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <MaterialIcon name="redeem" size={18} />
                      Browse Hampers
                    </span>
                    <MaterialIcon name="arrow_forward" size={16} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reset-password"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-surface-container-low text-light-on-surface hover:text-light-primary transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <MaterialIcon name="lock" size={18} />
                      Update Password
                    </span>
                    <MaterialIcon name="arrow_forward" size={16} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Summary Card */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-6 lg:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-outline-variant">
                <h3 className="font-headline text-headline-sm text-light-primary">
                  Account Details
                </h3>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <dt className="font-label text-label-sm text-light-outline">
                    Full Name
                  </dt>
                  <dd className="font-body text-body-md text-light-on-surface font-bold">
                    {displayName || "Not provided"}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-label text-label-sm text-light-outline">
                    Email Address
                  </dt>
                  <dd className="font-body text-body-md text-light-on-surface font-bold break-all">
                    {user.email}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-label text-label-sm text-light-outline">
                    Phone / WhatsApp
                  </dt>
                  <dd className="font-body text-body-md text-light-on-surface font-bold">
                    {displayPhone || (
                      <span className="text-light-outline italic font-normal text-sm">
                        Not provided — edit profile to add
                      </span>
                    )}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-label text-label-sm text-light-outline">
                    Total Orders
                  </dt>
                  <dd className="font-body text-body-md text-light-on-surface font-bold">
                    {completedOrderCount}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Orders Section */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-6 lg:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-outline-variant">
                <h3 className="font-headline text-headline-sm text-light-primary">
                  Order History &amp; Tracking
                </h3>
                <span className="font-label text-label-sm text-light-outline">
                  {completedOrderCount} Order{completedOrderCount !== 1 ? "s" : ""}
                </span>
              </div>

              {completedOrderCount === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-light-surface-container text-light-primary flex items-center justify-center">
                    <MaterialIcon name="shopping_bag" size={30} />
                  </div>
                  <h4 className="font-headline text-title-lg text-light-primary">
                    No orders placed yet
                  </h4>
                  <p className="font-body text-body-md text-light-on-surface-variant max-w-md mx-auto mt-2 leading-relaxed">
                    Your artisanal gift hampers, festive collections and
                    personalized creations will appear here once reserved.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-bold hover:bg-light-on-primary-container transition-colors shadow-sm"
                    >
                      <span>Discover Handcrafted Hampers</span>
                      <MaterialIcon name="arrow_forward" size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="font-body text-body-md text-light-on-surface-variant">
                  {completedOrderCount} completed order
                  {completedOrderCount !== 1 ? "s" : ""} found.
                </p>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-6 lg:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-outline-variant">
                <div>
                  <h3 className="font-headline text-headline-sm text-light-primary">
                    Shipping &amp; Gifting Addresses
                  </h3>
                  <p className="font-body text-body-sm text-light-on-surface-variant mt-0.5">
                    Save recipient addresses for quick gifting checkouts across
                    India.
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-light-outline-variant bg-light-surface-container-low text-center">
                <MaterialIcon
                  name="location_on"
                  className="text-light-secondary mx-auto mb-2"
                  size={28}
                />
                <h4 className="font-headline text-title-md text-light-primary">
                  No saved addresses yet
                </h4>
                <p className="font-body text-body-sm text-light-outline mt-1 max-w-sm mx-auto">
                  Addresses entered during checkout will be saved to your
                  profile for future celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
