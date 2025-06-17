import { EditorContextProvider } from "@/components/note/editor-context";
import SegmentPreviewer from "@/components/note/segment-previewer";
import { getNote } from "@/lib/actions";
import "katex/dist/katex.min.css";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  if (id === "new") redirect("/home");
  const note = await getNote(id);
  if (!note) redirect("/home");
  const description =
    note.note.entityType === "author" ? note.author?.name : note.work?.title;
  const href =
    note.note.entityType === "author"
      ? `/authors/${note.author?.id}`
      : `/works/${note.work?.id}`;

  return (
    <EditorContextProvider
      id={id}
      mode="preview"
      existingSegments={JSON.parse(note?.note.content || "[]")}>
      <div className="min-h-screen items-center w-full flex flex-col">
        <div className="backdrop-blur-md top-0 w-full grid grid-cols-2 px-4">
          <div className="w-fit font-[Poppins] pl-1 pt-1 flex flex-col">
            <h1 className="text-2xl font-[600]">{note?.note.title}</h1>
            <Link
              target="_blank"
              href={href}
              className="text-muted-foreground flex items-center gap-x-1 underline font-semibold">
              {description}
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
        <SegmentPreviewer />
        <div className="border-t bottom-0 w-full z-50 grid grid-cols-2 px-4 py-4 bg-background">
          <div className="flex items-center gap-x-2">
            <h2>Updated at {note.note.updatedAt.toLocaleString()}</h2>
            <span className="text-muted-foreground text-sm">
              {note.note.id}
            </span>
          </div>
          <h2 className="text-right">
            Created by{" "}
            <Link
              href={`/profile/${note.user.id}`}
              className="text-primary underline font-semibold">
              {note.user.name}
            </Link>
          </h2>
        </div>
      </div>
    </EditorContextProvider>
  );
}
