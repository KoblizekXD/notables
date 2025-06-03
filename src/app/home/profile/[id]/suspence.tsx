import UserNote from "@/components/user-note";
import { capitalizeFirstLetter } from "better-auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SuspenseProfile({ notes }: { notes: Promise<{ id: string; title: string | null; entityType: string; createdAt: Date }[]> }) {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center w-full h-full gap-y-6">
                <Skeleton />
            </div>
        }>
            {(await notes).map((note) => (
                <UserNote key={note.id} title={note.title as string} entity={capitalizeFirstLetter(note.entityType)} createdAt={note.createdAt} rating={0} tags={["history", "ancient rome"]} />
            ))}
        </Suspense>
    );
}