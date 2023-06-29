import { useState } from "react";
import { match } from "ts-pattern";
import { Navbar } from "~/components/Navbar";
import { Tab } from "~/components/Tab";
import { Predict } from "~/components/pages/Predict";
import { Read } from "~/components/pages/Read";
import { Feature } from "~/lib/const";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<Feature>("read");

  return (
    <div className="px-4 py-9 max-w-3xl mx-auto">
      <Navbar />
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {match(selectedTab)
        .with("read", () => <Read />)
        .with("predict", () => <Predict />)
        .exhaustive()}
    </div>
  );
}
