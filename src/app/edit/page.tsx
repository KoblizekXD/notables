import FloatingEditorMenu from "@/components/floating-editor-menu";
import SegmentEditor, {
  EditorContextProvider,
} from "@/components/segment-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { author, note, work } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { id } = await searchParams;
  if (!id || !session?.user.id) redirect("/home?error=note-not-found");
  const result = (await db.select().from(note).where(and(eq(note.id, id), eq(note.userId, session?.user.id)))
    .limit(1)
    .execute())[0];
  if (!result) redirect("/home?error=note-not-found");
  
  let description = "";
  let name = undefined;
  description = (await db.select({
    id: author.id,
    name: author.name
  }).from(author).where(eq(author.id, result.entityId)).execute())[0]?.name;
  if (result.entityType === "author") {
    name = description;
    description = "author";
  } else if (result.entityType === "work") {
    description += "'s work";
    name = (await db.select({
      title: work.title
    }).from(work).where(eq(work.authorId, result.entityId)).execute())[0].title;
  }

  return (
    <EditorContextProvider>
      <div className="min-h-screen items-center w-full flex flex-col">
        <div className="sticky backdrop-blur-md top-0 w-full z-50 grid grid-cols-3">
          <div className="w-fit font-[Poppins] pl-1 pt-1 flex flex-col">
            <h1 className="text-2xl font-[600]">{name}</h1>
            <h2 className="text-muted-foreground font-semibold">
              {description}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <FloatingEditorMenu />
          </div>
          <div className="flex items-start gap-x-3 justify-end p-2">
            <div className="select-none shadow-md border transition-colors hover:bg-muted bg-background cursor-pointer gap-x-12 text-sm rounded-full p-2 flex items-center">
              Search actions...
              <code className="flex items-center">
                <span className="text-xs text-muted-foreground">⌘</span>
                <span className="text-xs text-muted-foreground">K</span>
              </code>
            </div>
            <ThemeToggle />
            <Avatar className="w-[38px] h-[38px]">
              <AvatarImage src={session?.user.image || ""} />
              <AvatarFallback>
                {session?.user.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <SegmentEditor />
        <div className="fixed p-2 bottom-0 w-full z-50 bg-background backdrop-blur-md flex items-center">
          <h1 className="flex select-none font-[Poppins] items-center gap-x-1">
            <span className="">Made with </span>
            <span className="font-bold">え Notables</span>
          </h1>
          <div className="ml-auto flex items-center gap-x-2">
            <Button variant="outline">Show preview</Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </EditorContextProvider>
  );
}
