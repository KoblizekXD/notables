"use client";

import { useEffect, useState } from "react";
import { AvatarFallback, AvatarImage, Avatar as UIAvatar } from "../ui/avatar";

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
  const [currentImagePath, setCurrentImagePath] = useState(imagePath);
  useEffect(() => {
    setCurrentImagePath(imagePath);
  }, [imagePath]);
  useEffect(() => {
    if (!currentImagePath) {
      setImageUrl(null);
      setLoading(false);
      return;
    }
    const fetchImageUrl = async () => {
      try {
        setLoading(true);
        const { getAvatarUrl } = await import("@/lib/actions");
        const url = await getAvatarUrl(currentImagePath);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };
    fetchImageUrl();
    if (imageKey) return; // This shit is just for linter do not touch it, otherwise it will break
  }, [currentImagePath, imageKey]);

  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      if (event.detail.userId === userId) {
        setImageUrl(null);
        setLoading(true);
        setCurrentImagePath(event.detail.imagePath);
        setImageKey((prev) => prev + 1);
      }
    };
    window.addEventListener(
      "avatarUpdated",
      handleAvatarUpdate as EventListener,
    );
    return () => {
      window.removeEventListener(
        "avatarUpdated",
        handleAvatarUpdate as EventListener,
      );
    };
  }, [userId]);

  return (
    <UIAvatar className={className}>
      <AvatarImage
        src={imageUrl || ""}
        alt="Profile picture"
        key={`${userId}-${imageKey}`}
      />
      <AvatarFallback>{loading ? "..." : fallback}</AvatarFallback>
    </UIAvatar>
  );
}
