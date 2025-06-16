"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addNoteToCollection, getUserCollections } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Check, LibraryBig, LoaderCircle, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddToCollectionButtonProps {
  noteId: string;
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function AddToCollectionButton({
  noteId,
  userId,
  variant = "outline",
  size = "sm",
  className,
}: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [addedCollections, setAddedCollections] = useState<Set<string>>(
    new Set(),
  );

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["user-collections", userId],
    queryFn: () => getUserCollections(userId),
    enabled: !!userId && open,
  });

  const handleAddToCollection = async (
    collectionId: string,
    collectionName: string,
  ) => {
    startTransition(async () => {
      try {
        const result = await addNoteToCollection(collectionId, noteId);

        if (result.success) {
          toast.success(`Added to "${collectionName}"`);
          setAddedCollections((prev) => new Set([...prev, collectionId]));
        } else {
          if (result.error?.includes("already in this collection")) {
            toast.info(`Note is already in "${collectionName}"`);
            setAddedCollections((prev) => new Set([...prev, collectionId]));
          } else {
            toast.error(result.error || "Failed to add to collection");
          }
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setAddedCollections(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Collection
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Choose which collections to add this note to.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                  <div className="w-20 h-8 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LibraryBig className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No collections yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first collection to start organizing your notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((collection) => {
                const isAdded = addedCollections.has(collection.id);

                return (
                  <button
                    type="button"
                    key={collection.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() =>
                      !isAdded &&
                      !isPending &&
                      handleAddToCollection(collection.id, collection.name)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!isAdded && !isPending) {
                          handleAddToCollection(collection.id, collection.name);
                        }
                      }
                    }}
                    tabIndex={0}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">
                          {collection.name}
                        </h4>
                        <Badge
                          variant={collection.public ? "default" : "secondary"}
                          className="text-xs">
                          {collection.public ? "Public" : "Private"}
                        </Badge>
                      </div>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>

                    <div className="ml-3 flex items-center">
                      {isPending ? (
                        <LoaderCircle className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : isAdded ? (
                        <div className="flex items-center text-green-600">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Added</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <Plus className="w-4 h-4 mr-1" />
                          <span className="text-sm">Add</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
