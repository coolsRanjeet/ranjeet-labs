import Link from "next/link";
import { ArrowLeft, Code2, PackageOpen } from "lucide-react";

export default function MarketplacePage() {
  return <main className="tool-page">
    <header className="tool-header"><Link href="/" className="back-link">← Ranjeet Labs</Link><span>MARKETPLACE</span></header>
    <div className="tool-shell marketplace-page">
      <div className="eyebrow">DIGITAL PRODUCT WORKSHOP</div>
      <h1>Build on a better starting point.</h1>
      <p className="tool-intro">We&apos;re preparing practical website templates, starter projects and developer resources. Products will appear here after documentation, licensing and installation checks.</p>
      <div className="marketplace-empty"><PackageOpen size={42} /><h2>Marketplace is being prepared</h2><p>No products are available for purchase yet. We won&apos;t list unfinished or unverified downloads.</p><Link className="button button-primary" href="/#products"><Code2 size={16} /> Explore our flagship project</Link></div>
    </div>
  </main>;
}
