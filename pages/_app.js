import Head from "next/head";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
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
      <div fluid="md" className="container app-container">
        <Header />
        <main role="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}
