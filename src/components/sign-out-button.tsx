"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { signOutAction } from "@/lib/actions";
import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      const result = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("settings-cache");
              localStorage.removeItem("settings-timestamp");
            }
            router.push("/sign-in");
          },
          onError: async (ctx) => {
            console.error("Client sign out error:", ctx.error);
            // Fallback to server action
            try {
              const serverResult = await signOutAction();
              if (serverResult.success) {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("settings-cache");
                  localStorage.removeItem("settings-timestamp");
                }
                router.push("/sign-in");
              } else {
                toast.error(
                  serverResult.error || "Failed to sign out. Please try again."
                );
              }
            } catch (serverError) {
              console.error("Server sign out error:", serverError);
              toast.error("Failed to sign out. Please try again.");
            }
          },
        },
      });

      if (result?.error) {
        console.error("Sign out error:", result.error);
        const serverResult = await signOutAction();
        if (serverResult.success) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("settings-cache");
            localStorage.removeItem("settings-timestamp");
          }
          router.push("/sign-in");
        } else {
          toast.error(
            serverResult.error || "Failed to sign out. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Sign out error:", error);
      try {
        const serverResult = await signOutAction();
        if (serverResult.success) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("settings-cache");
            localStorage.removeItem("settings-timestamp");
          }
          router.push("/sign-in");
        } else {
          toast.error(
            serverResult.error || "Failed to sign out. Please try again."
          );
        }
      } catch (serverError) {
        console.error("Server sign out error:", serverError);
        toast.error("Failed to sign out. Please try again.");
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenuItem
      className="text-red-500 cursor-pointer"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? <LoaderCircle className="animate-spin" /> : <LogOut />}
      {isSigningOut ? "Signing out..." : "Sign out"}
    </DropdownMenuItem>
  );
}
