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
          <Col className="footer">{`Copyright © 2020 Dimitris Trechas`}</Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
