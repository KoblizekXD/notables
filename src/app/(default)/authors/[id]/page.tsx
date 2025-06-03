import { getAuthor } from "@/lib/actions";

export default async function AuthorPage({
  params
}: {
  params: Promise<{ id: string; }>
}) {
  const id = (await params).id;
  const author = await getAuthor(id);
  return (
    <main className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col p-6 shadow-xl w-3/4 mt-24  border-border border">
        <h1 className="text-3xl font-header">{author?.name}</h1>
      </div>
    </main>
  )
}