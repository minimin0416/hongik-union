import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const noto = Noto_Sans_KR({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "홍익대학교 총동아리연합회",
  description: "홍익대학교 제39대 총동아리연합회 Union 공식 홈페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${noto.className}`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
