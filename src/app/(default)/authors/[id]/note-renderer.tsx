"use client";

import LinkingButton from "@/components/linking-button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAuthorNotes } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function PaginatedNotePreview({
  limit = 10,
  authorId,
}: {
  limit?: number;
  authorId: string;
}) {
  const queryParams = useSearchParams();
  const page = queryParams.get("page")
    ? Number.parseInt(queryParams.get("page") as string)
    : 1;
  const noteQuery = useQuery({
    queryKey: ["notes", page],
    queryFn: async () => {
      const notes = await getAuthorNotes(authorId, limit, limit * (page - 1));
      return notes;
    },
  });

  return (
    <div className="flex flex-col justify-center gap-y-4">
      {noteQuery.isLoading ? (
        <div className="flex items-center gap-x-2 justify-center">
          <LoaderCircle className="animate-spin" />
          Loading notes...
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          {noteQuery.data?.length === 0 ? (
            <p className="text-muted-foreground">
              No notes found for this author.
            </p>
          ) : (
            noteQuery.data?.map((note) => (
              <div
                key={note.id}
                className="p-4 border flex justify-center items-center rounded-lg bg-background w-1/2"
              >
                <div className="flex flex-col gap-y-0.5">
                  <h2>{note.title}</h2>
                  <p className="text-sm text-muted-foreground">Written by: {note.username}</p>
                </div>
                <div className="ml-auto flex items-center gap-x-2">
                  <p className="text-sm text-muted-foreground">
                    Last updated at{" "}
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                  <LinkingButton
                    variant="link"
                    size="icon"
                    href={`/notes/${note.id}`}
                  >
                    <ArrowRight />
                  </LinkingButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`?page=${page - 1}`} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={"?page=1"}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
