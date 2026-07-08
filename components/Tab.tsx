import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/20/solid";
import { Dispatch, FC, SetStateAction } from "react";
import { Feature } from "~/lib/const";

interface Props {
  selectedTab: Feature;
  setSelectedTab: Dispatch<SetStateAction<Feature>>;
}

const TAB_META: Record<
  Feature,
  { label: string; Icon: typeof MagnifyingGlassIcon }
> = {
  read: { label: "Baca", Icon: MagnifyingGlassIcon },
  predict: { label: "Generate", Icon: SparklesIcon },
};

export const Tab: FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div
      role="tablist"
      aria-label="Mode NIK"
      className="mt-8 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface-2 p-1"
    >
      {Feature.map((tab) => {
        const active = selectedTab === tab;
        const { label, Icon } = TAB_META[tab];

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setSelectedTab(tab)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2 ${
              active
                ? "bg-surface text-content shadow-sm"
                : "text-muted hover:text-content"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
};
