"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { uploadAvatar } from "@/lib/actions";
import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";

import { ChangeEmailDialog } from "./change-email-dialog";
import { ChangeUsernameDialog } from "./change-username-dialog";

async function getCroppedImg(
  imageSrc: string,
  crop: { width: number; height: number; x: number; y: number },
): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
}

export function UserSettings({
  userId,
  currentImagePath,
}: {
  userId: string;
  currentImagePath: string | null | undefined;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const onUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", croppedBlob, "avatar.png");
      const result = await uploadAvatar(formData);
      if (result.success && result.imagePath) {
        const event = new CustomEvent("avatarUpdated", {
          detail: { userId, imagePath: result.imagePath },
        });
        window.dispatchEvent(event);
        toast.success("Profile picture updated successfully!");
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      } else {
        toast.error("Failed to upload profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload Profile Picture</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload and Crop Avatar</DialogTitle>
          </DialogHeader>
          <button
            type="button"
            className="group w-full mt-4 border-3 border-dashed rounded-lg hover:border-black/20 transition-colors duration-200 aspect-square relative bg-muted overflow-hidden select-none"
            onClick={() => {
              if (imageSrc === null) inputRef.current?.click();
            }}
            aria-label="Select image to upload">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="relative font-semibold flex items-center gap-4 transition-all duration-300 text-foreground/60 after:absolute after:top-5 after:bg-black/20 after:left-0 after:h-0.5 after:w-0 after:rounded-xl after:transition-[width] after:duration-500 group-hover:after:w-full group-hover:font-bold group-hover:scale-110">
                  No image selected
                </div>
              </div>
            )}
          </button>

          <div className="w-full flex flex-row gap-2 justify-between items-center">
            <label htmlFor="zoom-slider" className="select-none">
              Zoom:
            </label>
            <Slider
              id="zoom-slider"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
              className="my-2 border"
            />
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              Select Image
            </Button>
            <Button onClick={onUpload} disabled={!imageSrc || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ChangeEmailDialog userId={userId} />
      <ChangeUsernameDialog userId={userId} />
      <Button disabled>Change Password</Button>
    </div>
  );
}
