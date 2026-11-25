import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "./qr-generator";

export const metadata: Metadata = {
  title: "Free QR Code Generator",
  description: "Create and download a QR code for a website, menu or contact link."
};

export default function Page() {
  return <main className="tool-page">
    <header className="tool-header"><Link href="/" className="back-link">← Ranjeet Labs</Link><span>FREE TOOL</span></header>
    <div className="tool-shell">
      <div className="eyebrow">FREE ONLINE TOOL</div>
      <h1>QR Code Generator</h1>
      <p className="tool-intro">Turn a link or text into a QR code you can download and share.</p>
      <QRGenerator />
      <p className="privacy-note">Your input is processed in your browser. Nothing is uploaded to our server.</p>
    </div>
  </main>;
}
