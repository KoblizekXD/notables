"use client";

import { useEffect, useState } from "react";
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AvatarProps {
  userId: string;
  imagePath: string | null | undefined;
  fallback: string;
  className?: string;
}

export function Avatar({
  userId,
  imagePath,
  fallback,
  className,
}: AvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);
  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      setLoading(false);
      return;
    }
    const fetchImageUrl = async () => {
      try {
        setLoading(true);
        const { getAvatarUrl } = await import("@/lib/actions");
        const url = await getAvatarUrl(imagePath);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };
    fetchImageUrl();
  }, [imagePath, imageKey]);
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      if (event.detail.userId === userId) {
        setImageKey((prev) => prev + 1); 
      }
    };

    window.addEventListener(
      "avatarUpdated",
      handleAvatarUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "avatarUpdated",
        handleAvatarUpdate as EventListener
      );
    };
  }, [userId]);

  return (
    <UIAvatar className={className}>
      <AvatarImage
        src={imageUrl || ""}
        alt="Profile picture"
        key={imageKey}
      />
      <AvatarFallback>{loading ? "..." : fallback}</AvatarFallback>
    </UIAvatar>
  );
}
