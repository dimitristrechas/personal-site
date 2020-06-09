import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaDev } from "react-icons/fa";

const Header = () => {
  const router = useRouter();

  return (
    <Navbar expand="lg" className="py-3 px-0">
      <Link href="/" as={"/"}>
        <Navbar.Brand
          href="/"
          className="text-primary d-inline-flex align-items-center"
        >
          <FaDev />
          <span className="text-primary font-weight-normal mx-1">
            Dimitris Trechas
          </span>
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
              className={router.pathname == "/contact" ? "active" : ""}
            >
              Contact
            </Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
