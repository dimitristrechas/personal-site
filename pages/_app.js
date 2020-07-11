import Head from "next/head";
import Container from "react-bootstrap/Container";
import Header from "../components/Header/Header";
import "../styles/App.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dimitris Trechas</title>
        <meta
          name="description"
          content="Dimitris Trechas, Frontend Engineer. Personal Site."
        />
      </Head>
      <Container fluid="md">
        <Header />
        <main role="main">
          <Component {...pageProps} />
        </main>
      </Container>
    </>
  );
}
