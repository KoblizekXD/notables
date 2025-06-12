"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface NoteTitleInputProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export function NoteTitleInput({ title, onTitleChange }: NoteTitleInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
    </div>
  );
}
