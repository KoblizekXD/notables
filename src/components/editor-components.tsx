"use client";

import { Bold, Import, Italic, Settings, Underline } from "lucide-react";
import { useEditorContext } from "./editor-context";
import TooltipWrapper from "./tooltip-wrapper";
import { Button } from "./ui/button";

export function FloatingEditorMenu() {
  return (
    <div className="border rounded-lg shadow-md p-1 flex items-center gap-x-2">
      <TooltipWrapper content="Bold ⌘+B">
        <Button disabled variant="outline" size={"icon"}>
          <Bold />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Italic ⌘+I">
        <Button disabled variant="outline" size={"icon"}>
          <Italic />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Underline ⌘+U">
        <Button disabled variant="outline" size={"icon"}>
          <Underline />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Settings">
        <Button disabled variant="outline" size={"icon"}>
          <Settings />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Import segments from JSON">
        <Button disabled variant="outline" size={"icon"}>
          <Import />
        </Button>
      </TooltipWrapper>
    </div>
  );
}

export function BottomFloatingButtons() {
  const context = useEditorContext();

  return (
    <div className="ml-auto flex items-center gap-x-2">
      <Button variant="outline">Show preview</Button>
      <Button
        onClick={() => {
          console.log(context.segments);
        }}
      >
        Save
      </Button>
    </div>
  );
}
