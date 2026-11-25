 "use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Download, FileImage, ImagePlus, RefreshCw } from "lucide-react";

type Result = { url: string; size: number; originalSize: number; name: string; type: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [result, setResult] = useState<Result | null>(null);
  const [quality, setQuality] = useState(0.72);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  async function compress(file: File) {
    setError("");
    setResult(null);
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("Please choose an image smaller than 15 MB."); return; }
    setBusy(true);
    try {
      const sourceUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = sourceUrl;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("This image could not be opened."));
      });
      const canvas = document.createElement("canvas");
      const maxSide = 2400;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not process this image.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(sourceUrl);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) throw new Error("Compression failed. Please try another image.");
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size, originalSize: file.size, name: file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg", type: blob.type });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void compress(file);
    e.target.value = "";
  }

  const saving = result ? Math.max(0, Math.round((1 - result.size / result.originalSize) * 100)) : 0;

  return <div className="compressor-card">
    <label className="upload-zone">
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
      <span className="upload-icon"><ImagePlus size={27} /></span>
      <strong>Choose an image</strong>
      <span>JPG, PNG or WebP · Maximum 15 MB</span>
      <em>{busy ? "Processing image…" : "Browse files"}</em>
    </label>
    <div className="quality-row">
      <div><label htmlFor="quality">JPEG quality</label><span>Lower quality usually means a smaller file.</span></div>
      <strong>{Math.round(quality * 100)}%</strong>
    </div>
    <input id="quality" className="quality-slider" type="range" min="0.35" max="0.95" step="0.05" value={quality} onChange={e => setQuality(Number(e.target.value))} />
    <button className="button button-secondary full-button" disabled={busy || !result} onClick={() => {
      const input = document.querySelector<HTMLInputElement>(".upload-zone input");
      input?.click();
    }}><RefreshCw size={16} /> Choose another image</button>
    {error && <p className="error-text">{error}</p>}
    {result && <div className="compression-result">
      <div className="result-label">COMPRESSION RESULT</div>
      <div className="image-result-row">
        <div className="image-file-icon"><FileImage size={24} /></div>
        <div className="image-file-info"><strong>{result.name}</strong><span>{formatBytes(result.originalSize)} → {formatBytes(result.size)}</span></div>
        <span className="saving-pill">{saving}% smaller</span>
      </div>
      <a className="button button-primary full-button" href={result.url} download={result.name}><Download size={17} /> Download compressed image</a>
      {result.size >= result.originalSize && <p className="field-hint">This image did not become smaller at the selected quality. Try lowering the quality slider and selecting it again.</p>}
    </div>}
  </div>;
}
