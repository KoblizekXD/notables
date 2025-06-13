"use client";

import { LibraryBig } from "lucide-react";
import { useState } from "react";
import CollectionCard from "./collection-card";
import CollectionDialog from "./collection-dialog";
interface CollectionListData {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CollectionListProps {
  collections: CollectionListData[];
}

export default function CollectionList({ collections }: CollectionListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<CollectionListData | null>(null);
  const handleEdit = (collection: CollectionListData) => {
    setEditingCollection(collection);
    setEditDialogOpen(true);
  };
  const handleEditSuccess = () => {
    setEditingCollection(null);
    // Edit success is handled by the dialog component with toast notification
    // No need to reload the page
  };
  const handleDelete = () => {
    // Delete success is handled by the card component with toast notification
    // No need to reload the page
  };

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <LibraryBig className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            No collections yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Create your first collection to start organizing your notes and
            sharing your knowledge with others.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingCollection && (
        <CollectionDialog
          mode="edit"
          collection={editingCollection}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
