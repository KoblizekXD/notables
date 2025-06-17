"use client";

import { NewNoteDialog } from "@/components/new-note-dialog/new-note-dialog";
import CreateButton from "@/components/ui/create-button";
import { FileText, LibraryBig } from "lucide-react";
import { useState } from "react";
import CollectionDialog from "../collections/collection-dialog";
import CollectionList from "../collections/collection-list";
interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CollectionsPageClientProps {
  initialCollections: CollectionData[];
}

export default function CollectionsPageClient({
  initialCollections,
}: CollectionsPageClientProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false);

  const handleCreateSuccess = () => {
    // Collection creation success is handled by the dialog component
    // No need to reload the page - the dialog will close and show success toast
  };

  const createOptions = [
    {
      label: "New Collection",
      icon: LibraryBig,
      onClick: () => setCreateDialogOpen(true),
    },
    {
      label: "New Note",
      icon: FileText,
      onClick: () => setNewNoteDialogOpen(true),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="  rounded-lg border p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              My Collections
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Organize your notes into collections for easy access and sharing.
              Create public collections to share your knowledge with others, or
              keep them private for personal organization.
            </p>
          </div>
          <CreateButton
            label="Create new"
            options={createOptions}
            className="shrink-0"
          />
        </div>
      </div>

      {initialCollections.length === 0 ? (
        <div className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <LibraryBig className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">New here?</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Create your first collection to start organizing your notes.
                Collections help you group related notes together and share them
                with others.
              </p>
            </div>
            <CreateButton
              label="Create your first collection"
              options={[
                {
                  label: "New Collection",
                  icon: LibraryBig,
                  onClick: () => setCreateDialogOpen(true),
                },
              ]}
            />
          </div>
        </div>
      ) : (
        <CollectionList collections={initialCollections} />
      )}

      <CollectionDialog
        mode="create"
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <NewNoteDialog
        open={newNoteDialogOpen}
        onOpenChange={setNewNoteDialogOpen}
      />
    </div>
  );
}
