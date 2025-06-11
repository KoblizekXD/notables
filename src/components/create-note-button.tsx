"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NewNoteDialog } from "./new-note-dialog/new-note-dialog";

export function CreateNoteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="group bg-foreground text-background py-2 px-3 rounded-lg cursor-pointer relative overflow-hidden"
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 bg-primary w-0 transition-[width] duration-500 group-hover:w-full rounded-lg" />
        <div className="relative inline-flex items-center text-lg z-10">
          <span className="relative mb-0.5">
            <span className="flex items-center gap-2 font-semibold">
              Create new notes
              <Plus className="transition-transform rotate-0 group-hover:rotate-90 duration-400 ease-out" />
            </span>
            <span className="absolute -bottom-0.5 left-0 h-0.5 bg-background w-0 transition-[width] duration-500 group-hover:w-full rounded-xl" />
          </span>
        </div>
      </div>
      <NewNoteDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
