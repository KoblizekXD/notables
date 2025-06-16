import { Skeleton } from "@/components/ui/skeleton";
import UserNote from "@/components/user-note";
import { capitalizeFirstLetter } from "better-auth";
import { Suspense } from "react";

export default async function SuspenseProfile({
  notes,
}: {
  notes: Promise<
    { id: string; title: string | null; entityType: string; createdAt: Date }[]
  >;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-6">
          <Skeleton />
        </div>
      }>
      {(await notes).length === 0 ? (
        <div className="flex flex-col items-center justify-baseline w-full h-full gap-y-6 mb-5">
          <p className="text-2xl font-bold">User has no notes yet</p>
        </div>
      ) : (
        <div className="px-26 w-auto flex flex-col gap-y-3 items-start justify-baseline pb-3 mb-5">
          <h1 className="text-2xl font-bold">My notes:</h1>
          <div className="flex flex-wrap gap-2.5 pl-2 max-lg:w-auto ">
            {(await notes).map((note) => (
              // <UserNote key={note.id} title={note.title as string} entity={capitalizeFirstLetter(note.entityType)} createdAt={note.createdAt} rating={note.rating} tags={note.tags} />

              <UserNote
                key={note.id}
                title={note.title as string}
                entity={capitalizeFirstLetter(note.entityType)}
                createdAt={note.createdAt}
              />
            ))}
          </div>
        </div>
      )}
    </Suspense>
  );
}
