import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import { ThemeProvider } from "./_components/ThemeProvider";
import "./global.css";

export const metadata: Metadata = {
  title: "Dimitris Trechas",
  description: "Personal website of Dimitris Trechas, a Software Engineer from Greece.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground mx-auto flex min-h-dvh max-w-2xl flex-col">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="m-2 flex-grow md:m-0">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === "production" && (
        <Script
          src="https://umami.dimitristrechas.com/script.js"
          data-website-id="d0e7f80d-e948-4821-95ce-6fcc3868120c"
        />
      )}
    </html>
  );
}
