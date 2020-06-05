import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Link href="/" as={"/"}>
          <Navbar.Brand href="/">Dimitris Trechas</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link href="/" as={"/"}>
              <Nav.Link href="/">Home</Nav.Link>
            </Link>
            <Link href="/blog" as={"/blog"}>
              <Nav.Link href="/blog">Blog</Nav.Link>
            </Link>
            <Nav.Link href="/">Bio</Nav.Link>
            <Nav.Link href="/">Portofolio</Nav.Link>
            <Nav.Link href="/">Contact</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-primary">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}
