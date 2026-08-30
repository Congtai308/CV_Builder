import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Create your professional CV easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}