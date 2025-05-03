import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Bold, Import, Italic, Settings, Underline } from "lucide-react";
import { headers } from "next/headers";

export default async function EditorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="sticky w-full z-50 grid grid-cols-3">
        <div className="w-fit pl-1 pt-1 flex flex-col">
          <h1 className="text-2xl font-bold">Lorem ipsum dolor sit amet</h1>
          <h2 className="text-muted-foreground font-semibold">
            John Doe's work
          </h2>
        </div>
        <div className="flex items-center justify-center">
          <div className="border rounded-lg shadow-md p-1 flex items-center gap-x-2">
            <Button variant="outline" size={"icon"}>
              <Bold />
            </Button>
            <Button variant="outline" size={"icon"}>
              <Italic />
            </Button>
            <Button variant="outline" size={"icon"}>
              <Underline />
            </Button>
            <Button variant="outline" size={"icon"}>
              <Settings />
            </Button>
            <Button variant="outline" size={"icon"}>
              <Import />
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-x-3 justify-end p-2">
          <div className="select-none shadow-md border transition-colors hover:bg-muted bg-background cursor-pointer gap-x-12 text-sm rounded-full p-2 flex items-center">
            Search actions...
            <code className="flex items-center">
              <span className="text-xs text-muted-foreground">⌘</span>
              <span className="text-xs text-muted-foreground">K</span>
            </code>
          </div>
          <ThemeToggle />
          <Avatar className="w-[38px] h-[38px]">
            <AvatarImage src={session?.user.image || ""} />
            <AvatarFallback>
              {session?.user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
