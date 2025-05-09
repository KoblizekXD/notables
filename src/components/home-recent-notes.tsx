import { type Note, getMostLikedNotes } from "@/db/fetch";
import type { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DraggableScroll from "./draggable-scroll";

const RecentNoteTemplate = ({ singleNote }: { singleNote: Note }) => {
  return (
    <div className=" overflow-hidden group hover:scale-105 w-4xs h-32 max-w-xs bg-input/10 hover:bg-input/40 rounded-xl box-border hover:shadow-md shadow transition-all duration-300 py-4 px-6 border border-border select-none ">
      <div className="md:text-lg font-semibold text-foreground w-auto relative truncate">
        {singleNote.title}
        <span className="absolute bottom-0 left-0 h-0.5 bg-foreground w-0 transition-all duration-300 group-hover:w-full" />
      </div>
      <p className="mt-2 text-sm text-foreground leading-tight">
        {singleNote.content}
      </p>
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
    <DraggableScroll className="h-38 flex flex-row w-full gap-2 md:gap-4 lg:gap-6 xl:gap-8 overflow-x-auto overflow-y-hidden p-3">
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
