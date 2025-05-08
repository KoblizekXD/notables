import { getRecentNotes, type Note } from "@/db/notes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { user } from "@/db/schema";
import DraggableScroll from "./draggable-scroll";

const RecentNoteTemplate = ({ singleNote }: { singleNote: Note }) => {
  return (
    <div className="w-3xs h-32 max-w-xs bg-card rounded-xl box-border shadow-md p-4 border border-border select-none">
      <h1 className="md:text-lg font-semibold text-foreground">
        {singleNote.title}
      </h1>
      <p className="text-sm md:text-md text-foreground">{singleNote.content}</p>
    </div>
  );
};

const RecentNotes = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const recentNotes = await getRecentNotes(
    session?.user.id as unknown as typeof user.id,
    10,
  );
  return (
    <DraggableScroll className="flex flex-row w-full gap-2 md:gap-4 lg:gap-6 xl:gap-8 overflow-x-auto overflow-y-hidden py-2 px-2">
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
      {recentNotes.map((singleNote) => (
        <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
      ))}
    </DraggableScroll>
  );
};

export default RecentNotes;
