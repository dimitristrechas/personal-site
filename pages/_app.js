import Head from "next/head";
import Container from "react-bootstrap/Container";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/App.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dimitris Trechas - Personal Site</title>
        <meta name="description" content="Dimitris Trechas - Personal Site" />
      </Head>
      <Container fluid="md">
        <Header />
        <main role="main">
          <Component {...pageProps} />
        </main>
        {/* <Footer /> */}
      </Container>
    </>
  );
}
