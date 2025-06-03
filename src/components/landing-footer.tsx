import { Copyright } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashFooter() {
    return (
        <div className="w-full flex bg-[#e5e7eb] dark:bg-[#141414] items-center justify-center p-2 pt-6 pl-5">
            <footer className="relative flex flex-col md:px-8 lg:px-12 px-2 w-[88%] items-center justify-between md:gap-6 gap-10 mb-5">
                <div className="w-full flex flex-col md:flex-row gap-x-4 gap-8 items-center justify-between">
                    <div className="flex flex-col items-start gap-2">
                        <b>Subscribe to our newsletter!</b>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Email" className="bg-white dark:bg-zinc-800" />
                            <Button className="text-white">Subscribe</Button>
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-row gap-3">
                            <Link
                                href={"https://www.instagram.com/0xaa55h/"}
                                className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:bg-black dark:hover:bg-neutral-300 transition-color duration-200"
                            >
                                <FaInstagram className="text-accent" size={34} />
                            </Link>
                            <Link
                                href={"https://github.com/KoblizekXD/notables"}
                                className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:bg-black dark:hover:bg-neutral-300 transition-color duration-200"
                            >
                                <FaGithub className="text-accent" size={34} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 justify-between">
                            <Link href="./about-us" className="hover:underline flex whitespace-nowrap justify-between">
                                About Notables
                                <ChevronRight />
                            </Link>
                            <Link href="./privacy-policy" className="hover:underline flex  whitespace-nowrap justify-between">
                                Privacy Policy
                                <ChevronRight />
                            </Link>
                            <Link href="./terms-of-service" className="hover:underline flex  whitespace-nowrap justify-between">
                                Terms of Service
                                <ChevronRight />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center">
                    <p className="flex flex-row gap-2 items-center font-semibold text-poppins  text-lg">
                        <Copyright size={20} />
                        Notables
                    </p>
                </div>
            </footer >
        </div>
    )
}