import Link from "next/link";
import { Upload } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserDescription() {
    const session = await auth.api.getSession({ headers: await headers() });

    // const descriptionText = session?.user.description || null;    
    const descriptionText = "lol Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo eum libero, quos, sapiente cum, a voluptatibus corrupti minus fugit doloribus veniam aperiam excepturi aut! Voluptate fuga ab facere illo asperiores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia eveniet accusantium voluptatum ullam possimus illum, deleniti placeat in nostrum tenetur non dolore recusandae dignissimos culpa cum odit voluptates soluta corrupti! Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quo doloribus rem officia doloremque. Esse explicabo saepe ratione facilis dolorem nam! Sapiente nam sint maiores corporis minus fugit quas fugiat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint expedita vel eveniet vero ratione velit, pariatur, veritatis explicabo consequuntur dignissimos, eos nisi similique voluptate assumenda labore fugiat hic saepe aliquam. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit consequatur enim porro at ea maiores quisquam voluptatem consequuntur recusandae vel, cum dolorum nobis natus doloremque voluptatum libero voluptatibus mollitia neque!";

    return (
        <div className="flex flex-col gap-y-6 items-center justify-center rounded-xl w-full h-full ">
            {descriptionText !== null ? (
                <div className="rounded-sm overflow-hidden">
                    <p className="max-h-95 scrollbar-custom rounded-xl overflow-y-auto p-2 py-3 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 text-gray-500 dark:text-gray-400">
                        {descriptionText}
                    </p>
                </div>
            ) : (
                <div className="flex opacity-[0.8] flex-col gap-y-6 items-center justify-center border-2 border-dashed border-red-500 rounded-lg w-full h-full text-red-900 dark:text-red-500">
                    <p className="text-xl">User has no description</p>
                    <Link href={`./upload/${session?.user.id}`} className="p-2 border-2 border-solid border-transparent hover:border-accent transition-colors duration-150 rounded-xl" >
                        <Upload className="text-red-800 dark:text-red-500" />
                    </Link>
                </div>
            )}
        </div >
    );
}