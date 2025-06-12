import { Badge } from "@/components/ui/badge";
import { getAuthor } from "@/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PaginatedNotePreview } from "./note-renderer";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const author = await getAuthor(id);
  if (!author) {
    redirect("/home");
  }
  return (
    <main className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col p-6 shadow-xl w-3/4 my-24  border-border border">
        <h1 className="text-3xl font-header flex items-center gap-x-2">
          {author.name}
        </h1>
        <div className="flex mb-2 flex-wrap gap-2">
          {author.taggedEntities
            .map((te) => te.tag)
            .map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.id}`}>
                <Badge className="font-[Inter] bg-foreground hover:bg-foreground/50 transition-colors text-background">
                  {tag.name}
                </Badge>
              </Link>
            ))}
        </div>
        <PaginatedNotePreview authorId={author.id} />
      </div>
    </main>
  );
}
