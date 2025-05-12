import RecentNotes from "@/components/home-recent-notes";
import PopularCollections from "@/components/poular-collections";

export default function Home() {
  return (
    <div className="m-3 sm:m-4 md:m-5">
      <div className="flex flex-col w-full lg:max-w-4xl xl:max-w-7xl mx-auto gap-8">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-left">Recent notes</h1>
          <div className="flex gap-4 overflow-x-auto p-1">
            <RecentNotes />
          </div>
        </div>

        <div>
          <h1 className="mb-4 text-3xl font-bold text-left">
            Interesting discussions
          </h1>
          <div className="flex gap-4 p-1">
            <div className="h-36 w-full flex flex-row justify-center items-center border border-destructive rounded-xl">
              <p className="text-center -mt-2 text-lg text-destructive">
                Under construction
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="mb-4 text-3xl font-bold text-left">
            Popular collections
          </h1>
          <div className="p-1">
            <div className="w-full flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border shadow-sm bg-white">
              <div className="group relative shadow-md hover:shadow-lg select-none hidden md:flex flex-col w-full h-84 bg-gradient-to-t from-green-800/90 via-green-400 to-purple-600 bg-[length:100%_200%] bg-[position:0%_10%] hover:bg-[position:0%_90%] transition-all duration-1000 ease-out rounded-lg max-w-[256px] p-4">
                <div className="absolute top-4 left-4 w-4 h-4 bg-white rounded-full border border-border group-hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] " />
                <div className="mt-auto transform transition-transform duration-[1200ms] group-hover:-translate-y-48 ease-out h-auto overflow-hidden">
                  <h1 className="text-2xl text-white font-bold">
                    Create collection
                  </h1>
                  <div className="my-2 flex flex-col">
                    <p className="text-white leading-tight">
                      Want to make your own? Let's get right to it
                    </p>
                  </div>
                </div>
              </div>
              <PopularCollections />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
