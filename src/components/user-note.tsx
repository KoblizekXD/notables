import { CalendarDays } from "lucide-react";


type props = {
    title: string;
    description: string;
    createdAt: Date | undefined;
    // rating: number;
    // tags: string[];
}

export default async function UserNote({ title, description, createdAt }: props) {
    return (
        <div className="border-2 border-solid border-gray-300 rounded-xl p-4 flex flex-col gap-y-4 w-auto max-w-66">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-sm">{description}</p>
            <div className="flex items-center justify-baseline gap-x-2">
                <CalendarDays className="text-gray-500" />
                <p className="text-sm text-gray-500">
                    Created {createdAt?.toString().substring(4, 15)}
                </p>
                {/* <div className="flex items-center gap-x-2">
                    {tags.map((tag) => (
                        <span key={tag} className="text-sm text-gray-500">{tag}</span>
                    ))}
                </div> */}
            </div>
        </div>
    )
}