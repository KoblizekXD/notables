"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateUsername } from "@/lib/actions";
import { useState } from "react";

export function ChangeUsernameDialog({ userId }: { userId: string }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const result = await updateUsername(userId, username);
      if (result) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Username</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="New username"
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {status === "success" && (
          <p className="mt-2 text-green-600">Username updated successfully!</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-red-600">Failed to update username.</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!username || loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
