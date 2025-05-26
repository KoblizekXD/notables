import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { updateEmail } from "@/lib/actions";

export function ChangeEmailDialog({
  userId,
}: {
  userId: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await updateEmail(userId, email);
    setLoading(false);
    if (result) {
      setSuccess(true);
      setEmail("");
    } else {
      setError("Failed to update email. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Email</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="New email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby="email-error"
            autoFocus
          />
          {error && (
            <p id="email-error" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600">
              Email updated successfully!
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading || !email}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
