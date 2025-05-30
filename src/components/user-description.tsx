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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserDescription() {
  function handleDescUpdate() {}

  const session = await auth.api.getSession({ headers: await headers() });

  // const descriptionText = session?.user.description || null;    
  const descriptionText = null; // For testing purposes, set to null to see the fallback UI
  // const descriptionText = "lol Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo eum libero, quos, sapiente cum, a voluptatibus corrupti minus fugit doloribus veniam aperiam excepturi aut! Voluptate fuga ab facere illo asperiores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia eveniet accusantium voluptatum ullam possimus illum, deleniti placeat in nostrum tenetur non dolore recusandae dignissimos culpa cum odit voluptates soluta corrupti! Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quo doloribus rem officia doloremque. Esse explicabo saepe ratione facilis dolorem nam! Sapiente nam sint maiores corporis minus fugit quas fugiat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint expedita vel eveniet vero ratione velit, pariatur, veritatis explicabo consequuntur dignissimos, eos nisi similique voluptate assumenda labore fugiat hic saepe aliquam. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit consequatur enim porro at ea maiores quisquam voluptatem consequuntur recusandae vel, cum dolorum nobis natus doloremque voluptatum libero voluptatibus mollitia neque!";

  return (
    <div className="flex flex-col gap-y-6 items-center justify-center rounded-xl w-full h-full max-w-2xl">
      {descriptionText !== null ? (
        <div className="rounded-sm overflow-hidden">
          <p className="max-h-95 scrollbar-custom rounded-xl overflow-y-auto p-2 py-3 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 text-gray-500 dark:text-gray-400">
            {descriptionText}
          </p>
        </div>
      ) : (
        <div className="flex opacity-[0.8] flex-col gap-y-6 py-4 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full text-red-600">
          <p className="lg:text-xl md:text-lg text-md">User has no description</p>
          <Drawer>
            <div className="flex items-center justify-center w-full">
              <DrawerTrigger asChild>
                <Button variant="ghost" className="border-2 border-solid hover:border-gray-300 transition-colors duration-150 rounded-xl bg-transparent w-14 h-12 p-0.5" >
                  <Upload className="text-red-600 !w-6 !h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto items-center justify-center ">
                <form className="flex mt-2 w-full lg:max-w-3xl p-2 md:flex-row flex-col">
                  <div className="flex border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full h-full p-1">
                    <textarea
                      className="w-full h-full p-2 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                      placeholder="Write your description here..."
                      rows={10}
                    />
                  </div>
                  <div className="flex md:flex-col flex-row items-center justify-center">
                    <DrawerHeader>
                      <DrawerTitle>Upload description</DrawerTitle>
                      <DrawerDescription>Markdown is supported</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex gap-y-1.5">
                      <Button
                        variant="outline"
                        type="submit"
                        className="hover:border-green-300 hover:dark:border-green-700 bg-accent active:dark:bg-green-900 active:bg-green-400"
                      >
                        Submit
                      </Button>
                      <Button disabled>
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

        </div>
      )}
    </div >
  );
}