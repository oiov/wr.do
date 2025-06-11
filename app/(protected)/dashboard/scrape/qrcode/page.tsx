import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import ApiReference from "@/components/shared/api-reference";
import QRCodeEditor from "@/components/shared/qr";

import { CodeLight } from "../scrapes";

export const metadata = constructMetadata({
  title: "Url to QR Code API",
  description: "Generate QR Code from URL",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Url to QR Code"
        text="Generate QR Code from URL"
        link="/docs/open-api/qrcode"
        linkText="QR Code API"
      />
      <ApiReference
        badge="GET /api/v1/scraping/qrcode"
        target="extracting url as QR code"
        link="/docs/open-api/qrcode"
      />
      <CodeLight content={`https://wr.do/api/v1/scraping/qrcode`} />
      <QRCodeEditor
        user={{ id: user.id, apiKey: user.apiKey || "", team: user.team }}
        url="https://github.com/oiov"
      />
    </>
  );
}
