import { Copyright } from "lucide-react";
import Link from "next/link";
import { FaInstagram, FaGithub } from "react-icons/fa";
//import { DiGithubBadge } from "react-icons/di";

export default function DashFooter() {
  return (
    <div className="w-full flex border-t border-solid dark:border-neutral-800 border-neutral-200 items-center justify-center p-2 pt-6 pl-5">
      <footer className="flex flex-col md:px-12 px-2 w-[88%] items-center justify-between md:gap-7 gap-10 mb-5">
        <div className="flex flex-col gap-6 md:gap-4 items-center">
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-4 lg:gap-x-7">
            <Link href="./about-us" className="hover:underline whitespace-nowrap">
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
            <Link href="./partners" className="hover:underline whitespace-nowrap">
              Partners
            </Link>
            <Link href="./blog" className="hover:underline whitespace-nowrap">
              Blogs
            </Link>
          </div>
          <div className="flex items-center justify-between gap-x-2 min-lg:gap-x-6.5">
            <div className="flex flex-row gap-6">
              <Link
                href={"https://www.instagram.com/0xaa55h/"}
                className="w-12 h-12 flex items-center justify-center rounded-full  transition-color duration-200">
                <FaInstagram className="dark:text-white text-black" size={34} />
              </Link>
              <Link
                href={"https://github.com/KoblizekXD/notables"}
                className="w-12 h-12 flex items-center justify-center rounded-full  transition-color duration-200">
                <FaGithub className="dark:text-white text-black" size={32} />
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <p className="flex flex-row gap-2 items-center text-poppins font-semibold text-lg">
            <Copyright size={20} strokeWidth={3} />
            Notables
          </p>
        </div>
      </footer>
    </div>
  );
}
