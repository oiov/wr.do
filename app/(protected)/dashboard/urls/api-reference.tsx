import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ApiReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>POST /api/v1/short</Badge>
        <div className="mt-2">
          We provide a simple API for creating short URLs. See usage
          instructions at{" "}
          <Link
            href={"/docs/short-urls#api-reference"}
            target="_blank"
            className="font-semibold after:content-['_↗'] hover:text-blue-500 hover:underline"
          >
            api reference
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
