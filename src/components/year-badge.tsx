import { Crown, X } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface YearBadgeProps {
    createdAt: Date;
}

export default async function YearBadge({createdAt}: YearBadgeProps) {
    return (
        <>
            {(() => {
                return createdAt ? (new Date().getFullYear() - createdAt.getFullYear() > 0 ? (
                    <div className="flex items-center justify-between gap-2 px-4 py-5">
                        <HoverCard>
                            <HoverCardTrigger>
                                <div className="rounded-full relative flex w-12 h-12 dark:bg-white bg-black text-accent font-bold text-2xl select-none cursor-pointer z-10 items-center justify-center">
                                    {new Date().getFullYear() - createdAt.getFullYear()}
                                    <Crown className="absolute left-1/10 top-1/10 -z-10 text-neutral-600 dark:text-neutral-400" size={38} />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-36 max-h-10 py-1 px-0 flex gap-2 items-center justify-center">
                                <p className="text-sm font-bold">{new Date().getFullYear() - createdAt.getFullYear()} year badge</p>
                                <Crown className="text-amber-500" />
                            </HoverCardContent>
                        </HoverCard>
                        <p className="flex flex-col items-center whitespace-nowrap">Account created <br /> {createdAt.toString().substring(4, 15)}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-baseline gap-3 px-4 py-5">
                        <div className="flex flex-col items-center justify-baseline">
                            <p>Account created:</p>
                            <p>{createdAt.toString().substring(4, 15)}</p>
                        </div>
                        <div className="px-2 py-1 bg-accent rounded-xl border dark:text-red-300 text-red-600 flex items-center gap-1">
                            <X className="text-red-600" /> No badges
                        </div>
                    </div>
                )) : null;
            })()}
        </>
    );
}