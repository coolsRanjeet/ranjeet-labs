import type { Metadata } from "next";
import Link from "next/link";
import ImageCompressor from "./image-compressor";

export const metadata: Metadata = {
  title: "Free Image Compressor",
  description: "Compress JPG, PNG, WebP and AVIF images locally in your browser."
};

export default function Page() {
  return <main className="tool-page">
    <header className="tool-header"><Link href="/" className="back-link">← Ranjeet Labs</Link><span>FREE TOOL</span></header>
    <div className="tool-shell">
      <div className="eyebrow">FREE ONLINE TOOL</div>
      <h1>Image Compressor</h1>
      <p className="tool-intro">Reduce image file size before uploading to websites or sharing online. Your image stays on your device.</p>
      <ImageCompressor />
      <p className="privacy-note">Images are processed locally in your browser and are not uploaded to Ranjeet Labs.</p>
    </div>
  </main>;
}
