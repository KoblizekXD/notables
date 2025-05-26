import { getPopularCollections } from "@/lib/actions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PopularCollections = async () => {
  const popular = await getPopularCollections(4);
  return (
    <div className="grid grid-rows-4 w-full h-full gap-1">
      {popular.map((i, index) => (
        <Link
          key={index}
          href={`/collection/${i.collection.id}`}
          className="flex flex-row justify-between items-center p-2 w-full h-full rounded-lg group select-none hover:bg-input/40">
          <div className="pl-2">
            <h1 className="text-lg font-semibold ">{i.collection.name}</h1>

            <div className="relative ml-1">
              <p className="absolute flex items-center justify-center ease-out text-muted-foreground transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                • Made by
                <span className="mx-1 text-blue-400 flex flex-row justify-center items-center gap-1">
                  {i.user.name}
                </span>
              </p>
              <p className="inline-block text-muted-foreground opacity-100 transition-all ease-out duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
                • {i.collection.description}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-end transition-transform duration-300 ease-out group-hover:-translate-x-2">
            <ChevronRight className="size-2 text-muted-foreground/60 -mr-2.5 transition-transform duration-300 ease-out group-hover:-translate-x-[20px]" />
            <ChevronRight className="size-4 text-muted-foreground/80 -mr-6 transition-transform duration-300 ease-out group-hover:-translate-x-[18px]" />
            <ChevronRight className="text-muted-foreground -mr-2 transition-transform duration-300 ease-out group-hover:-translate-x-2" />
            <ChevronRight className="z-50 text-foreground -ml-4 scale-150" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PopularCollections;
