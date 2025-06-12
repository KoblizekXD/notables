"use client";

import { Combobox, type ComboboxOption } from "../ui/combobox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface WorkCreatorProps {
  newWorkTitle: string;
  onWorkTitleChange: (title: string) => void;
  newWorkAuthor: string;
  onWorkAuthorChange: (authorId: string) => void;
  authorOptions: ComboboxOption[];
  loadingAuthors: boolean;
  isCreatingAuthor?: boolean;
  newAuthorName?: string;
}

export function WorkCreator({
  newWorkTitle,
  onWorkTitleChange,
  newWorkAuthor,
  onWorkAuthorChange,
  authorOptions,
  loadingAuthors,
  isCreatingAuthor = false,
  newAuthorName = "",
}: WorkCreatorProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="new-work-title">Work Title</Label>
        <Input
          id="new-work-title"
          placeholder="Enter work title (e.g., Kytice)"
          value={newWorkTitle}
          onChange={(e) => onWorkTitleChange(e.target.value)}
        />
      </div>
      {!isCreatingAuthor && (
        <div className="grid gap-2">
          <Label htmlFor="new-work-author">Author (Optional)</Label>
          <Combobox
            options={[{ value: "none", label: "No author" }, ...authorOptions]}
            value={newWorkAuthor}
            onValueChange={onWorkAuthorChange}
            placeholder={
              loadingAuthors
                ? "Loading authors..."
                : "Select an author or leave empty"
            }
            searchPlaceholder="Search authors..."
            emptyMessage="No authors found."
            disabled={loadingAuthors}
          />
        </div>
      )}
      {isCreatingAuthor && newAuthorName && (
        <div className="grid gap-2">
          <Label>Author</Label>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
            <span className="text-sm text-muted-foreground">
              Will use created author:
            </span>
            <span className="font-semibold">{newAuthorName}</span>
          </div>
        </div>
      )}
    </>
  );
}
