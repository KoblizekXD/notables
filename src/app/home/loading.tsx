import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="w-full h-full backdrop-blur-lg flex items-center justify-center">
      <div className="flex text-center flex-col items-center justify-center gap-2">
        <h1 className="font-semibold flex items-center gap-x-2">
          <LoaderCircle className="animate-spin" />
          Loading...
        </h1>
        <h2 className="text-muted-foreground text-xs">
          Thanks for considering Notables, we are still in Beta!
        </h2>
      </div>
    </main>
  );
}
