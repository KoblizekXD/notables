"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type RatingProps = {
    rating: number;
};

export default function Rating({rating}: RatingProps) {
    const [upvoteFill, setUpvoteFill] = useState("transparent");
    const [downvoleFill, setDownvoteFill] = useState("transparent");
    
    return (
        <div className="flex items-center justify-center gap-x-2">
            {rating}
            <div className="flex gap-x-0.5">
                <button type="button" onClick={() => {
                    if (upvoteFill === "transparent") {
                        setUpvoteFill("#86efac");
                        setDownvoteFill("transparent");
                    } else {
                        setUpvoteFill("transparent");
                        setDownvoteFill("transparent");
                    }
                }}>
                    <ThumbsUp id="upvote" size={20} className="text-green-600 cursor-pointer" fill={upvoteFill} />
                </button>
                <span className="border-l border-neutral-400 dark:border-neutral-800" />
                <button type="button" onClick={() => {
                    if (downvoleFill === "transparent") {
                        setDownvoteFill("#fca5a5");
                        setUpvoteFill("transparent");
                    } else {
                        setDownvoteFill("transparent");
                        setUpvoteFill("transparent");
                    }
                }}>
                    <ThumbsDown id="downvote" size={20} className="text-red-600 cursor-pointer" fill={downvoleFill} />
                </button>
            </div>
        </div>
    );
}