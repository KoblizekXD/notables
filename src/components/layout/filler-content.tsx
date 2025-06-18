import WhyUsCards from "../profile/why-us-cards";
import { ClipboardPen, CornerLeftDown, FileScan } from "lucide-react";
import Image from 'next/image';
import ThemeBasedRenderer from "../theme/theme-based-renderer";


export default function Filler() {
    return (
        <div className="flex flex-col items-center justify-center gap-32 pb-12 w-full relative">
            <div className="bg-gray-200 dark:bg-[#131313] -z-9 w-full h-[80%] absolute bottom-0" />
            <h1 className="font-extrabold text-4xl flex gap-4 relative">
                <CornerLeftDown size={50} className="absolute top-2 -left-15" />
                Why us?
            </h1>
            <WhyUsCards />
            <div className="flex max-lg:flex-col items-center gap-12 h-auto">
                <ThemeBasedRenderer
                    light={
                        <Image
                            src="/pictures-white/note-editor.png"
                            alt="Filler"
                            width={640}
                            height={425}
                            className="min-lg:flex hidden rounded-lg shadow-lg ml-4"
                        />
                    }
                    dark={
                        <Image
                            src="/pictures-black/note-editor.png"
                            alt="Filler"
                            width={640}
                            height={425}
                            className="min-lg:flex hidden rounded-lg shadow-lg px-4 border"
                        />
                    }
                />
                <div className="flex max-lg:flex-row flex-col -gap-2 relative max-h-54 h-auto p-1">
                    <ThemeBasedRenderer
                        light={
                            <Image
                                src="/arrow-black/arrow-left-down.svg"
                                alt="v"
                                width={80}
                                height={84}
                                className="hidden max-lg:flex mt-5"
                            />
                        }
                        dark={
                            <Image
                                src="/arrow-white/arrow-left-down-white.svg"
                                alt="v"
                                width={80}
                                height={84}
                                className="hidden max-lg:flex mt-5"
                            />
                        }
                    />
                    <div className="flex flex-col gap-3 lg:gap-5 p-4 pb-6 max-md:max-w-70">
                        <div className="flex flex-col relative">
                            <h1 className="flex items-center gap-2 text-3xl min-lg:text-4xl xl:text-5xl font-semibold whitespace-nowrap">
                                Note editor
                                <ClipboardPen strokeWidth={2} size={38} />
                            </h1>
                            <ThemeBasedRenderer
                                light={
                                    <Image
                                        src="/arrow-black/arrow-down-left.svg"
                                        alt="<-"
                                        width={100}
                                        height={94}
                                        className="max-lg:hidden flex"
                                    />
                                }
                                dark={
                                    <Image
                                        src="/arrow-white/arrow-down-left-white.svg"
                                        alt="<-"
                                        width={100}
                                        height={94}
                                        className="max-lg:hidden flex"
                                    />
                                }
                            />
                        </div>
                        <p className="max-w-2xs md:text-lg xl:text-2xl">
                            Enhance your images with math, images, icons and even code!
                        </p>
                    </div>
                </div>
                <ThemeBasedRenderer
                    light={
                        <div className="px-3">
                            <Image
                                src="/pictures-white/note-editor.png"
                                alt="Filler"
                                width={640}
                                height={425}
                                className="flex min-lg:hidden rounded-lg shadow-lg"
                            />
                        </div>
                    }
                    dark={
                        <Image
                            src="/pictures-black/note-editor.png"
                            alt="Filler"
                            width={640}
                            height={425}
                            className="flex min-lg:hidden rounded-lg shadow-lg px-5 border flex-row"
                        />
                    }
                />
            </div>
            <div className="flex max-lg:flex-col items-center gap-12 h-auto">
                <div className="flex max-lg:flex-row flex-col -gap-4 relative max-h-54 h-auto p-1">
                    <div className="flex flex-col gap-3 lg:gap-5 p-4 pr-0 pb-6 max-md:max-w-70">
                        <div className="flex flex-col relative">
                            <h1 className="flex items-center gap-2 text-3xl min-lg:text-4xl xl:text-5xl font-semibold">
                                Note preview
                                <FileScan strokeWidth={2} size={38} />
                            </h1>
                            <ThemeBasedRenderer
                                light={
                                    <Image
                                        src="/arrow-black/arrow-down-right.svg"
                                        alt="->"
                                        width={100}
                                        height={94}
                                        className="max-lg:hidden flex ml-16"
                                    />
                                }
                                dark={
                                    <Image
                                        src="/arrow-white/arrow-down-right-white.svg"
                                        alt="->"
                                        width={100}
                                        height={94}
                                        className="max-lg:hidden flex ml-16"
                                    />
                                }
                            />
                        </div>
                        <p className="max-w-2xs md:text-lg xl:text-2xl">
                            Well aligned and devided text, thats easy to read!
                        </p>
                    </div>
                    <ThemeBasedRenderer
                        dark={
                            <Image
                                src="/arrow-white/arrow-right-down-white.svg"
                                alt="v"
                                width={80}
                                height={84}
                                className="hidden max-lg:flex mt-5"
                            />
                        }
                        light={
                            <Image
                                src="/arrow-black/arrow-right-down.svg"
                                alt="v"
                                width={80}
                                height={84}
                                className="hidden max-lg:flex mt-5"
                            />
                        }
                    />
                </div>
                <ThemeBasedRenderer
                    light={
                        <div className="px-3">
                            <Image
                                src="/pictures-white/note-preview.png"
                                alt="Filler"
                                width={640}
                                height={425}
                                className="flex rounded-lg shadow-lg min-lg:max-w-150 "
                            />
                        </div>
                    }
                    dark={
                        <Image
                            src="/pictures-black/note-preview.png"
                            alt="Filler"
                            width={640}
                            height={425}
                            className="flex rounded-lg shadow-lg min-lg:max-w-150 px-4 flex-row border"
                        />
                    }
                />
            </div>
        </div>
    );
}