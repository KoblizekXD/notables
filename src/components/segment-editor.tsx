"use client";

import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { Settings2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BlockMath } from "react-katex";
import { type BundledLanguage, bundledLanguages } from "shiki";
import { toast } from "sonner";
import { CodeBlock } from "./codeblock";
import { useEditorContext } from "./editor-context";
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

interface GenericSegmentProps {
  segment: NoteSegment;
  onUpdate: (updatedSegment: NoteSegment) => void;
}

function TextSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "text" }>;
  return (
    <>
      <Input
        placeholder="Title"
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              heading: e.currentTarget.value,
            },
          });
        }}
        defaultValue={sgmnt.content.heading}
      />
      <Textarea
        value={sgmnt.content.text}
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        placeholder="Write your text here..."
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              text: e.currentTarget.value,
            },
          });
        }}
        rows={1}
        style={{ overflow: "hidden", resize: "none" }}
      />
      <p className="text-xs text-muted-foreground font-semibold">
        We support Markdown!
      </p>
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
        style={{ overflow: "hidden", resize: "none" }}
      />
    </div>
  );
}

function MathSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "formula" }>;
  const [formula, setFormula] = useState<string>("");

  return (
    <div className="flex relative flex-col gap-y-2">
      <Textarea
        placeholder="Math expression"
        className="resize-none"
        onInput={(e) => {
          setFormula(e.currentTarget.value || "");
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              formula: e.currentTarget.value,
            },
          });
        }}
      />
      <h1 className="font-semibold text-muted-foreground">Preview:</h1>
      <BlockMath math={formula} />
      <Input
        placeholder="Description"
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              description: e.currentTarget.value,
            },
          });
        }}
      />
    </div>
  );
}

const items = Object.keys(bundledLanguages).map((lang) => (
  <SelectItem value={lang} key={lang}>
    {lang}
  </SelectItem>
));

function CodeSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "code" }>;
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<BundledLanguage>("typescript");

  return (
    <div className="flex relative flex-col gap-y-2">
      <Textarea
        placeholder="Your code here..."
        className="resize-none overflow-y-hidden"
        onInput={(e) => {
          setCode(e.currentTarget.value || "");
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              code: e.currentTarget.value,
            },
          });
        }}
      />
      <Select
        value={language}
        onValueChange={(x) => {
          setLanguage(x as BundledLanguage);
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              language: x,
            },
          });
        }}
        name="language"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </Select>
      <h1 className="font-semibold text-muted-foreground">Preview:</h1>
      <CodeBlock lang={language}>{code}</CodeBlock>
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
  const { segments, setSegments } = useEditorContext();

  const handleSegmentUpdate = (index: number, updatedSegment: NoteSegment) => {
    setSegments((prev) => {
      const newSegments = [...prev];
      newSegments[index] = updatedSegment;
      return newSegments;
    });
  };

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
            {segment.type === "text" ? (
              <TextSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : segment.type === "image" ? (
              <ImageSegment />
            ) : segment.type === "formula" ? (
              <MathSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : segment.type === "code" ? (
              <CodeSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : (
              ""
            )}
          </motion.div>
        ))
      ) : (
        <div className="text-muted-foreground text-sm">
          No segments yet. Add a segment to get started.
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
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
        className="flex w-full mt-4 gap-x-2"
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
        <Button type="submit" className="ml-auto" variant={"outline"}>
          Insert
        </Button>
      </form>
    </div>
  );
}
