"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import type { Collection } from "@/db/types";
import { Calendar, Edit, Eye, EyeOff, Plus, User } from "lucide-react";
import { useState } from "react";
import AddNotesDialog from "./add-notes-dialog";
import CollectionDialog from "./collection-dialog";
import CollectionNotes from "./collection-notes";

interface CollectionWithRelations extends Collection {
  author?: {
    id: string;
    name: string;
    image: string | null;
  };
  collectionNotes?: Array<{
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
  }>;
}

interface CollectionDetailClientProps {
  collection: CollectionWithRelations;
  isOwner: boolean;
  userId?: string;
}

export default function CollectionDetailClient({
  collection,
  isOwner,
  userId,
}: CollectionDetailClientProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addNotesDialogOpen, setAddNotesDialogOpen] = useState(false);

  const handleEditSuccess = () => {
    // Edit success is handled by the dialog component with toast notification
    // No need to reload the page - the dialog will close automatically
  };

  const handleAddNotesSuccess = () => {
    // Add notes success is handled by the dialog component with toast notification
    // No need to reload the page - the dialog will close automatically
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant={collection.public ? "default" : "secondary"}>
              {collection.public ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>

          {collection.description && (
            <p className="text-muted-foreground mb-4 max-w-3xl">
              {collection.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Created by {collection.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(collection.updatedAt)}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setAddNotesDialogOpen(true)}
              disabled={!userId}>
              <Plus className="w-4 h-4 mr-2" />
              Add Notes
            </Button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Notes in this collection
        </h2>

        {collection.collectionNotes?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">No notes yet</CardTitle>
              <CardDescription className="mb-6 max-w-md">
                {isOwner
                  ? "This collection is empty. Add some notes to get started."
                  : "This collection doesn't contain any notes yet."}
              </CardDescription>
              {isOwner && (
                <Button
                  onClick={() => setAddNotesDialogOpen(true)}
                  disabled={!userId}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notes
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <CollectionNotes
            collectionId={collection.id}
            notes={collection.collectionNotes || []}
            isOwner={isOwner}
            onAddNotes={() => setAddNotesDialogOpen(true)}
          />
        )}
      </div>

      <CollectionDialog
        mode="edit"
        collection={{
          id: collection.id,
          name: collection.name,
          description: collection.description,
          public: collection.public,
        }}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {userId && (
        <AddNotesDialog
          collectionId={collection.id}
          collectionName={collection.name}
          existingNoteIds={(collection.collectionNotes || []).map(
            (cn) => cn.note.id,
          )}
          userId={userId}
          open={addNotesDialogOpen}
          onOpenChange={setAddNotesDialogOpen}
          onSuccess={handleAddNotesSuccess}
        />
      )}
    </>
  );
}
