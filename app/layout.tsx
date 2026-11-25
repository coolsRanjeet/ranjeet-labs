import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ranjeet Labs — Useful tools. Practical technology.",
    template: "%s | Ranjeet Labs"
  },
  description:
    "Explore free online tools, practical creator utilities and digital products from Ranjeet Digital Studio.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Ranjeet Labs",
    description: "Useful tools. Practical technology.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
