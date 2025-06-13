"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCollection } from "@/lib/actions";
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CollectionCardProps {
  collection: CollectionCardData;
  showActions?: boolean;
  onEdit?: (collection: CollectionCardData) => void;
  onDelete?: (collectionId: string) => void;
}

export default function CollectionCard({
  collection,
  showActions = false,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCollection(collection.id);
        toast.success("Collection deleted successfully");
        onDelete?.(collection.id);
      } catch (error) {
        toast.error("Failed to delete collection");
        console.error("Error deleting collection:", error);
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

  return (
    <>
      <Link
        href={`/collection/${collection.id}`}
        className="space-y-3 relative z-10 group rounded-lg border p-4 group-hover:shadow-md transition-all duration-200 group-hover:border-primary/20 group ">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {collection.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={collection.public ? "default" : "secondary"}
                className="text-xs">
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
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative z-20"
                  disabled={isPending}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit?.(collection);
                  }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteDialogOpen(true);
                  }}
                  className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {collection.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {collection.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(collection.updatedAt)}</span>
          </div>
        </div>
      </Link>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Collection"
        description={`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isPending}
      />
    </>
  );
}
