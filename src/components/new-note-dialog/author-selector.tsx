"use client";

import { Combobox, type ComboboxOption } from "../ui/combobox";
import { Label } from "../ui/label";

interface AuthorSelectorProps {
  selectedAuthor: string;
  onAuthorChange: (authorId: string) => void;
  authorOptions: ComboboxOption[];
  loadingAuthors: boolean;
}

export function AuthorSelector({
  selectedAuthor,
  onAuthorChange,
  authorOptions,
  loadingAuthors,
}: AuthorSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="author">Select Author</Label>
      <Combobox
        options={authorOptions}
        value={selectedAuthor}
        onValueChange={onAuthorChange}
        placeholder={
          loadingAuthors ? "Loading authors..." : "Select an author"
        }
        searchPlaceholder="Search authors..."
        emptyMessage="No authors found."
        disabled={loadingAuthors}
      />
    </div>
  );
}
