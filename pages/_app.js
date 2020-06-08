import Container from "react-bootstrap/Container";
import Header from "../components/Header/Header";
import "../styles/App.scss";

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Container>
        <Header />
      </Container>
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}
