import { Copyright } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashFooter() {
    return (
        <footer className="relative flex md:px-12 px-2 w-[80%] items-center justify-between gap-3 mb-12">
            <div className="flex flex-col items-start gap-2">
                <b>Subscribe to our newsletter!</b>
                <div className="flex items-center gap-2">
                    <Input placeholder="Email" />
                    <Button className="text-white">Subscribe</Button>
                </div>
            </div>
            <p className="flex flex-row absolute bottom-0 items-center gap-2 w-auto">
                <Copyright size={20} />
                Chigga solutions
            </p>
            <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-3">
                    <Link
                        href={"https://www.instagram.com/0xaa55h/"}
                        className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:opacity-[0.8] transition-opacity duration-200"
                    >
                        <FaInstagram className="text-accent" size={34} />
                    </Link>

                    <Link
                        href={"https://github.com/KoblizekXD/notables"}
                        className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:opacity-[0.8] transition-opacity duration-200"
                    >
                        <FaGithub className="text-accent" size={34} />
                    </Link>

                </div>
                <div className="flex flex-col gap-2 justify-between">
                    <Link href="./about-us" className="hover:underline flex justify-between">
                        About Notables
                        <ChevronRight />
                    </Link>
                    <Link href="./privacy-policy" className="hover:underline flex justify-between">
                        Privacy Policy
                        <ChevronRight />
                    </Link>
                    <Link href="./terms-of-service" className="hover:underline flex justify-between">
                        Terms of Service
                        <ChevronRight />
                    </Link>
                </div>
            </div>


            {/* Created by:
            <Link href={"https://github.com/KoblizekXD"}>AA55h</Link>
            <Link href={"https://github.com/vojtiikxdd"}>vojtiikxdd</Link>
            <Link href={"https://github.com/KebabObama"}>KebabObama</Link> */}
        </footer >
    )
}