import { getMostLikedNotes } from "@/db/fetch";
import type { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const RecentNotes = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const recentNotes = await getMostLikedNotes(
    session?.user.id as unknown as typeof user.id,
    10
  );
  return recentNotes.length === 0 ? (
    <div className="flex justify-center items center">
      <div className="text-center font-semibold">No recent notes</div>
    </div>
  ) : (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full h-full"
    >
      <CarouselContent className="p-2">
        {recentNotes.map((i, index) => (
          <CarouselItem
            key={index}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-2/5 xl:basis-4/13"
          >
            <div className=" overflow-hidden group hover:scale-105 w-full h-32 bg-input/10 hover:bg-input/40 rounded-xl box-border hover:shadow-md shadow transition-all duration-300 py-4 px-6 border border-border select-none ">
              <h1 className="md:text-lg font-semibold text-foreground w-auto relative truncate">
                {i.title}
                <span className="absolute bottom-0 left-0 h-0.5 bg-foreground w-0 transition-[width] duration-500 group-hover:w-full" />
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
};

export default RecentNotes;
