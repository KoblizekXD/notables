"use client";

import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { Minus, Plus, Settings2 } from "lucide-react";
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

function QuoteSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "quote" }>;

  return (
    <div className="flex relative flex-col gap-y-2">
      <div
        contentEditable
        className="resize-none border-l-3 outline-none pl-2 py-0.5 italic rounded-none border-y-0 border-r-0 border-border"
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              text: e.currentTarget.textContent || "",
            },
          });
        }}
      />
      <Input
        placeholder="Author"
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              author: e.currentTarget.value,
            },
          });
        }}
      />
      <Input
        placeholder="Source"
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              source: e.currentTarget.value,
            },
          });
        }}
      />
    </div>
  );
}

function ListSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "list" }>;
  const [items, setItems] = useState<string[]>(sgmnt.content.items || [""]);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    onUpdate({
      ...sgmnt,
      content: {
        ...sgmnt.content,
        items: newItems,
      },
    });
  };

  return (
    <div className="flex relative flex-col gap-y-2">
      {items.map((item, index) => (
        <Input
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          value={item}
          onChange={(e) => handleItemChange(index, e.currentTarget.value)}
          placeholder={`Item ${index + 1}`}
        />
      ))}
      <div className="flex items-center">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setItems((prev) => [...prev, ""])}
        >
          Add Item
        </Button>
        <Button
          variant="destructive"
          className="ml-auto"
          onClick={() => {
            setItems((prev) => prev.slice(0, -1));
            onUpdate({
              ...sgmnt,
              content: {
                ...sgmnt.content,
                items: items.slice(0, -1),
              },
            });
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

function TableSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "table" }>;
  const [rows, setRows] = useState<string[][]>(sgmnt.content.rows || []);
  const [headers, setHeaders] = useState<string[]>(sgmnt.content.headers || []);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-2 w-full">
        <table className="flex-1">
          <thead>
            <tr>
              {headers.map((header, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <th key={index}>
                  <Input
                    className="rounded-none text-center focus-visible:ring-0 border-0"
                    value={header}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[index] = e.currentTarget.value;
                      setHeaders(newHeaders);
                      onUpdate({
                        ...sgmnt,
                        content: {
                          ...sgmnt.content,
                          headers: newHeaders,
                        },
                      });
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr]:border-y [&_td]:border-x [&_tr]:border-border">
            {rows.map((row, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <td key={cellIndex}>
                    <Input
                      className="rounded-none text-center focus-visible:ring-0 border-0"
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[rowIndex][cellIndex] = e.currentTarget.value;
                        setRows(newRows);
                        onUpdate({
                          ...sgmnt,
                          content: {
                            ...sgmnt.content,
                            rows: newRows,
                          },
                        });
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col gap-y-2">
          <TooltipWrapper content="Add Column">
            <Button
              onClick={() => {
                setRows((prev) => prev.map((row) => [...row, ""]));
                setHeaders((prev) => [...prev, ""]);
                onUpdate({
                  ...sgmnt,
                  content: {
                    ...sgmnt.content,
                    rows: rows.map((row) => [...row, ""]),
                    headers: [...headers, ""],
                  },
                });
              }}
              variant={"outline"}
              size={"icon"}
            >
              <Plus />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper content="Remove Column">
            <Button
              onClick={() => {
                setRows((prev) => prev.map((row) => row.slice(0, -1)));
                setHeaders((prev) => prev.slice(0, -1));
                onUpdate({
                  ...sgmnt,
                  content: {
                    ...sgmnt.content,
                    rows: rows.map((row) => row.slice(0, -1)),
                    headers: headers.slice(0, -1),
                  },
                });
              }}
              variant={"destructive"}
              size={"icon"}
            >
              <Minus />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
      <div className="flex gap-x-2">
        <TooltipWrapper content="Add Row">
          <Button
            onClick={() => {
              setRows((prev) => [...prev, Array(headers.length).fill("")]);
              onUpdate({
                ...sgmnt,
                content: {
                  ...sgmnt.content,
                  rows: [...rows, Array(headers.length).fill("")],
                },
              });
            }}
            variant={"outline"}
            size={"icon"}
          >
            <Plus />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="Remove Row">
          <Button
            onClick={() => {
              setRows((prev) => prev.slice(0, -1));
              onUpdate({
                ...sgmnt,
                content: {
                  ...sgmnt.content,
                  rows: rows.slice(0, -1),
                },
              });
            }}
            variant={"destructive"}
            size={"icon"}
          >
            <Minus />
          </Button>
        </TooltipWrapper>
      </div>
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
            ) : segment.type === "quote" ? (
              <QuoteSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : segment.type === "list" ? (
              <ListSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : (
              <TableSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
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
