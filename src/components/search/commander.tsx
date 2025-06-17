"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Search } from "lucide-react";

export default function Commander(props: React.HTMLProps<HTMLDivElement>) {
  const mobile = useIsMobile();
  return !mobile ? (
    <div
      {...props}
      className="border hover:brightness-95 transition-all gap-x-1 text-[0.9rem] px-1 text-muted-foreground bg-muted flex items-center rounded-md w-full cursor-pointer select-none">
      <Search size={18} />
      Search commands or actions...
      <kbd className="text-sm font-mono text-muted-foreground  border rounded-sm px-1 ml-auto">
        ⌘K
      </kbd>
    </div>
  ) : (
    <div
      {...props}
      className="w-fit flex items-center self-end gap-x-2 h-fit hover:bg-muted rounded-sm transition-all p-2 cursor-pointer">
      Search <Search size={20} />
    </div>
  );
}
