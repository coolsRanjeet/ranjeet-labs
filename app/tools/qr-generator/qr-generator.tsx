 "use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";

export default function QRGenerator() {
  const [value, setValue] = useState("https://example.com");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!value.trim()) {
      setDataUrl("");
      setError("Enter a link or some text to create your QR code.");
      return;
    }
    QRCode.toDataURL(value.trim(), { width: 640, margin: 2, errorCorrectionLevel: "H", color: { dark: "#101828", light: "#FFFFFF" } })
      .then(url => { if (active) { setDataUrl(url); setError(""); } })
      .catch(() => { if (active) setError("We couldn't create that QR code. Try a shorter input."); });
    return () => { active = false; };
  }, [value]);

  return <div className="tool-workspace">
    <div className="tool-form">
      <label htmlFor="qr-value">Website link or text</label>
      <textarea id="qr-value" value={value} onChange={e => setValue(e.target.value)} rows={4} maxLength={1500} placeholder="https://yourwebsite.com" />
      <div className="field-hint">Paste a website URL, menu link, Wi-Fi details or plain text.</div>
      {error && <p className="error-text">{error}</p>}
      <div className="tool-tip"><QrCode size={18} /><span>Tip: Test your QR code with your phone camera before printing it.</span></div>
    </div>
    <div className="tool-result">
      <div className="result-label">YOUR QR CODE</div>
      {dataUrl ? <img className="qr-preview" src={dataUrl} alt="Generated QR code" /> : <div className="empty-preview"><QrCode size={44} /></div>}
      <button className="button button-primary download-button" disabled={!dataUrl} onClick={() => {
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "ranjeet-labs-qr-code.png";
        a.click();
      }}><Download size={17} /> Download PNG</button>
    </div>
  </div>;
}
