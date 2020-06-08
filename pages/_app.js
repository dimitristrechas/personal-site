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
      </Head>
      <Header />
      <main role="main">
        <Container>
          <Component {...pageProps} />
        </Container>
      </main>
      {/* <Footer /> */}
    </>
  );
}
