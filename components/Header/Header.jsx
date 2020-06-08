import Link from "next/link";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaDev } from "react-icons/fa";

const Header = () => {
  return (
    <Navbar expand="lg" className="py-3">
      <Container>
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
          <Nav className="mr-auto">
            <Link href="/" as={"/"}>
              <Nav.Link href="/">Home</Nav.Link>
            </Link>
            <Link href="/blog" as={"/blog"}>
              <Nav.Link href="/blog">Blog</Nav.Link>
            </Link>
            <Link href="/bio" as={"/bio"}>
              <Nav.Link href="/bio">Bio</Nav.Link>
            </Link>
            <Link href="/contact" as={"/contact"}>
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Link>
            <Link href="/portofolio" as={"/portofolio"}>
              <Nav.Link href="/portofolio">Portofolio</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
