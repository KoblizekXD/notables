import DashFooter from "@/components/layout/dashboard-footer";
import Filler from "@/components/layout/filler-content";
import NavMenu from "@/components/layout/landing-page-nav";
import Logo from "@/components/layout/logo";
import LinkingButton from "@/components/linking-button";
import ThemeBasedRenderer from "@/components/theme/theme-based-renderer";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main className="min-h-screen w-screen max-w-[100vw] self-center items-center flex flex-col lg:gap-28 md:gap-38 gap-60">
        <ThemeBasedRenderer
          light={
            <div className="absolute inset-0 -z-10 h-[120%] w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          }
        />
        <Logo destination="/" />
        <div className="absolute top-2">
          <NavMenu className="md:opacity-100 opacity-0 transition-opacity duration-150 ease-in-out" />
        </div>
        <ThemeToggle className="absolute right-2 top-2" />
        <div className="text-center lg:mt-[30vh] md:mt-[24vh] mt-[18vh] flex gap-y-10 md:gap-y-3 flex-col items-center md:p-4 px-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href={"/docs/api"}
              className="rounded-full shadow-xl max-w-[7.6rem] text-xs text-accent bg-accent-foreground hover:opacity-85 duration-250 ease-in-out gap-x-1 border py-1 px-2 flex items-center">
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
            <Link
              className=" underline font-semibold hover:text-[#a086e7] duration-250 text-accent-foreground"
              href={"#more"}
              passHref>
              Learn more
            </Link>
          </div>
        </div>
        <section id="more" className="flex flex-col items-center justify-center gap-32 pt-3 w-full">
          <Filler />
        </section>
      </main>
      <DashFooter />
    </div>
  );
}
