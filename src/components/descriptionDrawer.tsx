"use client";

import { LoaderCircle, Upload } from "lucide-react";
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
import { uploadDescription } from "@/lib/actions";
import { useState } from "react";

interface DescriptionDrawerProps {
  user_id: string | undefined;
  variant: string;
  descriptionText?: string;
}

export default function DescriptionDrawer({ user_id, variant, descriptionText }: DescriptionDrawerProps) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    const res = uploadDescription(user_id as string, description);
    // if (res){
    //   setError(res);
    // }
  }

  return (
    <>
      {variant === "normal" && (
        <Drawer>
          <div className="flex items-center justify-center w-full">
            <DrawerTrigger asChild>
              <Button variant="ghost" className="border-2 border-solid hover:border-gray-300 transition-colors duration-150 rounded-xl bg-transparent w-14 h-12 p-0.5" >
                <Upload className="text-red-600 !w-6 !h-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto items-center justify-center ">
              <form
                onSubmit={handleSubmit}
                className="flex mt-2 w-full lg:max-w-3xl p-2 md:flex-row flex-col"
              >
                <div className="flex border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full h-full p-1">
                  <textarea
                    className="w-full h-full p-2 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                    placeholder="Write your description here..."
                    rows={10}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
                      className="hover:border-green-300 hover:dark:border-green-700 bg-accent active:dark:bg-green-900 active:bg-green-400"
                    >
                      Submit
                    </Button>
                    <Button disabled className="hidden">
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
      {variant === "edit_description" && (
        <Drawer>
          <div className="flex items-center justify-center w-full">
            <DrawerTrigger asChild>
              <div className="w-full flex items-end justify-end">
                <Button variant={"link"} className="text-white py-0 px-2">edit description</Button>
              </div>
            </DrawerTrigger>
            <DrawerContent className="mx-auto items-center justify-center ">
              <form
                onSubmit={handleSubmit}
                className="flex mt-2 w-full lg:max-w-3xl p-2 md:flex-row flex-col"
              >
                <div className="flex border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full h-full p-1">
                  <textarea
                    className="w-full h-full p-2 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                    defaultValue={descriptionText}
                    rows={10}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
                      className="hover:border-green-300 hover:dark:border-green-700 bg-accent active:dark:bg-green-900 active:bg-green-400"
                    >
                      Submit
                    </Button>
                    <Button disabled className="flex">
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
