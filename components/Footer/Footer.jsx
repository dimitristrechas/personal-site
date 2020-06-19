import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";

const Footer = () => {
  return (
    <Navbar className="py-3" sticky="bottom" expand="lg">
      <Container className="justify-content-center">
        <Row>
          <Col>
            {`© 2020 Copyright `}
            <Link href="/" as={"/"}>
              <a>dimitristrechas.com</a>
            </Link>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
