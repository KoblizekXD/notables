"use client";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import type { SelectionOptions } from "./types";

interface CreationModeSelectorProps {
  selectionOptions: SelectionOptions;
  onSelectionOptionsChange: (options: SelectionOptions) => void;
}

export function CreationModeSelector({
  selectionOptions,
  onSelectionOptionsChange,
}: CreationModeSelectorProps) {
  const toggleOption = (option: keyof SelectionOptions) => {
    const newOptions = { ...selectionOptions };
    newOptions[option] = !selectionOptions[option];
    if (
      (option === "selectAuthor" || option === "selectWork") &&
      newOptions[option]
    ) {
      newOptions.selectAuthor = option === "selectAuthor";
      newOptions.selectWork = option === "selectWork";
      newOptions.createAuthor = false;
      newOptions.createWork = false;
    } else if (option === "createAuthor" && newOptions.createAuthor) {
      newOptions.selectAuthor = false;
      newOptions.selectWork = false; // Prevent selectWork + createAuthor combination
    } else if (option === "createWork" && newOptions.createWork) {
      newOptions.selectWork = false;
    } else if (option === "selectWork" && newOptions.selectWork) {
      newOptions.createAuthor = false; // Prevent selectWork + createAuthor combination
    }
    onSelectionOptionsChange(newOptions);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label>Choose your options (optional):</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectionOptions.selectAuthor ? "default" : "outline"}
            onClick={() => toggleOption("selectAuthor")}
            className="h-auto py-3 px-4">
            <div className="text-center">
              <div className="font-semibold">Select Author</div>
              <div className="text-xs opacity-75">Choose existing</div>
            </div>
          </Button>
          <Button
            type="button"
            variant={selectionOptions.selectWork ? "default" : "outline"}
            onClick={() => toggleOption("selectWork")}
            className="h-auto py-3 px-4">
            <div className="text-center">
              <div className="font-semibold">Select Work</div>
              <div className="text-xs opacity-75">Choose existing</div>
            </div>
          </Button>
          <Button
            type="button"
            variant={selectionOptions.createAuthor ? "default" : "outline"}
            onClick={() => toggleOption("createAuthor")}
            className="h-auto py-3 px-4">
            <div className="text-center">
              <div className="font-semibold">Create Author</div>
              <div className="text-xs opacity-75">Make new</div>
            </div>
          </Button>
          <Button
            type="button"
            variant={selectionOptions.createWork ? "default" : "outline"}
            onClick={() => toggleOption("createWork")}
            className="h-auto py-3 px-4">
            <div className="text-center">
              <div className="font-semibold">Create Work</div>
              <div className="text-xs opacity-75">Make new</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
