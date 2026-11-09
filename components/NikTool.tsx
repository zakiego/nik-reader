import { IdCardIcon, SearchIcon } from "lucide-react";
import { Predict } from "~/components/pages/Predict";
import { Read } from "~/components/pages/Read";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { track } from "~/lib/analytics";
import { Feature } from "~/lib/const";

/**
 * The two-tab tool (Baca / Buat contoh) used on the home page. Dedicated
 * landing pages wrap <Read /> or <Predict /> in a <ToolPanel> directly instead,
 * so each page leads with the single tool that matches its search intent.
 */
export const NikTool = ({ initial = "read" }: { initial?: Feature }) => (
  <Tabs
    defaultValue={initial}
    onValueChange={(tab) => track("tab-switch", { tab: tab as Feature })}
  >
    <Card>
      <CardHeader className="border-b p-3 sm:px-6 sm:py-4">
        <TabsList aria-label="Mode NIK" className="w-full sm:w-fit">
          <TabsTrigger value="read" className="flex-1 sm:flex-none">
            <SearchIcon aria-hidden="true" />
            Baca NIK
          </TabsTrigger>
          <TabsTrigger value="predict" className="flex-1 sm:flex-none">
            <IdCardIcon aria-hidden="true" />
            Buat contoh
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

/** The panel a single tool sits in on its own landing page. */
export const ToolPanel = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <CardContent className="p-4 sm:p-6">{children}</CardContent>
  </Card>
);
