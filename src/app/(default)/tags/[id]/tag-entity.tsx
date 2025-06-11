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
import { getEntitiesByTagIdWithDetails } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "better-auth";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function PaginatedTagEntityPreview({
  limit = 10,
  tagId,
}: {
  limit?: number;
  tagId: string;
}) {
  const queryParams = useSearchParams();
  const page = queryParams.get("page")
    ? Number.parseInt(queryParams.get("page") as string)
    : 1;
  const type = queryParams.get("type") || "all";
  const filter = queryParams.get("filter") || "";

  const entityQuery = useQuery({
    queryKey: ["tagEntities", tagId, page, limit],
    queryFn: async () => {
      return await getEntitiesByTagIdWithDetails({
        tagId,
        limit,
        offset: (page - 1) * limit,
      });
    },
  });

  return (
    <div className="flex flex-col justify-center gap-y-4">
      {entityQuery.isLoading ? (
        <div className="flex items-center gap-x-2 justify-center">
          <LoaderCircle className="animate-spin" />
          Loading entities...
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          {entityQuery.data?.length === 0 ? (
            <p className="text-muted-foreground">
              No entities found for this tag.
            </p>
          ) : (
            entityQuery.data?.map((entity) => (
              <div
                key={entity.entityId}
                className="p-4 border flex justify-center items-center rounded-lg bg-background w-1/2"
              >
                <div className="flex flex-col gap-y-0.5">
                  {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                  <h2>{(entity as any).entity.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {capitalizeFirstLetter(entity.entityType)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-x-2">
                  <LinkingButton
                    variant="link"
                    size="icon"
                    href={
                      entity.entityType === "author"
                        ? `/authors/${entity.entityId}`
                        : entity.entityType === "work"
                        ? `/works/${entity.entityId}`
                        : `/notes/${entity.entityId}`
                    }
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
