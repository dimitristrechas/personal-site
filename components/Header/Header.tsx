import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

const Header: FC = () => {
  const router = useRouter();

  return (
    <header>
      <nav className="m-4 mb-8 flex items-end">
        <Link href="/" as={"/"}>
          <a className="text-2xl text-blue-500">Dimitris Trechas</a>
        </Link>
        <div className="ml-auto text-lg">
          <Link href="/blog" as={"/blog"}>
            <a href="/blog" className={`ml-2 sm:ml-4 ${router.pathname == "/blog" ? "underline" : ""}`}>
              Blog
            </a>
          </Link>
          <Link href="/about" as={"/about"}>
            <a href="/about" className={`ml-2 sm:ml-4 ${router.pathname == "/about" ? "underline" : ""}`}>
              About
            </a>
          </Link>
          <Link href="/contact" as={"/contact"}>
            <a href="/contact" className={`ml-2 sm:ml-4 ${router.pathname == "/contact" ? "underline" : ""}`}>
              Contact
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
