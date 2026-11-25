import Link from "next/link";

export const metadata = { title: "Terms of Use", description: "Terms of Use for Ranjeet Labs." };

export default function Page() {
  return <main className="shell" style={{ paddingTop: 70, paddingBottom: 80, maxWidth: 820 }}>
    <Link href="/" className="text-link">← Back to Ranjeet Labs</Link>
    <h1 style={{ marginTop: 24, marginBottom: 20 }}>Terms of Use</h1>
    <div style={{ color: "#64748b", lineHeight: 1.85 }}><p>Ranjeet Labs tools are provided free of charge and on an “as available” basis. We aim to make them useful and reliable, but we do not guarantee that every result will be suitable for your purpose or that the website will always be available.</p><p>You are responsible for reviewing generated QR codes, compressed images, scripts and other outputs before using or publishing them. Do not use the tools for unlawful, harmful or infringing activity.</p><p>The website and its content may be changed, suspended or discontinued. These terms may be updated as the project grows.</p><p>For questions, email ranjeet1996r@gmail.com.</p></div>
  </main>;
}
