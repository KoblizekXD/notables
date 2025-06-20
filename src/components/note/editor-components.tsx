"use client";

import { saveNote } from "@/lib/actions";
import {
  Bold,
  ExternalLink,
  Import,
  Italic,
  LoaderCircle,
  Settings,
  Underline,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import TooltipWrapper from "../tooltip-wrapper";
import { Button } from "../ui/button";
import { useEditorContext } from "./editor-context";
import SegmentEditor from "./segment-editor";
import SegmentPreviewer from "./segment-previewer";

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
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        startTransition(async () => {
          const result = await saveNote(context.id, context.segments);
          if (result === undefined) toast.success("Saved");
          else toast.error(result);
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [context.id, context.segments]);

  return (
    <div className="ml-auto flex items-center gap-x-2">
      <Button
        onClick={() => {
          navigator.clipboard.writeText(
            `${window.location.origin}/notes/${context.id}`,
          );
          toast.success("Link copied to clipboard");
        }}
        variant={"link"}>
        Share <ExternalLink />
      </Button>
      <Button
        onClick={() => {
          if (context.mode === "edit") context.setMode("preview");
          else context.setMode("edit");
        }}
        disabled={isPending}
        variant="outline">
        {context.mode === "edit" ? "Show preview" : "Show editor"}
      </Button>
      <Button
        onClick={() => {
          startTransition(async () => {
            const result = await saveNote(context.id, context.segments);
            if (result === undefined) toast.success("Saved");
            else toast.error(result);
          });
        }}
        className="flex items-center gap-x-2"
        disabled={isPending}>
        {isPending && <LoaderCircle className="animate-spin" />}
        Save
      </Button>
    </div>
  );
}

export function DecisionBasedSegmentRenderer() {
  const context = useEditorContext();

  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState(context.mode);

  useEffect(() => {
    startTransition(() => {
      setMode(context.mode);
    });
  }, [context.mode]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-xl">Reloading editor...</h1>
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return mode === "edit" ? <SegmentEditor /> : <SegmentPreviewer />;
}
