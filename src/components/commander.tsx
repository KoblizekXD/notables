import { Search } from "lucide-react";

export default function Commander(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className="border hover:brightness-95 transition-all gap-x-1 text-[0.9rem] px-1 text-muted-foreground bg-muted flex items-center rounded-md w-full cursor-pointer select-none">
      <Search size={18} />
      Search commands or actions...
      <kbd className="text-sm font-mono text-muted-foreground bg-gray-300 border rounded-sm px-1 ml-auto">
        ⌘K
      </kbd>
    </div>
  )
}