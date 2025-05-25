import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, TextCursor, Check, CalendarDays } from "lucide-react";

export default function WhyUsCards() {
    
    
    return (
        <div className="flex lg:flex-row flex-col md:px-6 max-w-[90%] gap-4 md:gap-6 lg:gap-12">
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 bg-white dark:bg-[#0c0a09] rounded-xl gap-6 max-w-84 min-w-[18.79rem] shadow-[3px_2px_20px_rgba(0,0,0,0.1)]">
                <h1 className="text-4xl font-bold pl-2">1.</h1>
                <h4 className="flex justify-center items-center text-xl font-bold">Create your own notes and games</h4>
                <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between items-center shadow-xs min-w-[265px] min-h-[202px]">
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
                    <div className="flex flex-col w-full h-full relative items-start min-h-30">
                        <div className="flex items-start pr-2 pb-2 ">
                            <p className="select-none md:text-lg p-2 pt-0 md:pt-5 flex">
                                Lorem ipsum dolor sit amet cons | {/* <span className="animate-pulse">|</span> */}
                            </p>
                        </div>
                        <TextCursor className="absolute right-40 top-10" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800 bg-white dark:bg-[#0c0a09] rounded-xl max-w-84 gap-6 min-w-[18.79rem] shadow-[3px_2px_20px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-6">
                    <h1 className="text-4xl font-bold pl-2">2.</h1>
                    <h4 className="flex justify-center items-center text-xl font-bold">Share knowledge with others</h4>
                </div>
                <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl flex flex-row items-start shadow-xs lg:p-5 p-3 gap-x-3 min-w-[265px]">
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
            <div className="flex flex-col justify-between px-4 py-6 border-2 border-solid border-[#d7d7da] dark:border-zinc-800  bg-white dark:bg-[#0c0a09] rounded-xl gap-6 max-w-84 min-w-[18.79rem] shadow-[3px_2px_20px_rgba(0,0,0,0.1)]">
                <h1 className="text-4xl font-bold pl-2">3.</h1>
                <h4 className="flex justify-center items-center text-xl font-bold">Play games and learn efficiently</h4>
                <div className="border-2 border-solid border-gray-200 dark:border-zinc-800 rounded-xl items-center shadow-xs min-w-[265px] min-h-[202px] justify-center grid grid-cols-2 grid-rows-2 gap-2 p-1 px-2">
                    <div className="bg-[#c5c5c5] dark:bg-[#a0a0a0] font-semibold h-20  items-center justify-center flex border-2 border-solid border-[#777777] rounded-xl">
                        Albert Einstein
                    </div>
                    <div className="bg-[#5DEE83] h-20  items-center justify-center flex border-2 border-solid border-[#47a660] rounded-xl">
                        <Check color="#47a660" size={30} />
                    </div>
                    <div className="bg-[#5DEE83] h-20  items-center justify-center flex border-2 border-solid border-[#47a660] rounded-xl">
                        <Check color="#47a660" size={30} />
                    </div>
                    <div className="bg-[#c5c5c5] dark:bg-[#a0a0a0] font-semibold h-20  items-center justify-center flex border-2 border-solid border-[#777777] rounded-xl">
                        Albert Einstein
                    </div>
                </div>
            </div>
        </div>
    )
}