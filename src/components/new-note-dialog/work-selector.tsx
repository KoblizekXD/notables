"use client";

import { Combobox, type ComboboxOption } from "../ui/combobox";
import { Label } from "../ui/label";

interface WorkSelectorProps {
  selectedWork: string;
  onWorkChange: (workId: string) => void;
  workOptions: ComboboxOption[];
  loadingWorks: boolean;
}

export function WorkSelector({
  selectedWork,
  onWorkChange,
  workOptions,
  loadingWorks,
}: WorkSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="work">Select Work</Label>
      <Combobox
        options={workOptions}
        value={selectedWork}
        onValueChange={onWorkChange}
        placeholder={loadingWorks ? "Loading works..." : "Select a work"}
        searchPlaceholder="Search works..."
        emptyMessage="No works found."
        disabled={loadingWorks}
      />
    </div>
  );
}
