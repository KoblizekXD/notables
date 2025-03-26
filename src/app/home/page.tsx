"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  return <Button onClick={async () => {
    await authClient.signOut();
  }}>Sign out</Button>
}