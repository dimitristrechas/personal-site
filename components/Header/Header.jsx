import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaLaptopCode } from "react-icons/fa";

const Header = () => {
  const router = useRouter();

  return (
    <header>
      <nav className="navbar navbar-expand-lg py-3 px-0">
        <div class="container-fluid">
          <Link href="/" as={"/"}>
            <a className="navbar-brand d-inline-flex align-items-center">
              <div className="d-none d-sm-block text-primary mr-2">
                <FaLaptopCode />
              </div>
              <span className="text-primary font-weight-normal">
                Dimitris Trechas
              </span>
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="basic-navbar-nav">
            <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link href="/blog" as={"/blog"}>
                  <a
                    href="/blog"
                    className={
                      "nav-link text-secondary " +
                      (router.pathname == "/blog" ? "active" : "")
                    }
                  >
                    Blog
                  </a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/about" as={"/about"}>
                  <a
                    href="/about"
                    className={
                      "nav-link text-secondary " +
                      (router.pathname == "/about" ? "active" : "")
                    }
                  >
                    About
                  </a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/contact" as={"/contact"}>
                  <a
                    href="/contact"
                    className={
                      "nav-link text-secondary " +
                      (router.pathname == "/contact" ? "active pr-0" : "pr-0")
                    }
                  >
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
