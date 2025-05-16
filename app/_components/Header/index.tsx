"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="mx-2 md:mx-0 mt-2 mb-16">
      <nav className="flex items-end">
        <Link href="/" className="text-2xl text-slate-600">
          dimitristrechas
        </Link>
        <div className="ml-auto text-lg">
          <Link
            href="/blog"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/blog" ? "underline" : ""
            }`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/about" ? "underline" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-gray-800 ml-2 sm:ml-4 ${
              pathname == "/contact" ? "underline" : ""
            }`}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
