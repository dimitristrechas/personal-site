import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaLaptopCode } from "react-icons/fa";

const Header = () => {
  const router = useRouter();

  return (
    <header>
      <Navbar expand="lg" className="py-3 px-0">
        <Link href="/" as={"/"}>
          <Navbar.Brand href="/" className=" d-inline-flex align-items-center">
            <div className="d-none d-sm-block text-primary mr-2">
              <FaLaptopCode />
            </div>
            <span className="text-primary font-weight-normal">
              Dimitris Trechas
            </span>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle
          className="header-nav-toggle"
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse className="text-secondary" id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link href="/blog" as={"/blog"}>
              <Nav.Link
                href="/blog"
                className={router.pathname == "/blog" ? "active" : ""}
              >
                Blog
              </Nav.Link>
            </Link>
            <Link href="/about" as={"/about"}>
              <Nav.Link
                href="/about"
                className={router.pathname == "/about" ? "active" : ""}
              >
                About
              </Nav.Link>
            </Link>
            <Link href="/contact" as={"/contact"}>
              <Nav.Link
                href="/contact"
                className={
                  router.pathname == "/contact" ? "active pr-0" : "pr-0"
                }
              >
                Contact
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
