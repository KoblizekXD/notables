"use client";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Collection } from "@/db/types";
import { createCollection, updateCollection } from "@/lib/actions";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface CollectionDialogProps {
  mode: "create" | "edit";
  collection?: Partial<Collection>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CollectionDialog({
  mode,
  collection,
  open,
  onOpenChange,
  onSuccess,
}: CollectionDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    isPublic: collection?.public || false,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setFormData({
        name: collection?.name || "",
        description: collection?.description || "",
        isPublic: collection?.public || false,
      });
      setErrors({});
    }
  }, [open, collection]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Collection name is required";
    else if (formData.name.trim().length > 100)
      newErrors.name = "Collection name cannot exceed 100 characters";
    if (formData.description && formData.description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        let result: { success: boolean; error?: string; collectionId?: string };
        if (mode === "create")
          result = await createCollection(
            formData.name,
            formData.description || undefined,
            formData.isPublic,
          );
        else if (collection)
          result = await updateCollection(
            collection.id as string,
            formData.name,
            formData.description || undefined,
            formData.isPublic,
          );
        else
          result = {
            success: false,
            error: "No collection provided for update",
          };

        if (result?.success) {
          toast.success(
            mode === "create"
              ? "Collection created successfully"
              : "Collection updated successfully",
          );
          onOpenChange(false);
          onSuccess?.();
          // No need to refresh the router - parent components handle state updates
        } else toast.error(result?.error || "An unexpected error occurred");
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const isFormValid =
    formData.name.trim().length > 0 && Object.keys(errors).length === 0;

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(isPending)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Collection" : "Edit Collection"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new collection to organize your notes."
              : "Update your collection details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              placeholder="Enter collection name"
              className={errors.name ? "border-destructive" : ""}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.name.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: undefined });
                }
              }}
              placeholder="Describe your collection (optional)"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublic: checked })
              }
              disabled={isPending}
            />
            <Label htmlFor="public" className="text-sm font-medium">
              Make this collection public
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Public collections can be viewed by anyone and may appear in search
            results.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(isPending)}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isPending}
              className="min-w-[120px]">
              {isPending ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Collection"
              ) : (
                "Update Collection"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
