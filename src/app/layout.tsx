import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/layout/Providers";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ScoreScript — Esse Yoxlayıcısı",
  description: "AI tərəfindən gücləndirilmiş esse qiymətləndirməsi bal rəyi ilə",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
