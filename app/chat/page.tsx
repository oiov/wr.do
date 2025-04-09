import { constructMetadata } from "@/lib/utils";
import ChatRoom from "@/components/chat/chat-room";

export const metadata = constructMetadata({
  title: "ChatRoom",
  description: "",
});

export default async function Page() {
  return <ChatRoom />;
}
