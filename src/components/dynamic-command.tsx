"use client";

import { CommandLoading } from "cmdk";
import React, { useEffect, useState, useTransition } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "./ui/command";

interface DynamicCommandProps {
  key?: string;
  trigger: React.ReactNode;
}

export default function DynamicCommand({ key = "k", trigger }: DynamicCommandProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const triggered = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      startTransition(() => {
        setIsOpen((open: boolean) => !open);
      });
    },
  } as React.HTMLProps<HTMLDivElement>) : trigger;

  return (
    <>
      {triggered}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Find an action or search for notes..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isPending && <CommandLoading>Searching...</CommandLoading>}
        </CommandList>
      </CommandDialog>
    </>
  );
}
