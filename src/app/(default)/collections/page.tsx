import PublicCollectionsPage from "@/components/collections/public-collections-page";
import { getAllPublicCollections } from "@/lib/actions";

export default async function CollectionsPage() {
  const initialCollections = await getAllPublicCollections();

  return (
    <main className="flex flex-col items-center w-full min-h-screen">
      <div className="flex flex-col w-full max-w-6xl p-6 my-8">
        <PublicCollectionsPage initialCollections={initialCollections} />
      </div>
    </main>
  );
}
