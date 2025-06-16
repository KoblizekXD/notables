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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addNoteToCollection, getUserNotes } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Plus, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddNotesDialogProps {
  collectionId: string;
  collectionName: string;
  existingNoteIds: string[];
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddNotesDialog({
  collectionId,
  collectionName,
  existingNoteIds,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: AddNotesDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);

  // Fetch user's notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["user-notes", userId],
    queryFn: () => getUserNotes(userId, 100),
    enabled: !!userId && open,
  });

  // Filter notes based on search query and exclude already added notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const notAlreadyAdded = !existingNoteIds.includes(note.id);
    return matchesSearch && notAlreadyAdded;
  });

  const handleNoteToggle = (noteId: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const handleSelectAll = () => {
    if (selectedNoteIds.length === filteredNotes.length) {
      setSelectedNoteIds([]);
    } else {
      setSelectedNoteIds(filteredNotes.map((note) => note.id));
    }
  };

  const handleAddNotes = async () => {
    if (selectedNoteIds.length === 0) {
      toast.error("Please select at least one note to add");
      return;
    }

    startTransition(async () => {
      try {
        const results = await Promise.all(
          selectedNoteIds.map((noteId) =>
            addNoteToCollection(collectionId, noteId),
          ),
        );

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;

        if (successCount > 0) {
          toast.success(
            `Added ${successCount} note${
              successCount > 1 ? "s" : ""
            } to collection`,
          );
        }

        if (failureCount > 0) {
          toast.error(
            `Failed to add ${failureCount} note${failureCount > 1 ? "s" : ""}`,
          );
        }

        if (successCount > 0) {
          onSuccess?.();
          onOpenChange(false);
          setSelectedNoteIds([]);
          setSearchQuery("");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setSelectedNoteIds([]);
      setSearchQuery("");
      onOpenChange(false);
    }
  };

  const getEntityBadge = (entityType: string) => {
    switch (entityType) {
      case "author":
        return <Badge variant="secondary">Author Note</Badge>;
      case "work":
        return <Badge variant="secondary">Work Note</Badge>;
      default:
        return <Badge variant="outline">Note</Badge>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Add Notes to Collection</DialogTitle>
          <DialogDescription className="text-sm">
            Add notes to "{collectionName}" collection. Notes already in this
            collection are filtered out.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  filteredNotes.length > 0 &&
                  selectedNoteIds.length === filteredNotes.length
                }
                onChange={handleSelectAll}
                disabled={isPending || filteredNotes.length === 0}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                Select all ({filteredNotes.length} notes)
              </span>
            </div>
            {selectedNoteIds.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedNoteIds.length} selected
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No notes found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No notes match your search criteria."
                    : "You don't have any notes that can be added to this collection."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                {filteredNotes.map((note) => (
                  <button
                    type="button"
                    key={note.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer w-full"
                    onClick={() => handleNoteToggle(note.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNoteToggle(note.id);
                      }
                    }}
                    tabIndex={0}>
                    <input
                      type="checkbox"
                      checked={selectedNoteIds.includes(note.id)}
                      onChange={() => handleNoteToggle(note.id)}
                      disabled={isPending}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">
                          {note.title || "Untitled"}
                        </h4>
                        {getEntityBadge(note.entityType)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {(() => {
                          try {
                            const content = JSON.parse(note.content);
                            if (Array.isArray(content) && content.length > 0) {
                              const firstSegment = content[0];
                              if (firstSegment?.content) {
                                return `${firstSegment.content.substring(
                                  0,
                                  100,
                                )}...`;
                              }
                            }
                            return "No content preview available";
                          } catch {
                            return `${note.content.substring(0, 100)}...`;
                          }
                        })()}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Updated {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleAddNotes}
            disabled={selectedNoteIds.length === 0 || isPending}
            className="min-w-[120px]">
            {isPending ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add{" "}
                {selectedNoteIds.length > 0 ? `${selectedNoteIds.length} ` : ""}
                Note{selectedNoteIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
