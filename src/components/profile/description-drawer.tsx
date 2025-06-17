"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { uploadDescription } from "@/lib/actions";
import { LoaderCircle, Upload } from "lucide-react";
import { type Dispatch, type SetStateAction, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export default function DescriptionDrawer({
  user_id,
  variant,
  descriptionText,
  setDescriptionText
}: {
  user_id: string | undefined;
  variant: string;
  descriptionText?: string;
  setDescriptionText?: Dispatch<SetStateAction<string>>;
}) {
  const [description, setDescription] = useState(descriptionText || "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [textareaErr, setTextareaErr] = useState<boolean>();

  if (description.length > 500) {
    setError("Text is too long");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await uploadDescription(user_id as string, description as string);
      setDescriptionText?.(description);

      if (res !== undefined) {
        setError(res);
        toast.error(res);
      }
      else {
        toast.success("Description updated successfully!");
        setIsOpen(false);
      }
    }
    );
  };

  return (
    <>
      {variant === "upload" && (
        <Drawer>
          <div className="flex items-center justify-center w-full">
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="border-2 border-solid hover:border-gray-300 transition-colors duration-150 rounded-xl bg-transparent w-14 h-12 p-0.5">
                <Upload className="text-red-600 !w-6 !h-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto items-center justify-center ">
              <form
                onSubmit={handleSubmit}
                className="flex mt-2 w-full lg:max-w-3xl p-2 md:flex-row flex-col">
                <div className="flex border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full h-full p-1">
                  <textarea
                    className="w-full h-full p-2 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                    placeholder="Write your description here..."
                    rows={10}
                    disabled={isPending}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p>{description} / 500</p>
                </div>
                <div className="flex md:flex-col flex-row items-center justify-center">
                  <DrawerHeader>
                    <DrawerTitle>Upload description</DrawerTitle>
                    <DrawerDescription>Markdown is supported</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="flex gap-y-1.5 w-full">
                    <Button
                      id="submit"
                      variant="outline"
                      type="submit"
                      disabled={isPending}
                      className="hover:border-green-300 hover:dark:border-green-700 bg-accent active:dark:bg-green-900 active:bg-green-400">
                      Submit
                    </Button>
                    <Button disabled={!isPending} className={isPending ? "flex" : "hidden"}>
                      <LoaderCircle className="animate-spin" />
                      Please wait
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="destructive">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </form>
            </DrawerContent>
          </div>
        </Drawer>
      )}
      {variant === "edit" && (
        <Drawer open={isOpen} onOpenChange={setIsOpen} >
          <div className="flex items-center justify-center w-full">
            <DrawerTrigger asChild>
              <div className="w-full flex items-end justify-end">
                <Button variant={"link"} className="dark:text-white text-black py-0 px-2">
                  edit description
                </Button>
              </div>
            </DrawerTrigger>
            <DrawerContent className="mx-auto items-center justify-center ">
              <form
                onSubmit={handleSubmit}
                className="flex mt-2 w-full lg:max-w-3xl p-2 md:flex-row flex-col">
                <div
                  className={cn("flex flex-col items-end border-2 border-dashed  rounded-lg w-full h-full p-1",
                    !textareaErr ? "border-gray-300 dark:border-gray-600" : "border-red-400 dark:border-red-700")}>
                  <textarea
                    className="w-full h-full p-2 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                    defaultValue={descriptionText}
                    disabled={isPending}
                    rows={10}
                    maxLength={500}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                      else{
                        toast.error("Your text is too long");
                      }
                    }}
                  />
                  <p className="flex justify-end pr-2 text-xs text-gray-500 dark:text-gray-400">
                    {description.length > 0 ? (description.length) : descriptionText?.length} / 500</p>
                </div>
                <div className="flex md:flex-col flex-row items-center justify-center">
                  <DrawerHeader>
                    <DrawerTitle>Upload description</DrawerTitle>
                    <DrawerDescription>Markdown is supported</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="flex gap-y-1.5 w-full">
                    <Button
                      id="submit"
                      variant="outline"
                      type="submit"
                      disabled={isPending}
                      className={`hover:border-green-300 hover:dark:border-green-700 bg-accent active:dark:bg-green-900 active:bg-green-400 ${isPending ? "hidden" : "flex"}`}>
                      Submit
                    </Button>
                    <Button disabled={!isPending} className={isPending ? "flex" : "hidden"}>
                      <LoaderCircle className="animate-spin" />
                      Please wait
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="destructive">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </form>
            </DrawerContent>
          </div>
        </Drawer>
      )}
    </>
  );
}
