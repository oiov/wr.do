import { constructMetadata } from "@/lib/utils";
import Comment from "@/components/shared/comment";

export const metadata = constructMetadata({
  title: "Feedback",
  description: "Help us do better",
});

export default async function Page() {
  return <Comment />;
}
