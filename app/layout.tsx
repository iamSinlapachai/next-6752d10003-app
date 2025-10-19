import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "My Run App",
  description: "To track my running",
  keywords: [
    "Next.js",
    "React",
    "TailwindCSS",
    "TypeScript",
    "Next-Auth",
    "Running",
    "Tracking",
    "ApecSinlapachai",
  ],
  authors: [
    {
      name: "ApecSinlapachai",
      url: "https://github.com/iamSinlapachai",
    },
  ],
  creator: "Sinlapachai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.className}`}>{children}</body>
    </html>
  );
}
