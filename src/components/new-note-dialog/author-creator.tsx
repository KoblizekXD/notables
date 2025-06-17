"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AuthorCreatorProps {
  newAuthorName: string;
  onAuthorNameChange: (name: string) => void;
}

export function AuthorCreator({
  newAuthorName,
  onAuthorNameChange,
}: AuthorCreatorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="new-author-name">Author Name</Label>
      <Input
        id="new-author-name"
        placeholder="Enter author name (e.g., Karel Erben)"
        value={newAuthorName}
        onChange={(e) => onAuthorNameChange(e.target.value)}
      />
    </div>
  );
}
