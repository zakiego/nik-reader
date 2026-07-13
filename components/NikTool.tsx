import { useState } from "react";
import { match } from "ts-pattern";
import { Tab } from "~/components/Tab";
import { Predict } from "~/components/pages/Predict";
import { Read } from "~/components/pages/Read";
import type { Feature } from "~/lib/const";

/**
 * The two-tab tool (Baca / Generate) used on the home page. Dedicated landing
 * pages embed <Read /> or <Predict /> directly instead, so each page leads with
 * the single tool that matches its search intent.
 */
export const NikTool = ({ initial = "read" }: { initial?: Feature }) => {
  const [selectedTab, setSelectedTab] = useState<Feature>(initial);

  return (
    <>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div key={selectedTab} role="tabpanel" className="animate-fade-in">
        {match(selectedTab)
          .with("read", () => <Read />)
          .with("predict", () => <Predict />)
          .exhaustive()}
      </div>
    </>
  );
};
