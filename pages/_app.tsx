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
      </Head>
      <div className="max-w-2xl mx-auto grid grid-rows-layout h-screen font-sans">
        <Header />
        <main role="main" className="m-4">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
