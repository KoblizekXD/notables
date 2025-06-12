"use client";

import {
  createAuthor,
  createAuthorAndWork,
  createNote,
  createWork,
  getAllAuthors,
  getAllWorks,
} from "@/lib/actions";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import type { ComboboxOption } from "../ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AuthorCreator } from "./author-creator";
import { AuthorSelector } from "./author-selector";
import { CreationModeSelector } from "./creation-mode-selector";
import { NoteTitleInput } from "./note-title-input";
import type { Author, SelectionOptions, Work } from "./types";
import { WorkCreator } from "./work-creator";
import { WorkSelector } from "./work-selector";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewNoteDialog({ open, onOpenChange }: NewNoteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [selectionOptions, setSelectionOptions] = useState<SelectionOptions>({
    selectAuthor: false,
    selectWork: false,
    createAuthor: false,
    createWork: false,
  });
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedWork, setSelectedWork] = useState<string>("");
  const [title, setTitle] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkAuthor, setNewWorkAuthor] = useState<string>("none");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [authorOptions, setAuthorOptions] = useState<ComboboxOption[]>([]);
  const [workOptions, setWorkOptions] = useState<ComboboxOption[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open && authors.length === 0) {
      setLoadingAuthors(true);
      getAllAuthors()
        .then((authorsData) => {
          setAuthors(authorsData);
          setAuthorOptions(
            authorsData.map((author) => ({
              value: author.id,
              label: author.name,
            })),
          );
        })
        .catch((error) => {
          console.error("Failed to load authors:", error);
          toast.error("Failed to load authors");
        })
        .finally(() => setLoadingAuthors(false));
    }
  }, [open, authors.length]);

  useEffect(() => {
    if (selectionOptions.selectWork) {
      setLoadingWorks(true);
      setSelectedWork("");
      getAllWorks()
        .then((worksData) => {
          setWorks(worksData);
          setWorkOptions(
            worksData.map((work) => {
              const authorName = authors.find(
                (a) => a.id === work.authorId,
              )?.name;
              return {
                value: work.id,
                label: work.title,
                description: authorName ? `by ${authorName}` : "No author",
              };
            }),
          );
        })
        .catch((error) => {
          console.error("Failed to load works:", error);
          toast.error("Failed to load works");
        })
        .finally(() => setLoadingWorks(false));
    } else {
      setWorks([]);
      setWorkOptions([]);
      setSelectedWork("");
    }
  }, [selectionOptions.selectWork, authors]);
  const isFormValid = () => {
    if (!title.trim()) return false;
    const hasSelection =
      selectionOptions.selectAuthor ||
      selectionOptions.selectWork ||
      selectionOptions.createAuthor ||
      selectionOptions.createWork;
    if (!hasSelection) return false;
    if (selectionOptions.selectAuthor && !selectedAuthor) return false;
    if (selectionOptions.selectWork && !selectedWork) return false;
    if (selectionOptions.createAuthor && !newAuthorName.trim()) return false;
    if (selectionOptions.createWork && !newWorkTitle.trim()) return false;

    return true;
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const hasSelection =
      selectionOptions.selectAuthor ||
      selectionOptions.selectWork ||
      selectionOptions.createAuthor ||
      selectionOptions.createWork;

    if (!hasSelection) {
      toast.error("Please select at least one option");
      return;
    }

    startTransition(async () => {
      try {
        let createdAuthorId: string | null = null;
        let createdWorkId: string | null = null;
        let selectedEntityId: string | null = null;
        let finalNoteType: "author" | "work";
        if (selectionOptions.createAuthor && selectionOptions.createWork) {
          if (!newAuthorName.trim()) {
            toast.error("Please enter an author name");
            return;
          }
          if (!newWorkTitle.trim()) {
            toast.error("Please enter a work title");
            return;
          }
          const bothResult = await createAuthorAndWork(
            newAuthorName,
            newWorkTitle,
          );
          if (
            !bothResult.success ||
            !bothResult.workId ||
            !bothResult.authorId
          ) {
            toast.error(bothResult.error || "Failed to create author and work");
            return;
          }
          createdAuthorId = bothResult.authorId;
          createdWorkId = bothResult.workId;
        } else if (selectionOptions.createAuthor) {
          if (!newAuthorName.trim()) {
            toast.error("Please enter an author name");
            return;
          }
          const authorResult = await createAuthor(newAuthorName);
          if (!authorResult.success || !authorResult.authorId) {
            toast.error(authorResult.error || "Failed to create author");
            return;
          }
          createdAuthorId = authorResult.authorId;
        } else if (selectionOptions.createWork) {
          if (!newWorkTitle.trim()) {
            toast.error("Please enter a work title");
            return;
          }
          const workResult = await createWork(
            newWorkTitle,
            newWorkAuthor && newWorkAuthor !== "none"
              ? newWorkAuthor
              : undefined,
          );
          if (!workResult.success || !workResult.workId) {
            toast.error(workResult.error || "Failed to create work");
            return;
          }
          createdWorkId = workResult.workId;
        }
        if (selectionOptions.selectAuthor) {
          if (!selectedAuthor) {
            toast.error("Please select an author");
            return;
          }
          selectedEntityId = selectedAuthor;
        } else if (selectionOptions.selectWork) {
          if (!selectedWork) {
            toast.error("Please select a work");
            return;
          }
          selectedEntityId = selectedWork;
        }
        let entityId: string;
        if (
          createdAuthorId &&
          (selectionOptions.selectAuthor || !createdWorkId)
        ) {
          entityId = createdAuthorId;
          finalNoteType = "author";
        } else if (createdWorkId) {
          entityId = createdWorkId;
          finalNoteType = "work";
        } else if (selectedEntityId) {
          entityId = selectedEntityId;
          finalNoteType = selectionOptions.selectAuthor ? "author" : "work";
        } else {
          toast.error("No entity selected or created");
          return;
        }
        const result = await createNote(title, "", finalNoteType, entityId);
        if (result.success && result.noteId) {
          toast.success("Note created successfully!");
          onOpenChange(false);
          resetForm();
          router.push(`/edit?id=${result.noteId}`);
        } else toast.error(result.error || "Failed to create note");
      } catch (error) {
        console.error("Error creating note:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const resetForm = () => {
    setTitle("");
    setSelectedAuthor("");
    setSelectedWork("");
    setNewAuthorName("");
    setNewWorkTitle("");
    setNewWorkAuthor("none");
    setSelectionOptions({
      selectAuthor: false,
      selectWork: false,
      createAuthor: false,
      createWork: false,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Create a note about an author or their work. You can select existing
            ones or create new ones. You'll add content in the editor after
            creation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CreationModeSelector
            selectionOptions={selectionOptions}
            onSelectionOptionsChange={setSelectionOptions}
          />
          {selectionOptions.selectAuthor && (
            <AuthorSelector
              selectedAuthor={selectedAuthor}
              onAuthorChange={setSelectedAuthor}
              authorOptions={authorOptions}
              loadingAuthors={loadingAuthors}
            />
          )}
          {selectionOptions.selectWork && (
            <WorkSelector
              selectedWork={selectedWork}
              onWorkChange={setSelectedWork}
              workOptions={workOptions}
              loadingWorks={loadingWorks}
            />
          )}

          {selectionOptions.createAuthor && (
            <AuthorCreator
              newAuthorName={newAuthorName}
              onAuthorNameChange={setNewAuthorName}
            />
          )}
          {selectionOptions.createWork && (
            <WorkCreator
              newWorkTitle={newWorkTitle}
              onWorkTitleChange={setNewWorkTitle}
              newWorkAuthor={newWorkAuthor}
              onWorkAuthorChange={setNewWorkAuthor}
              authorOptions={authorOptions}
              loadingAuthors={loadingAuthors}
              isCreatingAuthor={selectionOptions.createAuthor}
              newAuthorName={newAuthorName}
            />
          )}
          <NoteTitleInput title={title} onTitleChange={setTitle} />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <div
            className={`${
              isFormValid() ? "group" : ""
            } relative overflow-hidden rounded-md`}>
            {isFormValid() && (
              <div className="absolute inset-0 bg-primary w-0 transition-[width] duration-400 group-hover:w-full rounded-md" />
            )}

            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className={`relative z-10 bg-transparent hover:bg-transparent border-2 transition-colors ${
                isFormValid()
                  ? "text-white border-primary/30"
                  : "text-red-500 border-red-500/50"
              }`}>
              <span className="relative">
                <span className="flex items-center gap-2">
                  {isPending && (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  )}
                  Create Note
                </span>
                {isFormValid() && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 bg-white w-0 transition-[width] duration-400 group-hover:w-full rounded-xl" />
                )}
              </span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
