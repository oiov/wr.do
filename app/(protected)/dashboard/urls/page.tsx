import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";

import ApiReference from "../../../../components/shared/api-reference";
import Globe from "./globe";
import LiveLog from "./live-logs";
import UserUrlsList from "./url-list";

export const metadata = constructMetadata({
  title: "Short URLs - WR.DO",
  description: "List and manage records.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Manage&nbsp;Short&nbsp;URLs"
        text="List and manage short urls."
        link="/docs/short-urls"
        linkText="short urls."
      />
      <Tabs defaultValue="Links">
        <TabsList>
          <TabsTrigger value="Links">Links</TabsTrigger>
          <TabsTrigger value="Realtime">Realtime</TabsTrigger>
        </TabsList>

        <TabsContent value="Links">
          <UserUrlsList
            user={{
              id: user.id,
              name: user.name || "",
              apiKey: user.apiKey || "",
              role: user.role,
              team: user.team,
            }}
            action="/api/url"
          />
          <LiveLog admin={false} />
          <ApiReference
            badge="POST /api/v1/short"
            target="creating short urls"
            link="/docs/short-urls#api-reference"
          />
        </TabsContent>
        <TabsContent value="Realtime">
          <Globe />
        </TabsContent>
      </Tabs>
    </>
  );
}
