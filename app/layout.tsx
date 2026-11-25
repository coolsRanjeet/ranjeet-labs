import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ranjeet Labs — Useful tools. Practical technology.",
    template: "%s | Ranjeet Labs"
  },
  description:
    "Explore free online tools, practical creator utilities and digital products from Ranjeet Digital Studio.",
  metadataBase: new URL("https://ranjeet-labs.netlify.app"),
  verification: {
    google: "emGYYJ3ZA1uChvDAWBFj6GpiCvqkidr_Oc6tBuOWaYE",
  },
  openGraph: {
    title: "Ranjeet Labs",
    description: "Useful tools. Practical technology.",
    type: "website",
    url: "https://ranjeet-labs.netlify.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ranjeet Labs — Useful tools. Practical technology.",
    description: "Free browser tools for creators, businesses and everyday users."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
