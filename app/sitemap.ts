import type { MetadataRoute } from "next";

const baseUrl = "https://ranjeet-labs.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/marketplace`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/tools/qr-generator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/image-compressor`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/reel-script-generator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
