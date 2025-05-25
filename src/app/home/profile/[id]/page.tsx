import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import YearBadge from "@/components/year-badge";
import UserDescription from "@/components/user-description";
import UserNote from "@/components/user-note";
import { UserPen } from "lucide-react";
import Link from "next/link";

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div>
      <div className="flex items-center justify-between w-full h-80 gap-x-16 px-15 py-6">
        <div className="flex flex-col justify-between items-start py-3">
          <div className="flex justify-between items-center gap-x-4">
            <Avatar className="size-18">
              <AvatarImage src={session?.user.image || ""} />
              <AvatarFallback>{session?.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center justify-baseline gap-x-2">
                <h1 className="text-2xl font-bold">{session?.user.name}</h1>
                <Link href={`/account/${session?.user.id}`} className="p-2 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 rounded-xl" >
                  <UserPen />
                </Link>
              </div>
              <p className="text-sm text-gray-500">{session?.user.email}</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <YearBadge />
          </div>
        </div>
        <UserDescription />
      </div>
      <div className="px-15">
        <h1 className="text-2xl font-bold">My notes:</h1>
        <div>
          <UserNote title="Munich agreement" description="lol popisek" createdAt={session?.user.createdAt} />
        </div>
      </div>
    </div>
  )
}