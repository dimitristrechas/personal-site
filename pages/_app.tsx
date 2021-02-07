import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import { FC } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/App.scss";

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Dimitris Trechas</title>
        <meta name="description" content="Dimitris Trechas, Frontend Engineer. Personal Site." />

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className="container app-container">
        <Header />
        <main role="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
