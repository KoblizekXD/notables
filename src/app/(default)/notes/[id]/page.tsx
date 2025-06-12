import { EditorContextProvider } from "@/components/editor-context";
import SegmentPreviewer from "@/components/segment-previewer";
import { getNote } from "@/lib/actions";
import { redirect } from "next/navigation";
import 'katex/dist/katex.min.css';

export default async function NotePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const note = await getNote(id);
  if (!note) {
    redirect("/home");
  }

  return (
    <EditorContextProvider
      id={id}
      mode="preview"
      existingSegments={JSON.parse(note?.note.content || "[]")}
    >
      <div className="min-h-screen items-center w-full flex flex-col">
        <div className="sticky backdrop-blur-md top-0 w-full z-50 grid grid-cols-2 px-4">
          <div className="w-fit font-[Poppins] pl-1 pt-1 flex flex-col">
            <h1 className="text-2xl font-[600]">{note?.note.title}</h1>
            <h2 className="text-muted-foreground font-semibold">
              {note.note.id || "No description available"}
            </h2>
          </div>
          <div className="text-right">
            Created by{" "}
            <span className="font-semibold">
              {note.user.name || "Unknown"}
            </span>
          </div>
        </div>
        <SegmentPreviewer />
      </div>
    </EditorContextProvider>
  );
}
