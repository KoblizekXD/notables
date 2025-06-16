"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Session, User } from "better-auth";
import DescriptionDrawer from "./description-drawer";

interface UserDescriptionProps {
  user_id: string;
  description: string | null;
}

export default function UserDescription({
  user_id,
  description,
}: UserDescriptionProps) {
  const [currentDescription, setCurrentDescription] = useState<string>(description || "");
  const [session, setSession] = useState<{user: User, session: Session} | null>(null);

  useEffect(() => {
    (async () => {
      const s = await authClient.getSession();
      setSession(s.data);
    })()
  }, []);

  return (
    <div className="flex flex-col gap-y-6 items-center justify-center rounded-xl w-auto h-full max-w-2xl">
      {description !== null ? (
        <div className="flex flex-col gap-y-0.5 items-end justify-end">
          {session?.user.id === user_id && (
            <DescriptionDrawer
              user_id={user_id}
              variant="edit"
              descriptionText={currentDescription}
              setDescriptionText={setCurrentDescription}
            />
          )}
          <div className="rounded-md overflow-hidden border-2 border-solid border-gray-300 dark:border-neutral-900 hover:dark:border-accent hover:border-gray-200 transition-colors duration-150 ">
            <p className="mr-0.5 max-h-95 min-h-40 min-w-50 md:min-w-70 rounded-xl overflow-y-auto p-2 py-1.5 text-gray-500 dark:text-gray-400 break-all">
              {currentDescription}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex opacity-[0.8] flex-col gap-y-6 py-4 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full">
          <p className="lg:text-xl md:text-lg text-md text-red-600 flex items-center justify-center px-1">
            User has no description
          </p>
          <DescriptionDrawer user_id={user_id} variant="upload" />
        </div>
      )}
    </div>
  );
}
