"use client";

import { useState } from "react";
import CollectionDialog from "./collection-dialog";

export default function CreateCollectionButton() {
  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);
  return (
    <>
      <button
        type="button"
        className="group relative shadow-md hover:shadow-xl select-none hidden md:flex flex-col w-full h-84 bg-gradient-to-t from-green-800/90 via-green-400 to-purple-600 bg-[length:100%_200%] bg-[position:0%_10%] hover:bg-[position:0%_90%] transition-all duration-1000 ease-out rounded-lg max-w-[256px] p-4 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => setCreateCollectionDialogOpen(true)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setCreateCollectionDialogOpen(true);
          }
        }}>
        <div className="absolute top-4 left-4 w-4 h-4 bg-background rounded-full border border-border group-hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
        <div className="mt-auto transform transition-transform duration-[1200ms] group-hover:-translate-y-48 ease-out h-auto overflow-hidden">
          <h1 className="text-2xl text-white font-bold">Create collection</h1>
          <div className="my-2 flex flex-col">
            <p className="text-white leading-tight">
              Want to make your own? Let's get right to it
            </p>
          </div>
        </div>
      </button>

      <CollectionDialog
        mode="create"
        open={createCollectionDialogOpen}
        onOpenChange={setCreateCollectionDialogOpen}
        onSuccess={() => {}}
      />
    </>
  );
}
