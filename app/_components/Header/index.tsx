"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import ThemeToggle from "../ThemeToggle";

const NAV_LINKS = [
  { href: "/blog", label: "blog" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="mx-2 mt-2 mb-4 md:mx-0 md:mb-8">
      <nav className="flex items-end">
        <Link href="/" className="text-[clamp(1rem,4vw,1.5rem)]" aria-current={pathname === "/" ? "page" : undefined}>
          Dimitris Trechas
        </Link>
        <div className="ml-auto flex items-center text-[clamp(0.75rem,3.5vw,1.25rem)]">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`ml-[clamp(0.75rem,2.5vw,1rem)] ${isActive ? "underline" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
