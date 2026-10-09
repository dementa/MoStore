import { notFound } from "next/navigation";
import { ChatInbox } from "@/components/ChatInbox";
import { getStore } from "@/lib/stores";

export const metadata = { title: "Messages" };

export default async function StoreMessagesPage({ params }: { params: Promise<{ store: string }> }) {
  const store = getStore((await params).store);
  if (!store) notFound();
  return <ChatInbox store={store} />;
}
