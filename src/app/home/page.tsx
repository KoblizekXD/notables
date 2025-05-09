import RecentNotes from "@/components/home-recent-notes";
import PopularCollections from "@/components/poular-collections";

export default function Home() {
  return (
    <div className="flex flex-col w-full lg:max-w-4xl xl:max-w-7xl  lg:mx-auto lg:my-8 xl:my-12 gap-2 md:gap-4 lg:gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-center md:text-start">
          Recent Notes
        </h1>
        <div className="md:ml-2 lg:ml-4 xl:ml-6">
          <RecentNotes />
        </div>
      </div>
      <div>
        <h1 className="mb-2 text-3xl font-bold text-center md:text-start">
          Interesting discussions
        </h1>
        <div className="md:ml-2 lg:ml-4 xl:ml-6">
          <div className="h-36 w-full flex flex-row justify-center m-2 items-center border border-red-600 rounded-xl">
            <p className="text-center -mt-2 text-lg text-destructive p-2">
              Under construction
            </p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="mb-2 text-3xl font-bold text-center md:text-start">
          Popular collections
        </h1>
        <div className="md:ml-2 lg:ml-4 xl:ml-6">
          <div className="h-96 w-full md:flex flex-row m-2 items-center border border-border shadow-md rounded-xl p-6 gap-2">
            <div className="group relative shadow-md hover:shadow-lg select-none hidden md:flex flex-col w-full h-84 bg-gradient-to-t from-green-800/90 via-green-400 to-purple-600 bg-[length:100%_200%] bg-[position:0%_10%] hover:bg-[position:0%_90%] transition-all duration-1000 ease-out rounded-lg max-w-[256px] p-4">
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
  );
}
