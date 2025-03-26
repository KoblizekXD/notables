import LinkingButton from "@/components/linking-button";
import ThemeBasedRenderer from "@/components/theme-based-renderer";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full border items-center flex flex-col">
      <ThemeBasedRenderer
        light={
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        }
      />
      <div className="text-center mt-[35vh] flex gap-y-3 flex-col items-center">
        <Link
          href={"/docs/api"}
          className="rounded-full shadow-xl text-xs bg-[#F5F5F5] gap-x-1 text-secondary-foreground border py-1 px-2 flex items-center"
        >
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
            className="bg-primary text-white flex items-center"
          >
            <ArrowRight />
            <span>Get started</span>
          </LinkingButton>
          <Link className="underline font-semibold" href={"/#more"} passHref>
            Learn more
          </Link>
        </div>
      </div>
    </main>
  );
}
