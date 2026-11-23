"use client";

import MaterialIcon from "../MaterialIcon";

interface ToastNotificationProps {
  message: string;
  subMessage?: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "wishlist" | "error";
}

export default function ToastNotification({
  message,
  subMessage,
  isVisible,
  onClose,
  type = "success",
}: ToastNotificationProps) {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg bg-light-surface-container-lowest border border-light-outline-variant p-4 shadow-xl flex items-start gap-3 animate-slideUp text-light-on-surface"
    >
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
          type === "wishlist"
            ? "bg-light-primary-container text-light-primary"
            : type === "error"
            ? "bg-red-100 text-red-600"
            : "bg-success/15 text-success"
        }`}
      >
        <MaterialIcon
          name={type === "wishlist" ? "favorite" : type === "error" ? "error" : "shopping_bag"}
          size="1.2em"
          filled={type === "wishlist"}
        />
      </div>

      <div className="flex-1 flex flex-col pr-2">
        <span className="font-title text-title-sm text-light-on-surface">
          {message}
        </span>
        {subMessage && (
          <span className="font-body text-body-sm text-light-on-surface-variant">
            {subMessage}
          </span>
        )}
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
        className="text-light-outline hover:text-light-on-surface p-1 rounded-sm"
      >
        <MaterialIcon name="close" size="1em" />
      </button>
    </div>
  );
}
