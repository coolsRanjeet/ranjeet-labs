"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./tool-discovery.module.css";
import {
  ArrowUpRight, Search, QrCode, FileImage, WandSparkles, FileText, Images,
  Scissors, Layers3, Stamp, UserRound, Image, Crop, Instagram, Receipt,
  Calculator, Percent, Type, ScanText, CalendarDays, KeyRound, Wallet,
  Sparkles, X
} from "lucide-react";

const tools = [
  { name: "QR Code Generator", href: "/tools/qr-generator", description: "Create downloadable QR codes for links, menus and contact details.", category: "Utilities", icon: QrCode, popular: true, tag: "Quick & easy" },
  { name: "Image Compressor", href: "/tools/image-compressor", description: "Reduce image file sizes directly in your browser. Your files stay on your device.", category: "Images", icon: FileImage, popular: true, tag: "Private by design" },
  { name: "Reel Script Generator", href: "/tools/reel-script-generator", description: "Get practical short-video hooks, scene ideas and captions for your business.", category: "Creator", icon: WandSparkles, popular: true, tag: "Creator tool" },
  { name: "Image to PDF", href: "/tools/image-to-pdf", description: "Turn photos into printable PDFs.", category: "PDF", icon: Images },
  { name: "PDF to Image", href: "/tools/pdf-to-image", description: "Export PDF pages as JPG or PNG.", category: "PDF", icon: FileImage },
  { name: "Merge PDF", href: "/tools/merge-pdf", description: "Combine multiple PDF documents.", category: "PDF", icon: Layers3, popular: true },
  { name: "Split PDF", href: "/tools/split-pdf", description: "Extract the pages you need.", category: "PDF", icon: Scissors },
  { name: "PDF Compressor", href: "/tools/pdf-compressor", description: "Optimise and re-save PDF files locally.", category: "PDF", icon: FileText },
  { name: "PDF Organizer", href: "/tools/pdf-organizer", description: "Reorder and rotate PDF pages.", category: "PDF", icon: Layers3 },
  { name: "Watermark & Page Numbers", href: "/tools/pdf-watermark", description: "Stamp and number your documents.", category: "PDF", icon: Stamp },
  { name: "Passport Photo Maker", href: "/tools/passport-photo", description: "Create passport-style photo print sheets.", category: "Images", icon: UserRound },
  { name: "Photo & Signature Resizer", href: "/tools/photo-signature-resizer", description: "Set exact dimensions and file-size limits.", category: "Images", icon: Image },
  { name: "Image Format Converter", href: "/tools/image-converter", description: "Convert JPG, PNG and WebP images.", category: "Images", icon: FileImage },
  { name: "Image Cropper", href: "/tools/image-cropper", description: "Crop and resize photos.", category: "Images", icon: Crop },
  { name: "Social Media Resizer", href: "/tools/social-resizer", description: "Create platform-sized images.", category: "Images", icon: Instagram },
  { name: "Invoice Generator", href: "/tools/invoice-generator", description: "Create and download a simple invoice PDF.", category: "Business", icon: Receipt },
  { name: "UPI QR Generator", href: "/tools/upi-qr", description: "Create QR codes for UPI payments.", category: "Business", icon: Wallet },
  { name: "GST Calculator", href: "/tools/gst-calculator", description: "Calculate GST amounts and totals.", category: "Calculators", icon: Calculator },
  { name: "EMI Calculator", href: "/tools/emi-calculator", description: "Estimate monthly loan repayments.", category: "Calculators", icon: Calculator },
  { name: "Percentage Calculator", href: "/tools/percentage-calculator", description: "Calculate percentages, changes and discounts.", category: "Calculators", icon: Percent },
  { name: "Text Toolkit", href: "/tools/text-toolkit", description: "Clean, count and transform text.", category: "Text", icon: Type },
  { name: "Image to Text OCR", href: "/tools/ocr", description: "Extract text from images.", category: "Text", icon: ScanText },
  { name: "Age Calculator", href: "/tools/age-calculator", description: "Calculate your exact age.", category: "Calculators", icon: CalendarDays },
  { name: "Date Calculator", href: "/tools/date-calculator", description: "Calculate dates and days between them.", category: "Calculators", icon: CalendarDays },
  { name: "Password Generator", href: "/tools/password-generator", description: "Generate strong, random passwords.", category: "Utilities", icon: KeyRound },
];

const categories = ["All tools", "PDF", "Images", "Business", "Calculators", "Text", "Creator", "Utilities"];

export default function ToolDiscovery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All tools");
  const filtered = useMemo(() => tools.filter(tool => {
    const matchesCategory = category === "All tools" || tool.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  }), [query, category]);
  const popular = tools.filter(tool => tool.popular);
  const showPopular = category === "All tools" && !query.trim();

  return (
    <section className={styles.root} id="tools">
      <div className={styles.heading}>
        <div><div className={styles.eyebrow}>THE FREE TOOLBOX</div><h2>Get useful things done.</h2><p>Find the right tool, finish the task and get on with your day.</p></div>
        <span className={styles.sectionCount}>{tools.length} FREE TOOLS</span>
      </div>
      <div className={styles.controls}>
        <label className={styles.search}><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, tasks or categories…" aria-label="Search free tools"/>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16}/></button>}</label>
        <div className={styles.filters} role="group" aria-label="Filter tools by category">
          {categories.map(item => <button key={item} type="button" className={category === item ? `${styles.filterPill} ${styles.active}` : styles.filterPill} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>
      {showPopular && <div className={styles.popularBlock}><div className={styles.subsectionHeading}><div><span className={styles.popularKicker}><Sparkles size={13}/> START HERE</span><h3>Popular tools</h3></div><span>Quick picks for everyday tasks</span></div><div className={styles.popularGrid}>{popular.map(tool => {const Icon=tool.icon;return <Link href={tool.href} className={styles.popularCard} key={tool.href}><span className={`${styles.popularIcon} cat-${tool.category.toLowerCase()}`}><Icon size={21}/></span><div><strong>{tool.name}</strong><small>{tool.description}</small></div><ArrowUpRight className={styles.popularArrow} size={17}/></Link>})}</div></div>}
      <div className={styles.resultsHeading}><strong>{query || category !== "All tools" ? `${filtered.length} ${filtered.length === 1 ? "tool" : "tools"} found` : "Explore all tools"}</strong><span>{category === "All tools" ? "Browse the complete collection" : `${category} tools`}</span></div>
      {filtered.length ? <div className={styles.grid}>{filtered.map(tool => {const Icon=tool.icon;return <Link href={tool.href} className={styles.card} key={tool.href}><div className={styles.cardTop}><span className={`${styles.icon} cat-${tool.category.toLowerCase()}`}><Icon size={21}/></span><span className={styles.category}>{tool.category}</span></div><h3>{tool.name}</h3><p>{tool.description}</p><span className={styles.openLink}>Open tool <ArrowUpRight size={16}/></span></Link>})}</div> : <div className={styles.empty}><Search size={24}/><strong>No tools found</strong><p>Try another search or select a different category.</p><button type="button" onClick={() => {setQuery("");setCategory("All tools");}}>Clear filters</button></div>}
    </section>
  );
}
