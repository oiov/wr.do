import { constructMetadata } from "@/lib/utils";
import ChatRoom from "@/components/chat/chat-room";

export const metadata = constructMetadata({
  title: "WRoom",
  description: "A temporary, peer-to-peer, and secure chat room",
});

export default async function Page() {
  return <ChatRoom />;
}
