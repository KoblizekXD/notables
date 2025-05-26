import { AvatarUploader } from "@/components/avatar-uploader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Settings() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return (
    <div>
      <AvatarUploader userId={session.user.id} />
    </div>
  );
}
