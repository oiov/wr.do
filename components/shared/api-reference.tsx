import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ApiReference({
  badge,
  target,
  link,
}: {
  badge: string;
  target: string;
  link: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>{badge}</Badge>
        <div className="mt-2">
          <span style={{ fontFamily: "Bahamas Bold" }}>BiuXin.COM</span> provide a
          api for {target}. View the usage tutorial document{" "}
          <Link
            href={link}
            target="_blank"
            className="font-semibold after:content-['_↗'] hover:text-blue-500 hover:underline"
          >
            here
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
