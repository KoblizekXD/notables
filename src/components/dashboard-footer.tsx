import { Copyright } from "lucide-react";


import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function DashFooter() {
  return (
    <div className="w-full flex bg-[#e5e7eb] dark:bg-[#141414] items-center justify-center p-2 pt-6 pl-5">
      <footer className="relative flex flex-col md:px-12 px-2 w-[88%] items-center justify-between md:gap-6 gap-10 mb-5">
        <div className="flex items-center justify-center flex-wrap gap-x-3 lg:gap-x-6.5">
          <Link
            href="./about-us"
            className="hover:underline whitespace-nowrap">
            About Notables
          </Link>
          <Link
            href="./privacy-policy"
            className="hover:underline whitespace-nowrap">
            Privacy Policy
          </Link>
          <Link
            href="./terms-of-service"
            className="hover:underline whitespace-nowrap">
            Terms of Service
          </Link>
          <Link
            href="./partners"
            className="hover:underline whitespace-nowrap">
            Partners
          </Link>
          <Link
            href="./blog"
            className="hover:underline whitespace-nowrap">
            Blogs
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-2 min-lg:gap-x-6.5">
          <div className="flex flex-row gap-3">
              <Link
                href={"https://www.instagram.com/0xaa55h/"}
                className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:bg-black dark:hover:bg-neutral-300 transition-color duration-200">
                <FaInstagram className="text-accent" size={34} />
              </Link>
              <Link
                href={"https://github.com/KoblizekXD/notables"}
                className="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-accent-foreground hover:bg-black dark:hover:bg-neutral-300 transition-color duration-200">
                <FaGithub className="text-accent" size={34} />
              </Link>
            </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <p className="flex flex-row gap-3 items-center text-lg">
            <Copyright size={20} />
            Notables
          </p>
        </div>
      </footer>
    </div>
  );
}
