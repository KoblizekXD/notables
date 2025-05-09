import { type Note, getMostLikedNotes } from "@/db/fetch";
import type { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DraggableScroll from "./draggable-scroll";

const RecentNoteTemplate = ({ singleNote }: { singleNote: Note }) => {
  return (
    <div className="hover:scale-105 hover:shadow-lg w-4xs h-32 max-w-xs bg-input/10 hover:bg-input/40 rounded-xl box-border shadow-md transition-all duration-300 py-4 px-6 border border-border select-none">
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
  const recentNotes = await getMostLikedNotes(
    session?.user.id as unknown as typeof user.id,
    10,
  );
  return (
    <DraggableScroll className="h-38 flex flex-row w-full gap-2 md:gap-4 lg:gap-6 xl:gap-8 overflow-x-auto overflow-y-hidden p-2">
      {recentNotes.length > 0 ? (
        recentNotes.map((singleNote) => (
          <RecentNoteTemplate key={singleNote.id} singleNote={singleNote} />
        ))
      ) : (
        <div className="h-36 w-full flex flex-row justify-center items-center">
          <p className="text-center -mt-2 text-lg"> No recent notes</p>
        </div>
      )}
    </DraggableScroll>
  );
};

export default RecentNotes;
