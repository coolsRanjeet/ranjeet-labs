"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav-wrap">
      <button className="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      {open && <nav className="mobile-nav-panel" aria-label="Mobile navigation">
        <Link href="/#tools" onClick={() => setOpen(false)}>Free tools</Link>
        <Link href="/#products" onClick={() => setOpen(false)}>Products</Link>
        <Link href="/marketplace" onClick={() => setOpen(false)}>Code marketplace</Link>
        <Link href="/#about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </nav>}
    </div>
  );
}
