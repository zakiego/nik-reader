import {
  BookOpenIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { IconKey } from "~/lib/routes";

const MAP: Record<IconKey, typeof MagnifyingGlassIcon> = {
  search: MagnifyingGlassIcon,
  calendar: CalendarDaysIcon,
  sparkles: SparklesIcon,
  book: BookOpenIcon,
};

/** Resolves a route's iconKey to a heroicon. Keeps icon choice out of lib/. */
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
