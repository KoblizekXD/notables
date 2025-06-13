import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserDescription from "@/components/user-description";
import YearBadge from "@/components/year-badge";
// import { UserPen } from "lucide-react";
// import Link from "next/link";
import SuspenseProfile from "./suspense";
import { getUser, getUserNotes } from "@/lib/actions";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser((await params).id);
  const notes = await getUserNotes(user.id, 10);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-y-6 pt-6">
      <div className="flex items-center max-lg:flex-col max-w-240 lg:flex-row justify-between w-full gap-x-14 md:px-13 px-8 md:pb-6 lg:pb-20 pb-2">
        <div className="flex flex-col max-lg:md:flex-row justify-between min-lg:items-start items-center py-3 ">
          <div className="flex justify-between items-center gap-x-4">
            <Avatar className="size-18 border">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center justify-baseline gap-x-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {/* 
                  <Link href={`./account/${user.id}`} className="p-2 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 rounded-xl" >
                    <UserPen />
                  </Link>
                  */}
              </div>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <YearBadge createdAt={user.createdAt} />
          </div>
        </div>
        <UserDescription user_id={user.id} description={user.description} />
      </div>
      <SuspenseProfile notes={Promise.resolve(notes)} />
    </div>
  );
}
