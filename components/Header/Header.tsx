import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

const Header: FC = () => {
  const router = useRouter();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light py-3 px-0">
        <div className="container-fluid px-0">
          <Link href="/" as={"/"}>
            <a className="navbar-brand text-primary font-weight-normal">Dimitris Trechas</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link href="/blog" as={"/blog"}>
                <a href="/blog" className={"nav-link text-muted " + (router.pathname == "/blog" ? "active" : "")}>
                  Blog
                </a>
              </Link>
              <Link href="/about" as={"/about"}>
                <a href="/about" className={"nav-link text-muted " + (router.pathname == "/about" ? "active" : "")}>
                  About
                </a>
              </Link>
              <Link href="/contact" as={"/contact"}>
                <a
                  href="/contact"
                  className={"nav-link text-muted " + (router.pathname == "/contact" ? "active pr-0" : "pr-0")}
                >
                  Contact
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
