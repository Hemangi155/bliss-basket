import React from "react";
import {
  Truck,
  Sparkles,
  ArrowRight,
  Gift,
  Clock,
  PenLine,
  Star,
  Award,
  Cake,
  Heart,
  Gem,
  PartyPopper,
  Briefcase,
  Flower2,
  Type,
  CheckCircle2,
  Scroll,
  Palette,
  Camera,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Check,
  AlertCircle,
  RefreshCw,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  local_shipping: Truck,
  auto_awesome: Sparkles,
  arrow_forward: ArrowRight,
  redeem: Gift,
  schedule: Clock,
  edit_note: PenLine,
  star: Star,
  workspace_premium: Award,
  cake: Cake,
  favorite: Heart,
  diamond: Gem,
  celebration: PartyPopper,
  business_center: Briefcase,
  spa: Flower2,
  font_download: Type,
  verified: CheckCircle2,
  history_edu: Scroll,
  palette: Palette,
  photo_camera: Camera,
  chat: MessageCircle,
  mail: Mail,
  location_on: MapPin,
  call: Phone,
  search: Search,
  person: User,
  shopping_bag: ShoppingBag,
  menu: Menu,
  close: X,
  lock: Lock,
  visibility: Eye,
  visibility_off: EyeOff,
  logout: LogOut,
  shield: ShieldCheck,
  check: Check,
  error: AlertCircle,
  refresh: RefreshCw,
};

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  "aria-hidden"?: boolean;
  size?: number | string;
}

export default function MaterialIcon({
  name,
  className = "",
  filled = false,
  "aria-hidden": ariaHidden = true,
  size = "1.25em",
}: MaterialIconProps) {
  const IconComponent = iconMap[name] || Sparkles;

  return (
    <IconComponent
      size={size}
      aria-hidden={ariaHidden}
      className={`inline-block align-middle shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={filled ? 1.5 : 2}
    />
  );
}
