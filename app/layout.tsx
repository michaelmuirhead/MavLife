import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Lifespan",
  description: "A life simulator. One tap. One year. Every choice matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${nunito.variable}`}>
      <body className="h-full bg-[#cfcfcf] text-[#1a1a1a] antialiased">{children}</body>
    </html>
  );
}
