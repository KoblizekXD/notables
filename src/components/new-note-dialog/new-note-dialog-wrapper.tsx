"use client";

import { useState } from "react";
import { NewNoteDialog } from "./new-note-dialog";

interface NewNoteDialogWrapperProps {
  triggerComponent?: React.ReactNode;
}

export function NewNoteDialogWrapper({
  triggerComponent,
}: NewNoteDialogWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {triggerComponent && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          tabIndex={0}>
          {triggerComponent}
        </button>
      )}
      <NewNoteDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
