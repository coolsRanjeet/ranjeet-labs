import type { MetadataRoute } from "next";

const baseUrl = "https://ranjeet-labs.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/marketplace`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/tools/qr-generator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/image-compressor`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/reel-script-generator`, changeFrequency: "monthly", priority: 0.8 },
    ...["image-to-pdf","pdf-to-image","merge-pdf","split-pdf","pdf-compressor","pdf-organizer","pdf-watermark","passport-photo","photo-signature-resizer","image-converter","image-cropper","social-resizer","invoice-generator","upi-qr","gst-calculator","emi-calculator","percentage-calculator","text-toolkit","ocr","age-calculator","date-calculator","password-generator"].map(slug => ({ url: `${baseUrl}/tools/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
