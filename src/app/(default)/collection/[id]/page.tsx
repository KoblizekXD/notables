import CollectionDetailClient from "@/components/collections/collection-detail-client";
import { getCollection } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const collection = await getCollection(id);
  if (!collection) redirect("/home");
  const canView = collection.public || collection.authorId === session?.user.id;
  const isOwner = collection.authorId === session?.user.id;
  if (!canView) redirect("/home");
  return (
    <main className="flex flex-col items-center w-full min-h-screen">
      <div className="flex flex-col w-full max-w-6xl p-6 my-8">
        <CollectionDetailClient
          collection={collection}
          isOwner={isOwner}
          userId={session?.user.id}
        />
      </div>
    </main>
  );
}
