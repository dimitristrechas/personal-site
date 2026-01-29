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
        <Link href="/" className="text-[clamp(1rem,4vw,1.5rem)]" aria-current={pathname === "/" ? "page" : undefined}>
          Dimitris Trechas
        </Link>
        <div className="ml-auto flex items-center text-[clamp(0.75rem,3.5vw,1.25rem)]">
          <Link
            href="/blog"
            className={`ml-[clamp(0.75rem,2.5vw,1rem)] ${pathname === "/blog" ? "underline" : ""}`}
            aria-current={pathname === "/blog" ? "page" : undefined}
          >
            blog
          </Link>
          <Link
            href="/about"
            className={`ml-[clamp(0.75rem,2.5vw,1rem)] ${pathname === "/about" ? "underline" : ""}`}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            about
          </Link>
          <Link
            href="/contact"
            className={`ml-[clamp(0.75rem,2.5vw,1rem)] ${pathname === "/contact" ? "underline" : ""}`}
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
