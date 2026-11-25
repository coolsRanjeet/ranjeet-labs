import Link from "next/link";

export const metadata = { title: "Privacy Policy", description: "Privacy Policy for Ranjeet Labs." };

export default function Page() {
  return <main className="shell" style={{ paddingTop: 70, paddingBottom: 80, maxWidth: 820 }}>
    <Link href="/" className="text-link">← Back to Ranjeet Labs</Link>
    <h1 style={{ marginTop: 24, marginBottom: 20 }}>Privacy Policy</h1>
    <div style={{ color: "#64748b", lineHeight: 1.85 }}><p>Ranjeet Labs currently provides browser-based tools. The QR Code Generator and Image Compressor are designed to process your input in your browser; files selected for compression are not intentionally uploaded to our servers.</p><p>Some website hosting and infrastructure providers may collect standard technical information such as IP address, browser, device, and request logs to operate and secure the website.</p><p>Our Reel Script Generator uses built-in templates and does not currently send your form inputs to an AI service.</p><p>We do not currently offer user accounts or sell products through this site. If these features are added, this policy will be updated.</p><p>Questions about privacy can be sent to ranjeet1996r@gmail.com.</p></div>
  </main>;
}
