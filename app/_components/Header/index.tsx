"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { ThemeToggle } from "../ThemeToggle";

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="mx-2 mt-2 mb-4 md:mx-0 md:mb-8">
      <nav className="flex items-end">
        <Link href="/" className="text-foreground text-xl" aria-current={pathname === "/" ? "page" : undefined}>
          Dimitris Trechas
        </Link>
        <div className="ml-auto flex items-center text-lg">
          <Link
            href="/blog"
            className={`ml-2 text-foreground sm:ml-4 ${pathname === "/blog" ? "underline" : ""}`}
            aria-current={pathname === "/blog" ? "page" : undefined}
          >
            blog
          </Link>
          <Link
            href="/about"
            className={`ml-2 text-foreground sm:ml-4 ${pathname === "/about" ? "underline" : ""}`}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            about
          </Link>
          <Link
            href="/contact"
            className={`ml-2 text-foreground sm:ml-4 ${pathname === "/contact" ? "underline" : ""}`}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            contact
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
