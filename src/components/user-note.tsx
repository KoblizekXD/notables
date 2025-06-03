import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button"
import Rating from "./note-rating";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

type props = {
    title: string;
    entity: string;
    createdAt: Date | undefined;
    rating: number;
    tags: string[];
}

export default async function UserNote({ title, entity, createdAt, tags, rating }: props) {
    return (
        <div className="border-2 border-solid border-gray-300 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-y-4 w-auto max-w-66">
            <h1 className="font-semibold">
                {title} - <span className="text-sm font-light">{entity}</span>
            </h1>
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-x-1">
                    <CalendarDays className="text-gray-500" />
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button variant="link" className="text-while px-1">
                                {createdAt?.getFullYear().toString()}
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="max-w-44 flex items-center justify-center">
                            {createdAt?.toDateString()}
                        </HoverCardContent>
                    </HoverCard>
                </div>

                {/* 
                <div className="flex items-center gap-x-2">
                    {tags.map((tag) => (
                        <span key={tag} className="text-sm rounded-md bg-accent p-0.5 dark:text-gray-500">{tag}</span>
                    ))}
                </div> 
                */}

                <Rating rating={rating} />
            </div>
        </div>
    )
}