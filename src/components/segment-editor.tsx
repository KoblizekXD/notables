"use client";

import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TooltipWrapper from "./tooltip-wrapper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Image from "next/image";

function TextSegment({
  value,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <>
      <Input placeholder="Title" />
      <Textarea
        value={value}
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        placeholder="Write your text here..."
        onChange={onChange}
        rows={1}
        style={{ overflow: "hidden", resize: "none" }}
        {...props}
      />
    </>
  );
}

function ImageSegment() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  };

  return (
    <div className="flex relative flex-col gap-y-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {imageUrl && (
        <Image
        src={imageUrl}
          alt="Uploaded image"
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto max-w-[620px] rounded-md"
      />
      )}
      <Textarea
        placeholder="Description"
        rows={1}
        style={{ overflow: 'hidden', resize: 'none' }}
      />
    </div>
  );
}

export type NoteSegment =
  | {
      type: "text";
      content: {
        heading?: string;
        text: string;
      };
    }
  | {
      type: "image";
      content: {
        src: string;
        alt?: string;
      };
    }
  | {
      type: "list";
      content: {
        items: string[];
        ordered?: boolean;
      };
    }
  | {
      type: "code";
      content: {
        heading?: string;
        language: string;
        code: string;
      };
    }
  | {
      type: "quote";
      content: {
        text: string;
        author?: string;
        source?: string;
      };
    }
  | {
      type: "formula";
      content: {
        formula: string;
        description?: string;
      };
    }
  | {
      type: "table";
      content: {
        rows: string[][];
        headers?: string[];
      };
    };

export default function SegmentEditor() {
  const [segments, setSegments] = useState<NoteSegment[]>([]);

  return (
    <div className="flex mt-6 items-center flex-col mb-36 gap-y-2">
      {segments.length > 0 ? (
        segments.map((segment, index) => (
          <motion.div
            key={`${segment.type}-${index}`}
            initial={{ opacity: 0, y: "calc(var(--spacing) * -2)" }}
            animate={{ opacity: 1, y: "calc(var(--spacing) * 2)" }}
            className="border w-[620px] p-4 rounded-md flex flex-col gap-y-2"
          >
            <TooltipWrapper content="Segment options">
              <Button
                className="absolute -translate-x-full -left-2 top-4"
                variant="outline"
                size="icon"
              >
                <Settings2 />
              </Button>
            </TooltipWrapper>
            {segment.type === "text" ? <TextSegment />
            : segment.type === "image" ? (
              <ImageSegment />
            ) : segment.type === "list"}
          </motion.div>
        ))
      ) : (
        <div className="text-muted-foreground text-sm">
          No segments yet. Add a segment to get started.
        </div>
      )}
      <form
        action={(fd) => {
          if (!fd.get("type") || fd.get("type") === undefined) {
            toast.error("Please select a segment type");
            return;
          }
          setSegments((prev) => {
            const newSegment = {
              type: fd.get("type") as NoteSegment["type"],
              content: {},
            } as NoteSegment;
            return [...prev, newSegment];
          });
        }}
        className="flex mt-4 gap-x-2"
      >
        <Select name="type">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Segment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="code">Code Block</SelectItem>
            <SelectItem value="formula">Math Expression</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="table">Table</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant={"outline"}>
          Insert
        </Button>
      </form>
    </div>
  );
}
