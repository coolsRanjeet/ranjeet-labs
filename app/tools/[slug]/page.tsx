import type { Metadata } from "next";
import Link from "next/link";
import UniversalTool from "../../components/universal-tool";
import { TOOL_INFO } from "../../components/tool-info";

const SITE_URL = "https://ranjeet-labs.netlify.app";

export function generateStaticParams() {
  return Object.keys(TOOL_INFO).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = TOOL_INFO[slug];

  if (!info) {
    return {
      title: "Tool Not Found | Ranjeet Labs",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/tools/${slug}`;
  const title = `${info.title} — Free Online Tool`;
  const description = `${info.description} Free to use online with Ranjeet Labs.`;

  return {
    title,
    description,
    keywords: [
      info.title,
      `${info.title} online`,
      `${info.title} free`,
      "free online tools",
      "Ranjeet Labs",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Ranjeet Labs",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = TOOL_INFO[slug];

  if (!info) {
    return (
      <main className="tool-page">
        <div className="tool-shell">
          <h1>Tool not found</h1>
          <Link href="/">Back to Ranjeet Labs</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="tool-page">
      <header className="tool-header">
        <Link href="/" className="back-link">← Ranjeet Labs</Link>
        <span>FREE TOOL</span>
      </header>
      <div className="tool-shell">
        <div className="eyebrow">{info.category.toUpperCase()} · FREE ONLINE TOOL</div>
        <h1>{info.title}</h1>
        <p className="tool-intro">{info.description}</p>
        <UniversalTool slug={slug} />
        <p className="privacy-note">
          Your files are processed locally in your browser whenever supported. No account required.
        </p>
        <div style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 18 }}>Explore more free tools</h2>
          {Object.entries(TOOL_INFO)
            .filter(([otherSlug]) => otherSlug !== slug)
            .slice(0, 8)
            .map(([otherSlug, tool]) => (
              <Link
                key={otherSlug}
                href={`/tools/${otherSlug}`}
                style={{
                  display: "inline-block",
                  margin: "5px 7px 0 0",
                  padding: "8px 11px",
                  borderRadius: 7,
                  background: "#eef2f8",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#44536a",
                }}
              >
                {tool.title}
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
