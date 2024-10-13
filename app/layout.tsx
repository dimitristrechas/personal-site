import { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Dimitris Trechas",
  description: "Dimitris Trechas, Frontend Engineer. Personal Site.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-2xl mx-auto grid grid-rows-layout h-screen font-sans">
        <Header />
        <main role="main" className="m-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
