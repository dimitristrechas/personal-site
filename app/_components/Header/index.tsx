"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="mx-2 md:mx-0 mt-2 mb-4 md:mb-8">
      <nav className="flex items-end">
        <Link href="/" className="text-xl text-slate-600">
          Dimitris Trechas
        </Link>
        <div className="ml-auto text-lg">
          <Link
            href="/blog"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/blog" ? "underline" : ""
            }`}
          >
            blog
          </Link>
          <Link
            href="/about"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/about" ? "underline" : ""
            }`}
          >
            about
          </Link>
          <Link
            href="/contact"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/contact" ? "underline" : ""
            }`}
          >
            contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
