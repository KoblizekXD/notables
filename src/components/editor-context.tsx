"use client";

import { createContext, useContext, useState } from "react";
import type { NoteSegment } from "./segment-editor";

export interface EditorContextType {
  mode: "edit" | "preview";
  id: string;
  segments: NoteSegment[];
  setSegments: React.Dispatch<React.SetStateAction<NoteSegment[]>>;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export function EditorContextProvider({
  children,
  existingSegments = [],
  id
}: {
  children: React.ReactNode;
  existingSegments?: NoteSegment[];
  id: string;
}) {
  const [segments, setSegments] = useState<NoteSegment[]>(existingSegments);

  return (
    <EditorContext.Provider value={{ segments, setSegments, mode: "edit", id }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorContextProvider");
  }
  return context;
}