"use client";

import { NewNoteDialog } from "@/components/new-note-dialog/new-note-dialog";
import CreateButton from "@/components/ui/create-button";
import { getUserCollections } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { FileText, LibraryBig } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CollectionCard from "./collection-card";
import CollectionDialog from "./collection-dialog";
interface UserCollection {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CollectionsDashboardProps {
  userId: string;
  initialCollections?: UserCollection[];
  limit?: number;
  showCreateButton?: boolean;
}

export default function CollectionsDashboard({
  userId,
  initialCollections,
  limit = 3,
  showCreateButton = true,
}: CollectionsDashboardProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<UserCollection | null>(null);

  const {
    data: collections = initialCollections || [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-collections", userId],
    queryFn: () => getUserCollections(userId),
    enabled: !!userId && !initialCollections,
    initialData: initialCollections,
  });

  const handleCreateSuccess = () => {
    refetch();
  };

  const handleEditSuccess = () => {
    refetch();
    setEditDialogOpen(false);
    setEditingCollection(null);
  };

  const handleEdit = (collection: UserCollection) => {
    setEditingCollection(collection);
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    refetch();
  };

  const displayCollections = collections.slice(0, limit);

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

  if (isLoading && !initialCollections) {
    return (
      <div className="rounded-lg border p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Collections</h2>
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Collections
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Collections are a powerful way to organize your notes. Group related
            notes together, share them with others, and keep your knowledge
            structured and accessible.
          </p>
        </div>
        {showCreateButton && (
          <CreateButton
            label="Create new"
            options={createOptions}
            className="shrink-0"
          />
        )}
      </div>

      {collections.length === 0 ? (
        <div className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <LibraryBig className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">New here?</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Collections are a powerful way to organize your notes. Group
                related notes together, share them with others, and keep your
                knowledge structured and accessible.
              </p>
            </div>
            {showCreateButton && (
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
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {collections.length > limit && (
            <div className="text-center pt-4">
              <Link
                href={`/profile/${userId}/collections`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                View all collections ({collections.length})
              </Link>
            </div>
          )}
        </>
      )}

      <CollectionDialog
        mode="create"
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {editingCollection && (
        <CollectionDialog
          mode="edit"
          collection={editingCollection}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      <NewNoteDialog
        open={newNoteDialogOpen}
        onOpenChange={setNewNoteDialogOpen}
      />
    </div>
  );
}
