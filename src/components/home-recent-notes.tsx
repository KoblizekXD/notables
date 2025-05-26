import { getMostLikedNotes } from "@/db/action";
import type { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export default async function RecentNotes() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const recentNotes = await getMostLikedNotes(
    session?.user.id as unknown as typeof user.id,
    10,
  );
  return recentNotes.length !== 0 ? (
    <div className="grid grid-cols-1   lg:grid-cols-[3fr_7fr] w-full h-full rounded-xl gap-6 border border-border shadow-md p-6">
      <div className="flex flex-col h-full w-full gap-3 border-b pb-6 lg:pb-0 lg:border-b-0 lg:pr-6 lg:border-r justify-between">
        <div>
          <h1 className="truncate text-2xl font-semibold">Notes</h1>
          <p className="mt-2">
            Notes are a very powerful tool to study, learn new things, and
            remember the old ones. Start your journey to knowledge today!
          </p>
        </div>
        <div className="flex justify-center md:justify-end pt-2">
          <div className="group bg-foreground text-background py-2 px-3 rounded-lg">
            <Link
              href={""}
              className="relative inline-flex items-center text-lg">
              <span className="relative mb-0.5">
                <span className="flex items-center gap-2 font-semibold">
                  Create new notes
                  <Plus className="transition-transform rotate-0 group-hover:rotate-90 duration-300 ease-out" />
                </span>
                <span className="absolute -bottom-0.5 left-0 h-0.5 bg-background w-0 transition-[width] duration-500 group-hover:w-full rounded-xl" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-full gap-3 justify-between">
        <div>
          <h1 className="truncate text-2xl font-semibold">New here?</h1>
          <p className="mt-2">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
            enim erat, vestibulum vel, aliquam a, posuere eu, velit. Mauris
            metus. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu,
            orci. Etiam sapien elit, consequat eget, tristique non, venenatis
            quis, ante. Morbi imperdiet, mauris ac auctor dictum, nisl ligula
            egestas nulla, et sollicitudin sem purus in lacus. Quisque porta.
            Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus
            purus, vel sagittis velit mauris vel metus. Phasellus faucibus
            molestie nisl.
          </p>
        </div>
        <div className="flex justify-center md:justify-end pt-2">
          <div className="group bg-foreground text-background py-2 px-3 rounded-lg ">
            <Link
              href={""}
              className="relative inline-flex items-center text-lg">
              <span className="relative mb-0.5">
                <span className="flex items-center gap-2 font-semibold">
                  Learn to create notes
                </span>
                <span className="absolute -bottom-0.5 left-0 h-0.5 bg-background w-0 transition-[width] duration-500 group-hover:w-full rounded-xl" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full h-full">
      <CarouselContent className="p-2">
        {recentNotes.map((i, index) => (
          <CarouselItem
            key={index}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-2/5 xl:basis-4/13">
            <div className=" overflow-hidden group hover:scale-105 w-full h-32 bg-input/10 hover:bg-input/40 rounded-xl box-border hover:shadow-md shadow transition-all duration-300 py-4 px-6 border border-border select-none ">
              <h1 className="md:text-lg font-semibold text-foreground w-auto relative truncate">
                {i.title}
                <span className="absolute bottom-0 left-0 h-0.5 bg-foreground w-0 transition-[width] duration-500 group-hover:w-full rounded-lg" />
              </h1>
              <p className="mt-2 text-sm text-foreground leading-tight">
                {i.content}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
