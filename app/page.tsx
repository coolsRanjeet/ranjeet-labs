import Link from "next/link";
import MobileNav from "./components/mobile-nav";
import ToolDiscovery from "./components/tool-discovery";
import {
  ArrowRight, ArrowUpRight, AudioWaveform, Code2, FileImage,
  Layers3, QrCode, Sparkles, WandSparkles, Zap, ShieldCheck,
  Globe2, Video
} from "lucide-react";

export default function Home() {
  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        A growing collection of useful, free digital tools
        <ArrowRight size={14} />
      </div>

      <header className="site-header shell">
        <Link href="/" className="brand" aria-label="Ranjeet Labs home">
          <span className="brand-mark">R<span>.</span></span>
          <span className="brand-copy">
            <strong>RANJEET LABS</strong>
            <small>BY RANJEET DIGITAL STUDIO</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#tools">Free tools</Link>
          <Link href="/#products">Products</Link>
          <Link href="/marketplace">Code marketplace</Link>
          <Link href="/#about">About</Link>
        </nav>
        <Link className="header-cta" href="/#tools">Explore tools <ArrowUpRight size={16} /></Link>
        <MobileNav />
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-icon"><Sparkles size={14} /></span> THE DIGITAL TOOLBOX FOR EVERYDAY WORK</div>
          <h1>Useful tools.<br /><span>Practical technology.</span></h1>
          <p className="hero-text">
            Simple online tools and thoughtful software that help creators,
            businesses and everyday users get things done.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/#tools">Explore free tools <ArrowRight size={17} /></Link>
            <Link className="button button-secondary" href="/#products">Discover products</Link>
          </div>
          <div className="hero-proof">
            <span><ShieldCheck size={15} /> No account required for free tools</span>
            <span><Zap size={15} /> Built to be simple</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Abstract product dashboard illustration">
          <div className="visual-glow" />
          <div className="dashboard-window">
            <div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>YOUR DIGITAL WORKSPACE</span><span className="live-pill">● LIVE CONCEPT</span></div>
            <div className="dashboard-title"><div><small>WELCOME TO YOUR TOOLKIT</small><h3>Make useful things happen.</h3></div><div className="avatar">RL</div></div>
            <div className="mini-grid">
              <div className="mini-card mini-blue"><div className="mini-icon"><QrCode size={20} /></div><strong>QR Studio</strong><small>Create in seconds</small><span className="mini-arrow">↗</span></div>
              <div className="mini-card mini-violet"><div className="mini-icon"><FileImage size={20} /></div><strong>Image tools</strong><small>Optimise on device</small><span className="mini-arrow">↗</span></div>
              <div className="mini-card mini-dark"><div className="mini-icon"><WandSparkles size={20} /></div><strong>Creator tools</strong><small>Ideas into content</small><span className="mini-arrow">↗</span></div>
              <div className="mini-card mini-light"><div className="mini-icon"><Code2 size={20} /></div><strong>Digital products</strong><small>Ready to build</small><span className="mini-arrow">↗</span></div>
            </div>
            <div className="dashboard-foot"><span><span className="status-dot" /> Made for real work</span><span>RANJEET LABS / 001</span></div>
          </div>
          <div className="float-chip chip-one"><Sparkles size={15} /> Simple by design</div>
          <div className="float-chip chip-two"><Globe2 size={15} /> Built for everyone</div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="shell trust-inner">
          <span>MADE FOR</span><strong>Creators</strong><i /><strong>Small businesses</strong><i /><strong>Developers</strong><i /><strong>Everyday problem-solvers</strong>
        </div>
      </section>

      <ToolDiscovery />

      <section className="feature-band" id="products">
        <div className="shell feature-inner">
          <div className="feature-copy">
            <div className="eyebrow eyebrow-light">OUR FLAGSHIP PRODUCT</div>
            <div className="product-lockup"><span className="product-symbol"><AudioWaveform size={25} /></span><span>RANJEET <b>AI STUDIO</b></span></div>
            <h2>More from your<br />long-form videos.</h2>
            <p>Our AI video repurposing project is being developed to help creators find engaging moments and turn long videos into short-form clips.</p>
            <div className="feature-points"><span><Video size={16} /> Video-to-short workflow</span><span><Sparkles size={16} /> AI-assisted moments</span><span><Layers3 size={16} /> Creator-focused editing</span></div>
            <span className="status-label"><i /> IN DEVELOPMENT — NOT YET FOR SALE</span>
          </div>
          <div className="studio-preview">
            <div className="preview-top"><span>AI STUDIO / WORKSPACE</span><span className="preview-pill">PRODUCT PREVIEW</span></div>
            <div className="preview-screen">
              <div className="preview-sidebar"><b>R.</b><i /><i /><i /><i /></div>
              <div className="preview-main">
                <small>YOUR PROJECT</small><h3>Turn long videos into<br /><em>short moments.</em></h3>
                <div className="video-placeholder"><div className="play-button">▶</div><div className="video-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
                <div className="clip-row"><span>01</span><div><b>Interesting moment</b><small>00:42 — 01:08</small></div><span className="clip-ready">DEMO</span></div>
                <div className="clip-row"><span>02</span><div><b>Key highlight</b><small>02:16 — 02:39</small></div><span className="clip-ready">DEMO</span></div>
              </div>
            </div>
            <p className="preview-note">Illustrative product interface — not a live application screenshot.</p>
          </div>
        </div>
      </section>

      <section className="section shell" id="marketplace">
        <div className="section-heading">
          <div><div className="eyebrow">COMING INTO THE WORKSHOP</div><h2>Build on a better starting point.</h2><p>Practical templates and developer resources are planned for our marketplace.</p></div>
          <Link className="text-link" href="/marketplace">View marketplace <ArrowRight size={16} /></Link>
        </div>
        <div className="market-grid">
          <div className="market-card"><div className="market-art art-web"><div className="art-browser"><i /><i /><i /><div /><div /><div /></div></div><span className="market-label">WEBSITE TEMPLATES</span><h3>Start with a strong foundation.</h3><p>Responsive website starters for real business needs.</p></div>
          <div className="market-card"><div className="market-art art-code"><Code2 size={55} /><span>{"</>"}</span></div><span className="market-label">SOURCE CODE</span><h3>Learn from working projects.</h3><p>Documented code packages with clear setup instructions.</p></div>
          <div className="market-card"><div className="market-art art-system"><Layers3 size={55} /><div className="system-lines"><i /><i /><i /></div></div><span className="market-label">STARTER SYSTEMS</span><h3>Spend less time on setup.</h3><p>Reusable foundations for developers and makers.</p></div>
        </div>
        <div className="coming-note"><span className="status-dot" /> Marketplace products are being prepared. No purchases are available yet.</div>
      </section>

      <section className="about-section" id="about">
        <div className="shell about-inner">
          <div><div className="eyebrow">A NOTE FROM THE STUDIO</div><h2>Technology should<br /><span>make life easier.</span></h2></div>
          <div className="about-copy"><p>Ranjeet Digital Studio builds practical digital products for people who want to create, work and grow without unnecessary complexity.</p><p>We believe useful software should be approachable, transparent and thoughtfully made. This platform is our workshop — and we&apos;re just getting started.</p><div className="signature">Ranjeet Digital Studio <span>· India</span></div></div>
        </div>
      </section>

      <footer className="site-footer shell">
        <Link href="/" className="brand"><span className="brand-mark">R<span>.</span></span><span className="brand-copy"><strong>RANJEET LABS</strong><small>BY RANJEET DIGITAL STUDIO</small></span></Link>
        <p>Useful tools. Practical technology.</p>
        <div className="footer-links"><Link href="/#tools">Free tools</Link><Link href="/marketplace">Marketplace</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <small className="copyright">© {new Date().getFullYear()} Ranjeet Digital Studio. Built with purpose.</small>
      </footer>
    </main>
  );
}
