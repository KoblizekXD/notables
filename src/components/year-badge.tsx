import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Crown } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

export default async function YearBadge() {
    const session = await auth.api.getSession({ headers: await headers() });

    return (
        <div>
            {(() => {
                const createdAt = session?.user?.createdAt ? new Date(session?.user.createdAt) : null;

                return createdAt ? (new Date().getFullYear() - createdAt.getFullYear() < 5 ? (
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className="rounded-full relative flex w-12 h-12 dark:bg-white bg-black text-accent font-bold text-2xl select-none cursor-pointer z-10 items-center justify-center">
                                {new Date().getFullYear() - createdAt.getFullYear()}
                                <Crown className="absolute left-1/10 top-1/10 -z-10 text-neutral-600 dark:text-neutral-400" size={38} />
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-36 max-h-10 py-1 px-0 flex gap-2 items-center justify-center">
                            <p className="text-sm font-bold">{new Date().getFullYear() - createdAt.getFullYear()} year badge</p>
                            <Crown className="text-amber-500"/>
                        </HoverCardContent>
                    </HoverCard>
                ) : (
                    <div className="px-2 py-1 bg-accent rounded-xl border-2 border-solid dark:border-red-700 border-red-400 dark:text-red-400 text-red-700">
                        ❌ No badges
                    </div>
                )) : null;
            })()}
        </div>
    );
}