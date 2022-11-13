import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

const Header: FC = () => {
  const router = useRouter();

  return (
    <header>
      <nav className="m-4 mb-16 flex items-end">
        <Link href="/" className="text-2xl text-blue-500">
          dimitristrechas
        </Link>
        <div className="ml-auto text-lg">
          <Link href="/blog" className={`text-gray-800 ml-2 sm:ml-4 ${router.pathname == "/blog" ? "underline" : ""}`}>
            Blog
          </Link>
          <Link
            href="/#about"
            className={`text-gray-800 ml-2 sm:ml-4 ${router.pathname == "/about" ? "underline" : ""}`}
          >
            About
          </Link>
          <Link
            href="/#contact"
            className={`text-gray-800 ml-2 sm:ml-4 ${router.pathname == "/contact" ? "underline" : ""}`}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
