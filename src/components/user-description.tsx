import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DescriptionDrawer from "./descriptionDrawer";

interface UserDescriptionProps {
  user_id: string;
  description: string | null;
}

export default async function UserDescription({
  user_id,
  description,
}: UserDescriptionProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-col gap-y-6 items-center justify-center rounded-xl w-auto h-full max-w-2xl">
      {description !== null ? (
        <div className="flex flex-col gap-y-0.5 items-end justify-end">
          {session?.user.id === user_id && (
            <DescriptionDrawer
              user_id={user_id}
              variant="edit_description"
              descriptionText={description}
            />
          )}
          <div className="rounded-md overflow-hidden border-2 border-solid border-neutral-900 hover:border-accent transition-colors duration-150 ">
            <p className="scrollbar-custom mr-0.5 max-h-95 min-h-40 min-w-50 rounded-xl overflow-y-auto p-2 py-1.5 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex opacity-[0.8] flex-col gap-y-6 py-4 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full">
          <p className="lg:text-xl md:text-lg text-md text-red-600">
            User has no description
          </p>
          <DescriptionDrawer user_id={user_id} variant="normal" />
        </div>
      )}
    </div>
  );
}
