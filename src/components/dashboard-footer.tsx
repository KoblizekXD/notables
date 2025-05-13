import { Copyright } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashFooter() {
    return (
        <footer className="relative flex md:px-12 px-2 w-[80%] items-center justify-between gap-3 mb-12">
            <div className="flex flex-col items-start gap-2">
                <p>Subscribe to our newsletter!</p>
                <div className="flex items-center gap-2">
                    <Input placeholder="Email" />
                    <Button className="text-white">Subscribe</Button>
                </div>
            </div>
            <p className="flex flex-row absolute bottom-0 items-center gap-2 w-auto">
                <Copyright size={20} />
                Chigga solutions
            </p>
            <div>odkazy</div>


            {/* Created by:
            <Link href={"https://github.com/KoblizekXD"}>AA55h</Link>
            <Link href={"https://github.com/vojtiikxdd"}>vojtiikxdd</Link>
            <Link href={"https://github.com/KebabObama"}>KebabObama</Link> */}
        </footer >
    )
}