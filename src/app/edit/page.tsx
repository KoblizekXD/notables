import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EditorPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  auth.api.getSession({
    headers: await headers()
  });
}