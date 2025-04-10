import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>POST /api/v1/email</Badge>
        <div className="mt-2">
          We provide a simple API for creating emails. See usage instructions at{" "}
          <Link
            href={"/docs/emails#api-reference"}
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
