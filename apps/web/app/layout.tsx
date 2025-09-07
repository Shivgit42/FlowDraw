import type { Metadata } from "next";
import "./globals.css";
import Provider from "../components/Provider";

export const metadata: Metadata = {
  title: "FlowDraw",
  description: "FlowDraw is a real-time collaborative drawing tool",
  icons: {
    icon: [
      { url: "/web-logo.svg", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
