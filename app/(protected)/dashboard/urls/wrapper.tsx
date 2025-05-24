"use client";

import { useState } from "react";
import { User } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiReference from "@/components/shared/api-reference";

import Globe from "./globe";
import LiveLog from "./live-logs";
import UserUrlsList from "./url-list";

export function Wrapper({
  user,
}: {
  user: Pick<User, "id" | "name" | "apiKey" | "role" | "team">;
}) {
  const [tab, setTab] = useState("Links");
  return (
    <Tabs
      value={tab}
      onChangeCapture={(e) => console.log(e)}
      defaultValue={tab}
    >
      <TabsList>
        <TabsTrigger value="Links" onClick={() => setTab("Links")}>
          Links
        </TabsTrigger>
        <TabsTrigger value="Realtime" onClick={() => setTab("Realtime")}>
          Realtime
        </TabsTrigger>
      </TabsList>
      )
      <TabsContent className="space-y-3" value="Links">
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
  );
}
