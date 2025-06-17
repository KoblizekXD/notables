"use client";

import { createContext, useContext, useState } from "react";
import type { NoteSegment } from "./segment-editor";

export interface EditorContextType {
  mode: "edit" | "preview";
  setMode: React.Dispatch<React.SetStateAction<"edit" | "preview">>;
  id: string;
  segments: NoteSegment[];
  setSegments: React.Dispatch<React.SetStateAction<NoteSegment[]>>;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export function EditorContextProvider({
  children,
  existingSegments = [],
  id,
  mode = "edit",
}: {
  children: React.ReactNode;
  existingSegments?: NoteSegment[];
  id: string;
  mode?: "edit" | "preview";
}) {
  const [segments, setSegments] = useState<NoteSegment[]>(existingSegments);
  const [currentMode, setMode] = useState<"edit" | "preview">(mode);

  return (
    <EditorContext.Provider
      value={{ segments, setSegments, mode: currentMode, id, setMode }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error(
      "useEditorContext must be used within an EditorContextProvider",
    );
  }
  return context;
}
