import {
  BookOpenIcon,
  CalendarDaysIcon,
  IdCardIcon,
  type LucideIcon,
  SearchIcon,
} from "lucide-react";
import type { IconKey } from "~/lib/routes";

const MAP: Record<IconKey, LucideIcon> = {
  search: SearchIcon,
  calendar: CalendarDaysIcon,
  generate: IdCardIcon,
  book: BookOpenIcon,
};

/** Resolves a route's iconKey to an icon. Keeps icon choice out of lib/. */
export const RouteIcon = ({
  iconKey,
  className,
}: {
  iconKey: IconKey;
  className?: string;
}) => {
  const Icon = MAP[iconKey];
  return <Icon className={className} aria-hidden="true" />;
};
