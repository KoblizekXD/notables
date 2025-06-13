import CollectionsDashboard from "@/components/collections/collections-dashboard-unified";
import CreateCollectionButton from "@/components/collections/create-collection-button";
import RecentNotes from "@/components/home/home-recent-notes";
import PopularCollections from "@/components/home/popular-collections";
import type { user } from "@/db/schema";
import {
  getMostLikedNotes,
  getPublicNewestCollections,
  getUserCollections,
} from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const recentNotes = session?.user.id
    ? await getMostLikedNotes(session.user.id as unknown as typeof user.id, 10)
    : [];

  const popularCollections = await getPublicNewestCollections(4);

  const userCollections = session?.user.id
    ? await getUserCollections(session.user.id)
    : [];

  return (
    <div className="m-3 sm:m-4 md:m-5">
      <div className="flex flex-col w-full lg:max-w-4xl xl:max-w-7xl mx-auto gap-8">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-left">Recent notes</h1>
          <div className="flex gap-4 overflow-x-auto p-1">
            <RecentNotes notes={recentNotes} />
          </div>
        </div>

        {session?.user.id && (
          <div>
            <CollectionsDashboard
              userId={session.user.id}
              initialCollections={userCollections}
            />
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-left">
              Public newest collections
            </h1>
            <Link
              href="/collections"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
              View all collections
            </Link>
          </div>
          <div className="p-1">
            <div className="w-full flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border shadow-sm">
              <CreateCollectionButton />
              <PopularCollections collections={popularCollections} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
