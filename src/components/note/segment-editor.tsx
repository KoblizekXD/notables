"use client";

import { getSignedImageUrl, uploadImage } from "@/lib/actions";
import { randomUUID } from "@/lib/utils";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { Minus, Plus, Settings2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BlockMath } from "react-katex";
import { type BundledLanguage, bundledLanguages } from "shiki";
import { toast } from "sonner";
import TooltipWrapper from "../tooltip-wrapper";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CodeBlock } from "./codeblock";
import { useEditorContext } from "./editor-context";

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

function ImageSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "image" }>;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadResult = await uploadImage(file, randomUUID());
      if (uploadResult.error) {
        toast.error("Failed to upload image");
        return;
      }
      setImageUrl(await getSignedImageUrl(uploadResult.imagePath as string));
      onUpdate({
        ...sgmnt,
        content: {
          ...sgmnt.content,
          src: uploadResult.imagePath as string,
        },
      });
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
        onChange={(e) => {
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              alt: e.currentTarget.value,
            },
          });
        }}
      />
    </div>
  );
}

function MathSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "formula" }>;
  const [formula, setFormula] = useState<string>(sgmnt.content.formula);
  const [description, setDescription] = useState<string | undefined>(
    sgmnt.content.description,
  );

  return (
    <div className="flex relative flex-col gap-y-2">
      <Textarea
        placeholder="Math expression"
        defaultValue={formula}
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
        defaultValue={description}
        onChange={(e) => {
          setDescription(e.currentTarget.value);
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
  const [code, setCode] = useState<string>(sgmnt.content.code);
  const [heading, setHeading] = useState<string | undefined>(
    sgmnt.content.heading,
  );
  const [language, setLanguage] = useState<BundledLanguage>(
    sgmnt.content.language as BundledLanguage,
  );

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
        defaultValue={code}
      />
      <Select
        defaultValue={language}
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
        name="language">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </Select>
      <h1 className="font-semibold text-muted-foreground">Preview:</h1>
      <CodeBlock lang={language}>{code}</CodeBlock>
      <Input
        placeholder="Title"
        onChange={(e) => {
          setHeading(e.currentTarget.value);
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              heading: e.currentTarget.value,
            },
          });
        }}
        defaultValue={heading}
      />
    </div>
  );
}

function QuoteSegment({ segment, onUpdate }: GenericSegmentProps) {
  const sgmnt = segment as Extract<NoteSegment, { type: "quote" }>;
  const [quote, setQuote] = useState<string>(sgmnt.content.text);
  const [author, setAuthor] = useState<string | undefined>(
    sgmnt.content.author,
  );
  const [source, setSource] = useState<string | undefined>(
    sgmnt.content.source,
  );

  return (
    <div className="flex relative flex-col gap-y-2">
      <Textarea
        className="resize-none border-l-3 focus-visible:outline-hidden dark:bg-transparent focus-visible:ring-0 pl-2 py-0.5 italic rounded-none border-y-0 border-r-0 border-border focus-visible:border-border"
        defaultValue={quote}
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          setQuote(e.currentTarget.value || "");
          onUpdate({
            ...sgmnt,
            content: {
              ...sgmnt.content,
              text: e.currentTarget.value || "",
            },
          });
        }}
      />
      <Input
        placeholder="Author"
        defaultValue={author}
        onChange={(e) => {
          setAuthor(e.currentTarget.value);
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
        defaultValue={source}
        onChange={(e) => {
          setSource(e.currentTarget.value);
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
          onClick={() => setItems((prev) => [...prev, ""])}>
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
          }}>
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
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
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
              size={"icon"}>
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
              size={"icon"}>
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
            size={"icon"}>
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
            size={"icon"}>
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
    <div className="flex mt-6 p-2 items-center flex-col mb-36 gap-y-2">
      {segments.length > 0 ? (
        segments.map((segment, index) => (
          <motion.div
            key={`${segment.type}-${index}`}
            initial={{ opacity: 0, y: "calc(var(--spacing) * -2)" }}
            animate={{ opacity: 1, y: "calc(var(--spacing) * 2)" }}
            className="border w-full xl:w-[620px] p-4 rounded-md flex flex-col gap-y-2">
            <TooltipWrapper content="Segment options">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="absolute hidden xl:flex items-center justify-center -translate-x-full -left-2 top-4"
                    variant="outline"
                    size="icon">
                    <Settings2 />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog options</DialogTitle>
                    <DialogDescription>
                      Options for this segment.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          setSegments((prev) => {
                            const newSegments = [...prev];
                            newSegments.splice(index, 1);
                            return newSegments;
                          });
                          toast.success("Segment removed successfully");
                        }}
                        variant="destructive">
                        Remove
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TooltipWrapper>
            {segment.type === "text" ? (
              <TextSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
            ) : segment.type === "image" ? (
              <ImageSegment
                segment={segment}
                onUpdate={(s) => {
                  handleSegmentUpdate(index, s);
                }}
              />
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
        className="flex w-full mt-4 gap-x-2">
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
