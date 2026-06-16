import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="h-full bg-black text-white antialiased">{children}</body>
    </html>
  );
}
