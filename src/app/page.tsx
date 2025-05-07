import LinkingButton from "@/components/linking-button";
import ThemeBasedRenderer from "@/components/theme-based-renderer";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/logo";
import NavMenu from "@/components/landing-page-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CornerLeftDown, ArrowUpRight, TextCursor, Check, CalendarDays } from "lucide-react";


export default function Home() {
  return (
    <main className="min-h-screen w-screen max-w-screen items-center flex flex-col lg:gap-28 md:gap-38 gap-60 ">
      <ThemeBasedRenderer
        light={
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        }
      />
      <Logo />
      <div className="absolute top-2">
        <NavMenu className="navMenu transition-opacity duration-150 ease-in-out" />
      </div>
      <ThemeToggle className="absolute right-2 top-2" />
      <div className="text-center lg:mt-[30vh] md:mt-[24vh] mt-[18vh] flex gap-y-10 md:gap-y-3 flex-col items-center md:p-4 px-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            href={"/docs/api"}
            className="rounded-full shadow-xl max-w-[7.6rem] text-xs text-accent bg-accent-foreground hover:opacity-85 duration-250 ease-in-out gap-x-1 border py-1 px-2 flex items-center"
          >
            🚀 Use our API
            <ChevronRight size={12} strokeWidth={3} />
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mt-[2vh] font-header">
            All your learning in one place
          </h1>
          <h2 className="md:text-3xl text-2xl font-header">
            Let your mind learn faster than ever, for free, forever.
          </h2>
        </div>
        <div className="flex items-center gap-x-4">
          <LinkingButton
            href="/sign-in"
            className="bg-primary shadow-xl text-white flex items-center">
            <ArrowRight />
            <span>Get started</span>
          </LinkingButton>
          <Link className=" underline font-semibold hover:text-[#a086e7] duration-250 text-accent-foreground"
            href={"/#more"} passHref>
            Learn more
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-32">
        <h1 className="font-extrabold text-4xl flex gap-4 relative">
          <CornerLeftDown size={50} className="absolute top-2 -left-15" />
          Why us?
        </h1>
        <div className="grid max-w-screen lg:flex-row lg:grid-cols-3 grid-cols-1 justify-between px-6 gap-12">
          <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl gap-6 lg:max-w-84">
            <h1 className="text-4xl font-bold pl-2">1.</h1>
            <h4 className="flex justify-center items-center text-xl font-bold">Create your own notes and games</h4>
            <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between items-center shadow-md min-w-[265px] min-h-[202px]">
              <div className="flex items-center justify-between w-full p-1 px-2">
                <h1 className="text-xl font-bold select-none">Heading</h1>
                <div className="flex gap-x-2">
                  <button
                    type="button"
                    className="cursor-default bg-slate-200 hover:bg-slate-400 transition-colors duration-200 select-none text-[#0F172A] rounded-lg px-2 py-2"
                    disabled={true}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="cursor-default bg-slate-900 hover:bg-slate-950 transition-colors duration-200 select-none text-white rounded-lg px-2 py-2 flex items-center"
                    disabled={true}
                  >
                    Post
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
              <hr className="w-full h-0.5 bg-gray-200 dark:bg-zinc-800" />
              <div className="flex flex-col items-start relative min-h-30">
                <div className="flex items-center pr-2 py-2 ">
                  <p className="select-none h-6 p-2 md:pt-5 flex items-center">
                    Lorem ipsum dolor sit amet cons | {/* <span className="animate-pulse">|</span> */}
                  </p>
                </div>
                <TextCursor className="absolute right-40 top-10" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl lg:max-w-84">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold pl-2">2.</h1>
              <h4 className="flex justify-center items-center text-xl font-bold">Share knowledge with others</h4>
            </div>
            <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-row items-start shadow-md lg:p-5 p-3 gap-x-3 min-w-[265px]">
              <Avatar>
                <AvatarImage src="./pfp.png" alt="@shadcn" />
                <AvatarFallback>idk</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-1 items-start">
                  <h1 className="font-bold text-xl">Random user</h1>
                  <p className="leading-4">Munich Agreement - Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <CalendarDays size={18} color="#a3a3a3" />
                  <p className="text-sm whitespace-nowrap">Created 24. June 2025</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl gap-6 lg:max-w-84">
            <h1 className="text-4xl font-bold pl-2">3.</h1>
            <h4 className="flex justify-center items-center text-xl font-bold">Play games and learn efficiently</h4>
            <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl items-center shadow-md min-w-[265px] min-h-[202px] justify-center grid grid-cols-2 grid-rows-2 gap-2 p-1 px-2">
              <div className="bg-[#a3a3a3] h-20  items-center justify-center flex border-2 border-solid border-[#777777] rounded-xl">
                Albert Einstein
              </div>
              <div className="bg-[#5DEE83] h-20  items-center justify-center flex border-2 border-solid border-[#47a660] rounded-xl">
                <Check color="#47a660" size={30} />
              </div>
              <div className="bg-[#5DEE83] h-20  items-center justify-center flex border-2 border-solid border-[#47a660] rounded-xl">
                <Check color="#47a660" size={30} />
              </div>
              <div className="bg-[#a3a3a3] h-20  items-center justify-center flex border-2 border-solid border-[#777777] rounded-xl">
                Albert Einstein
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>

      </footer>
    </main >
  );
}
