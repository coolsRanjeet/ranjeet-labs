import type { Metadata } from "next";
import Link from "next/link";
import ReelScriptGenerator from "./reel-script-generator";

export const metadata: Metadata = {
  title: "Free Reel Script Generator",
  description: "Generate short-form video hooks, scene plans and captions for your business."
};

export default function Page() {
  return <main className="tool-page">
    <header className="tool-header"><Link href="/" className="back-link">← Ranjeet Labs</Link><span>FREE TOOL</span></header>
    <div className="tool-shell">
      <div className="eyebrow">FREE CREATOR TOOL</div>
      <h1>Reel Script Generator</h1>
      <p className="tool-intro">Create a practical short-video concept for your business, product or creator page.</p>
      <ReelScriptGenerator />
      <p className="privacy-note">Generated scripts are starting points. Adapt claims, prices and details to your real offer before publishing.</p>
    </div>
  </main>;
}
