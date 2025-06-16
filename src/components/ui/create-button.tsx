"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

interface CreateButtonOption {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}

interface CreateButtonProps {
  label: string;
  options: CreateButtonOption[];
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function CreateButton({
  label,
  options,
  className,
  variant = "default",
  size = "default",
}: CreateButtonProps) {
  const [open, setOpen] = useState(false);

  if (options.length === 1) {
    const option = options[0];
    const Icon = option.icon;

    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={option.onClick}
        disabled={option.disabled}>
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {option.label}
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}>
          <Plus className="w-4 h-4" />
          {label}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={option.onClick}
              disabled={option.disabled}
              className="cursor-pointer">
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
