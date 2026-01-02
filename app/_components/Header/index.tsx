"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="mx-2 mt-2 mb-4 md:mx-0 md:mb-8">
      <nav className="flex items-end">
        <Link href="/" className="text-slate-600 text-xl">
          Dimitris Trechas
        </Link>
        <div className="ml-auto text-lg">
          <Link href="/blog" className={`ml-2 text-gray-800 sm:ml-4 ${pathname === "/blog" ? "underline" : ""}`}>
            blog
          </Link>
          <Link href="/about" className={`ml-2 text-gray-800 sm:ml-4 ${pathname === "/about" ? "underline" : ""}`}>
            about
          </Link>
          <Link href="/contact" className={`ml-2 text-gray-800 sm:ml-4 ${pathname === "/contact" ? "underline" : ""}`}>
            contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
