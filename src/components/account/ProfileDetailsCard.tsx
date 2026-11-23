"use client";

import { useState, useTransition } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import { updateProfileAction } from "@/app/auth/actions";

interface ProfileDetailsCardProps {
  user: {
    id: string;
    email?: string;
    created_at?: string;
    email_confirmed_at?: string | null;
  };
  initialProfile: {
    full_name?: string | null;
    phone?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null;
}

export default function ProfileDetailsCard({
  user,
  initialProfile,
}: ProfileDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently joined";

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);

    startTransition(async () => {
      try {
        const result = await updateProfileAction(null, formData);
        if (result.success) {
          setMessage({
            type: "success",
            text: result.message || "Profile updated successfully.",
          });
          setIsEditing(false);
        } else if (result.error) {
          setMessage({
            type: "error",
            text: result.error,
          });
        }
      } catch {
        setMessage({
          type: "error",
          text: "An unexpected error occurred while updating your profile.",
        });
      }
    });
  };

  const handleCancel = () => {
    setFullName(initialProfile?.full_name || "");
    setPhone(initialProfile?.phone || "");
    setMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-2xl p-6 shadow-2xs">
      {/* Card Header & Avatar */}
      <div className="flex items-center justify-between pb-6 border-b border-light-outline-variant">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center font-headline text-headline-sm font-bold shadow-2xs">
            {(fullName || user.email || "B")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="font-headline text-title-lg text-light-primary truncate">
              {fullName || "Valued Customer"}
            </h2>
            <p className="font-body text-body-sm text-light-outline truncate">
              {user.email}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-light-primary/30 text-light-primary hover:bg-light-primary-container/40 text-xs font-label font-bold transition-colors"
          >
            <MaterialIcon name="edit_note" size={16} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Status Banners */}
      {message && (
        <div
          className={`mt-4 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-body ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <MaterialIcon
            name={message.type === "success" ? "check" : "error"}
            size={16}
            className={message.type === "success" ? "text-green-700 mt-0.5" : "text-red-700 mt-0.5"}
          />
          <span>{message.text}</span>
        </div>
      )}

      {/* Edit Form vs View Mode */}
      {isEditing ? (
        <form onSubmit={handleSave} className="pt-6 space-y-4">
          <div>
            <label
              htmlFor="editFullName"
              className="block font-label text-label-sm text-light-on-surface font-bold mb-1"
            >
              Full Name *
            </label>
            <div className="relative">
              <input
                id="editFullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohit Sharma"
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="person" size={16} />
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="editPhone"
              className="block font-label text-label-sm text-light-on-surface font-bold mb-1"
            >
              Phone / Mobile Number
            </label>
            <div className="relative">
              <input
                id="editPhone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-light-primary focus:bg-white transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-outline pointer-events-none">
                <MaterialIcon name="call" size={16} />
              </span>
            </div>
            <p className="mt-1 text-xs text-light-outline font-label">
              Used for festive delivery dispatch and tracking updates.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 px-4 rounded-xl bg-light-primary text-light-on-primary font-label text-label-sm font-bold hover:bg-light-on-primary-container transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-2xs"
            >
              {isPending ? (
                <>
                  <MaterialIcon name="refresh" className="animate-spin" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MaterialIcon name="check" size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleCancel}
              className="py-2.5 px-4 rounded-xl border border-light-outline-variant text-light-outline hover:text-light-on-surface hover:bg-light-surface-container-low font-label text-label-sm font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-label text-light-outline">Full Name</span>
            <span className="font-body text-light-on-surface font-bold">
              {fullName || "Not provided"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-label text-light-outline">Email</span>
            <span className="font-body text-light-on-surface font-bold break-all text-right max-w-[55%]">
              {user.email || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-label text-light-outline">Mobile / WhatsApp</span>
            <span className="font-body text-light-on-surface">
              {phone ? (
                <span className="font-bold text-light-primary">{phone}</span>
              ) : (
                <span className="text-light-outline italic">Not provided</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-label text-light-outline">Member Since</span>
            <span className="font-body text-light-on-surface font-bold">
              {memberSince}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-label text-light-outline">Delivery Coverage</span>
            <span className="font-body text-light-on-surface">
              19,000+ PIN Codes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
