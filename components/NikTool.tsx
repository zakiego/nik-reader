import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Predict } from "~/components/pages/Predict";
import { Read } from "~/components/pages/Read";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { track } from "~/lib/analytics";
import { Feature } from "~/lib/const";
import { TOOL_PARAMS, getParam, replaceParams } from "~/lib/url-query";

/**
 * The two-tab tool (Baca NIK / Generator) used on the home page. Dedicated
 * landing pages wrap <Read /> or <Predict /> in a <ToolPanel> directly instead,
 * so each page leads with the single tool that matches its search intent.
 */
export const NikTool = ({ initial = "read" }: { initial?: Feature }) => {
  const router = useRouter();
  const [tab, setTab] = useState<Feature>(initial);

  // A generator link opens on the generator tab.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once, when the query arrives
  useEffect(() => {
    if (!router.isReady) return;
    const isGeneratorLink =
      !getParam(router, "nik") &&
      (["region", "gender", "birth"] as const).some((key) =>
        getParam(router, key),
      );
    if (isGeneratorLink) setTab("predict");
  }, [router.isReady]);

  const switchTab = (next: string) => {
    setTab(next as Feature);
    track("tab-switch", { tab: next as Feature });
    // The inactive tab unmounts and loses its input, so its params go too.
    replaceParams(
      router,
      Object.fromEntries(TOOL_PARAMS.map((key) => [key, null])),
    );
  };

  return (
    <Tabs value={tab} onValueChange={switchTab}>
      <Card>
        <CardHeader className="border-b p-3 sm:px-6 sm:py-4">
          <TabsList aria-label="Mode NIK" className="w-full sm:w-fit">
            <TabsTrigger value="read" className="flex-1 sm:flex-none">
              Baca NIK
            </TabsTrigger>
            <TabsTrigger value="predict" className="flex-1 sm:flex-none">
              Generator
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="read" className="mt-0">
            <Read />
          </TabsContent>
          <TabsContent value="predict" className="mt-0">
            <Predict />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

/** The panel a single tool sits in on its own landing page. */
export const ToolPanel = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <CardContent className="p-4 sm:p-6">{children}</CardContent>
  </Card>
);
