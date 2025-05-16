import NavMenu from "@/components/landing-page-nav";
import LinkingButton from "@/components/linking-button";
import Logo from "@/components/logo";
import ThemeBasedRenderer from "@/components/theme-based-renderer";
import { ThemeToggle } from "@/components/theme-toggle";

import Logo from "@/components/logo";
import NavMenu from "@/components/landing-page-nav";
import { ChevronDown, ArrowUpRight, TextCursor } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-screen max-w-[100vw] border items-center flex flex-col ArrowGap">
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
      <div className="text-center mt-[30vh] flex gap-y-3 flex-col items-center p-4 px-6">
        <Link
          href={"/docs/api"}
          className="rounded-full shadow-xl text-xs text-accent bg-accent-foreground hover:opacity-85 duration-250 ease-in-out gap-x-1 border py-1 px-2 flex items-center">
          🚀 Use our API
          <ChevronRight size={12} strokeWidth={3} />
        </Link>
        <h1 className="text-6xl mt-[2vh] font-header">
          All your learning in one place
        </h1>
        <h2 className="text-3xl font-header">
          Let your mind learn faster than ever, for free, forever.
        </h2>
        <div className="flex items-center gap-x-4">
          <LinkingButton
            href="/sign-in"
            className="bg-primary shadow-xl text-white flex items-center">
            <ArrowRight />
            <span>Get started</span>
          </LinkingButton>
          <Link
            className="underline font-semibold hover:text-[#a086e7] duration-250 text-accent-foreground"
            href={"/#more"}
            passHref>
            Learn more
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-16">
        <Link href="#whyUs" className="flex items-center justify-center px-2 border-2 border-solid border-transparent hover:border-[#d7d7da] dark:hover:border-zinc-800 transition-colors duration-200 rounded-xl cursor-pointer max-w-screen">
          <ChevronDown size={40} />
        </Link>
        <section id="whyUs" className="flex flex-col items-center justify-center gap-8">
          <h1 className="font-extrabold text-4xl">Why us?</h1>
          <div className="flex flex-row justify-between px-6 flex-wrap gap-12">
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl gap-6 max-w-84">
              <h1 className="text-4xl font-bold pl-2">1.</h1>
              <h4 className="flex justify-center items-center text-xl font-bold">Create your own notes and games!</h4>
              <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between items-center">
                <div className="flex items-center justify-between w-full p-1 px-2">
                  <h1 className="text-xl font-bold select-none">Heading</h1>
                  <div className="flex gap-x-2">
                    <button
                      className="cursor-default bg-slate-200 select-none text-[#0F172A] rounded-lg px-2 py-2"
                      disabled={true}
                    >
                      Save
                    </button>
                    <button
                      className="cursor-default bg-slate-900 select-none text-white rounded-lg px-2 py-2
                    flex items-center"
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
                    <p className="border-r-2 border-solid border-black select-none h-6 flex items-center">
                      Lorem ipsum dolor sit amet cons{" "}
                    </p>
                  </div>
                  <TextCursor className="absolute right-40 top-10" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl gap-6 max-w-84">
              <h1 className="text-4xl font-bold pl-2">1.</h1>
              <h4 className="flex justify-center items-center text-xl font-bold">Create your own notes and games!</h4>
              <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between items-center">
                <div className="flex items-center justify-between w-full p-1 px-2">
                  <h1 className="text-xl font-bold select-none">Heading</h1>
                  <div className="flex gap-x-2">
                    <button
                      className="cursor-default bg-slate-200 select-none text-[#0F172A] rounded-lg px-2 py-2"
                      disabled={true}
                    >
                      Save
                    </button>
                    <button
                      className="cursor-default bg-slate-900 select-none text-white rounded-lg px-2 py-2
                    flex items-center"
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
                    <p className="border-r-2 border-solid border-black select-none h-6 flex items-center">
                      Lorem ipsum dolor sit amet cons{" "}
                    </p>
                  </div>
                  <TextCursor className="absolute right-40 top-10" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 rounded-xl gap-6 max-w-84">
              <h1 className="text-4xl font-bold pl-2">1.</h1>
              <h4 className="flex justify-center items-center text-xl font-bold">Create your own notes and games!</h4>
              <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between items-center">
                <div className="flex items-center justify-between w-full p-1 px-2">
                  <h1 className="text-xl font-bold select-none">Heading</h1>
                  <div className="flex gap-x-2">
                    <button
                      className="cursor-default bg-slate-200 select-none text-[#0F172A] rounded-lg px-2 py-2"
                      disabled={true}
                    >
                      Save
                    </button>
                    <button
                      className="cursor-default bg-slate-900 select-none text-white rounded-lg px-2 py-2
                    flex items-center"
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
                    <p className="border-r-2 border-solid border-black select-none h-6 flex items-center">
                      Lorem ipsum dolor sit amet cons{" "}
                    </p>
                  </div>
                  <TextCursor className="absolute right-40 top-10" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
