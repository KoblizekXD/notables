import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center gap-y-3 p-1 flex-col h-screen w-full">
      <Skeleton className="w-full h-10" />
      <Skeleton className="flex-1 w-1/2" />
      <Skeleton className="w-full h-10" />
      <div className="absolute backdrop-blur-xs bottom-0 left-0 top-0 right-0 z-50 w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-[CalSans] font-semibold">Loading editor...</h1>
          <p className="text-sm font-[CalSans] text-muted-foreground">
            Please wait while we load the editor for you.
          </p>
          <LoaderCircle size={32} className="animate-spin" />
        </div>
      </div>
    </div>
  )
}