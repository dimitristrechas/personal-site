import { Metadata } from "next";
import { ReactNode } from "react";
import Script from "next/script";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dimitris Trechas",
  description: "Dimitris Trechas, Frontend Engineer. Personal Site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-2xl mx-auto flex flex-col h-screen">
        <Header />
        <main role="main" className="m-2 md:m-0 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
      {process.env.NODE_ENV === "production" && (
        <Script
          src="https://analytics.dimitristrechas.com/script.js"
          data-website-id="d0e7f80d-e948-4821-95ce-6fcc3868120c"
        />
      )}
    </html>
  );
}
