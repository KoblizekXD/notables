import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DescriptionDrawer from "./descriptionDrawer";

export default async function UserDescription() {
  function handleDescUpdate() { }

  const session = await auth.api.getSession({ headers: await headers() });
  const descriptionText = session?.user.description || null;

  return (
    <div className="flex flex-col gap-y-6 items-center justify-center rounded-xl w-full h-full max-w-2xl">
      {descriptionText !== null ? (
        <div className="rounded-md overflow-hidden border-2 border-solid border-transparent hover:border-accent transition-colors duration-150">
          <p className="scrollbar-custom mr-0.5 max-h-95 rounded-xl overflow-y-auto p-2 py-1.5 text-gray-500 dark:text-gray-400">
            {descriptionText}
          </p>
        </div>
      ) : (
        <div className="flex opacity-[0.8] flex-col gap-y-6 py-4 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full text-red-600">
          <p className="lg:text-xl md:text-lg text-md">User has no description</p>
          <DescriptionDrawer user_id={session?.user.id} />
        </div>
      )}
    </div >
  );
}