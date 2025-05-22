import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import YearBadge from "@/components/year-badge";
import { Upload, UserPen } from "lucide-react";
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
          <div className="flex items-center justify-between gap-2 px-4 py-5">
            <YearBadge />
            <p className="flex flex-col items-center">Account created <br /> {session?.user?.createdAt.toString().substring(4, 15)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-6 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full text-red-700 dark:text-red-500">
          <p>User has no description</p>
          <Link href={`/upload/${session?.user.id}`} className="p-2 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 rounded-xl" >
            <Upload className="text-red-700 dark:text-red-500" />
          </Link>

        </div>
      </div>
    </div>
  )
}