"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeNoteFromCollection } from "@/lib/actions";
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CollectionNote {
  note: {
    id: string;
    title: string | null;
    content: string;
    entityType: "author" | "work" | "note";
    entityId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

interface CollectionNotesProps {
  collectionId: string;
  notes: CollectionNote[];
  isOwner: boolean;
  onAddNotes?: () => void;
}

export default function CollectionNotes({
  collectionId,
  notes,
  isOwner,
  onAddNotes,
}: CollectionNotesProps) {
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [noteToRemove, setNoteToRemove] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleRemoveNoteClick = (noteId: string, noteTitle: string) => {
    setNoteToRemove({ id: noteId, title: noteTitle || "Untitled" });
    setRemoveDialogOpen(true);
  };

  const handleRemoveNoteConfirm = async () => {
    if (!noteToRemove) return;
    setRemovingId(noteToRemove.id);
    startTransition(async () => {
      try {
        const result = await removeNoteFromCollection(
          collectionId,
          noteToRemove.id,
        );
        if (result.success) {
          toast.success("Note removed from collection");
          // No need to refresh router - the note removal is handled with toast notification
        } else toast.error(result.error || "Failed to remove note");
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setRemovingId(null);
        setNoteToRemove(null);
      }
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(({ note }) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    <Link
                      href={`/notes/${note.id}`}
                      className="hover:underline">
                      {note.title || "Untitled"}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getEntityBadge(note.entityType)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/notes/${note.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>

                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isPending && removingId === note.id}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleRemoveNoteClick(
                              note.id,
                              note.title || "Untitled",
                            )
                          }
                          className="text-destructive focus:text-destructive"
                          disabled={isPending && removingId === note.id}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove from collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={note.user.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {note.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {note.user.name}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                Updated {formatDate(note.updatedAt)}
              </div>
            </CardContent>
          </Card>
        ))}

        {isOwner && onAddNotes && (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Add More Notes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add more notes to this collection
              </p>
              <Button variant="outline" onClick={onAddNotes}>
                <Plus className="w-4 h-4 mr-2" />
                Add Notes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmationDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove Note from Collection"
        description={`Remove "${noteToRemove?.title}" from this collection?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleRemoveNoteConfirm}
        loading={isPending && removingId === noteToRemove?.id}
      />
    </>
  );
}
