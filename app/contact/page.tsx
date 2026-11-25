import Link from "next/link";

export const metadata = { title: "Contact Ranjeet Labs", description: "Contact Ranjeet Labs for Ranjeet Labs." };

export default function Page() {
  return <main className="shell" style={{ paddingTop: 70, paddingBottom: 80, maxWidth: 820 }}>
    <Link href="/" className="text-link">← Back to Ranjeet Labs</Link>
    <h1 style={{ marginTop: 24, marginBottom: 20 }}>Contact Ranjeet Labs</h1>
    <div style={{ color: "#64748b", lineHeight: 1.85 }}><p>Questions, feedback, bug reports or business enquiries are welcome. Email us and include the tool or page you are referring to so we can help.</p><p>Email: ranjeet1996r@gmail.com</p></div>
  </main>;
}
