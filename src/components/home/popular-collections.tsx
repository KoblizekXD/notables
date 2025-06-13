"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PopularCollections = ({
  collections,
}: {
  collections: {
    collection: {
      id: string;
      name: string;
      description: string | null;
    };
    user: {
      id: string;
      name: string;
    };
  }[];
}) => {
  return (
    <div className="grid grid-rows-4 w-full h-full gap-1">
      {collections.map((i, index) => (
        <button
          type="button"
          key={index}
          className="flex flex-row justify-between items-center p-2 w-full h-full rounded-lg group select-none hover:bg-input/40 cursor-pointer"
          onClick={() => {
            window.location.href = `/collection/${i.collection.id}`;
          }}>
          <div className="flex-1 min-w-0 px-3 py-1">
            <h1 className="text-lg font-semibold text-foreground mb-1 truncate">
              {i.collection.name}
            </h1>

            <div className="relative h-5 overflow-hidden">
              <div className="absolute inset-0 flex items-center transform translate-y-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0" />
                  <span className="mr-1">Made by</span>
                  <Link
                    href={`/profile/${i.user.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-blue-500 hover:text-blue-400 transition-colors hover:underline">
                    {i.user.name}
                  </Link>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center opacity-100 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:-translate-y-5">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0" />
                  <p className="truncate">
                    {i.collection.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-end transition-transform duration-300 ease-out group-hover:-translate-x-2">
            <ChevronRight className="size-2 text-muted-foreground/60 -mr-2.5 transition-transform duration-300 ease-out group-hover:-translate-x-[20px]" />
            <ChevronRight className="size-4 text-muted-foreground/80 -mr-6 transition-transform duration-300 ease-out group-hover:-translate-x-[18px]" />
            <ChevronRight className="text-muted-foreground -mr-2 transition-transform duration-300 ease-out group-hover:-translate-x-2" />
            <ChevronRight className="z-50 text-foreground -ml-4 scale-150" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default PopularCollections;
