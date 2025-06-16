import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Crown, X } from "lucide-react";

interface YearBadgeProps {
  createdAt: Date;
}

export default async function YearBadge({ createdAt }: YearBadgeProps) {
  return (
    <>
      {(() => {
        return createdAt ? (
          new Date().getFullYear() - createdAt.getFullYear() > 0 ? (
            <div className="flex max-h-24 my-auto items-center justify-between gap-2 py-5">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="rounded-full relative flex w-12 h-12 dark:bg-white bg-black text-accent font-bold text-2xl select-none cursor-pointer z-10 items-center justify-center">
                    {new Date().getFullYear() - createdAt.getFullYear()}
                    <Crown
                      className="absolute left-1/10 top-1/10 -z-10 text-neutral-600 dark:text-neutral-400"
                      size={38}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-36 max-h-10 py-1 px-0 flex gap-2 items-center justify-center">
                  <p className="text-sm font-bold">
                    {new Date().getFullYear() - createdAt.getFullYear()} year
                    badge
                  </p>
                  <Crown className="text-amber-500" />
                </HoverCardContent>
              </HoverCard>
              <div className="flex h-auto gap-1 flex-col items-center justify-center">
                <p className="whitespace-nowrap">Account created</p>
                <p className="whitespace-nowrap">{createdAt.toString().substring(4, 15)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-baseline gap-3 py-5">
              <div className="flex flex-col items-center justify-baseline">
                <p>Account created:</p>
                <p>{createdAt.toString().substring(4, 15)}</p>
              </div>
              <div className="px-2 py-1 bg-accent rounded-xl border dark:text-red-300 text-red-600 flex items-center gap-1">
                <X className="text-red-600" /> No badges
              </div>
            </div>
          )
        ) : null;
      })()}
    </>
  );
}
