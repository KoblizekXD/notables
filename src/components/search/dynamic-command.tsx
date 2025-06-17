"use client";

import { searchQuery } from "@/lib/actions";
import { Book, LoaderCircle, Text, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface DynamicCommandProps {
  key?: string;
  trigger: React.ReactNode;
}

export default function DynamicCommand({
  key = "k",
  trigger,
}: DynamicCommandProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(query);
  const [results, setResults] = useState<
    | {
        notes: Result[];
        works: Result[];
        authors: Result[];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open: boolean) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [key]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebouncedValue("");
      setResults(undefined);
    }
  }, [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is correct as we want to run this effect only when debouncedValue changes
  useEffect(() => {
    startTransition(async () => {
      if (!debouncedValue.trim()) {
        setResults(undefined);
        return;
      }
      setResults(await searchQuery(query));
    });
  }, [debouncedValue]);

  const triggered = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          startTransition(() => {
            setIsOpen((open: boolean) => !open);
          });
        },
      } as React.HTMLProps<HTMLDivElement>)
    : trigger;

  return (
    <>
      {triggered}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          onValueChange={(value) => {
            setQuery(value);
          }}
          placeholder="Find an action or search for notes..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isPending ? (
            <CommandItem className="text-center">
              <LoaderCircle className="animate-spin" />
              Loading...
            </CommandItem>
          ) : (
            <>
              {results?.notes.length ? (
                <CommandGroup heading="Notes">
                  {results.notes.map((note) => (
                    <CommandItem
                      key={note.id}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={`/notes/${note.id}`} target="_blank">
                        {note.icon || <Text className="mr-2" />}
                        {note.name}
                        {note.description && (
                          <span className="text-muted-foreground">
                            {note.description}
                          </span>
                        )}
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results?.works.length ? (
                <CommandGroup heading="Works">
                  {results.works.map((work) => (
                    <CommandItem
                      key={work.id}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={`/works/${work.id}`}>
                        {work.icon || <Book className="mr-2" />}
                        {work.name}
                        {work.description && (
                          <span className="text-muted-foreground">
                            {work.description}
                          </span>
                        )}
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results?.authors.length ? (
                <CommandGroup heading="Authors">
                  {results.authors.map((author) => (
                    <CommandItem
                      key={author.id}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={`/authors/${author.id}`}>
                        {author.icon || <User className="mr-2" />}
                        {author.name}
                        {author.description && (
                          <span className="text-muted-foreground">
                            {author.description}
                          </span>
                        )}
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export interface Result {
  id: string;
  type: "author" | "note" | "tag" | "user" | "work";
  name: string;
  icon?: React.ReactNode;
  description?: string;
}
