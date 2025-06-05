import { getTag } from "@/lib/actions";
import { redirect } from "next/navigation";
import { PaginatedTagEntityPreview } from "./tag-entity";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const tag = await getTag(id);
  if (!tag) {
    redirect("/home");
  }
  return (
    <main className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col p-6 shadow-xl w-3/4 my-24  border-border border">
        <h1 className="text-3xl font-header flex items-center gap-x-2">
          Tag: {tag.name}
        </h1>
        <h2>Entities related to this tag:</h2>
        <PaginatedTagEntityPreview tagId={tag.id} />
      </div>
    </main>
  );
}
