import RecentNotes from "@/components/home-recent-notes";

export default function Home() {
  return (
    <div className="grid grid-rows-3 grid-cols-1 w-full lg:max-w-4xl xl:max-w-7xl lg:mx-auto lg:mt-8 xl:mt-12 ">
      <div>
        <h1 className="text-3xl font-bold text-center md:text-start">Recent Notes</h1>
        <div className="md:ml-2 lg:ml-4 xl:ml-6">
          <RecentNotes />
        </div>
      </div>
    </div>
  );
}
