"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  Download,
  Copy,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  QrCode,
  Type,
  UserSquare2,
  Wifi,
} from "lucide-react";
import styles from "./qr-generator.module.css";

type QRType = "url" | "text" | "wifi" | "whatsapp" | "phone" | "email" | "vcard";
type WifiSecurity = "WPA" | "WEP" | "nopass";
interface PayloadResult { payload: string; error: string; }

const QR_TYPES: { id: QRType; label: string; icon: typeof Globe }[] = [
  { id: "url", label: "Website / URL", icon: Globe },
  { id: "text", label: "Plain Text", icon: Type },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "email", label: "Email", icon: Mail },
  { id: "vcard", label: "Contact / vCard", icon: UserSquare2 },
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}
function escapeVCardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && Boolean(parsed.hostname);
  } catch { return false; }
}
function parsePhone(value: string): { normalized: string; digits: string; validChars: boolean } {
  const trimmed = value.trim();
  const validChars = /^\+?[\d\s().-]+$/.test(trimmed);
  const digits = trimmed.replace(/\D/g, "");
  return { normalized: `${trimmed.startsWith("+") ? "+" : ""}${digits}`, digits, validChars };
}

export default function QRGenerator() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [urlValue, setUrlValue] = useState("https://example.com");
  const [textValue, setTextValue] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [waCountryCode, setWaCountryCode] = useState("91");
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [generatedPayload, setGeneratedPayload] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [clipboardStatus, setClipboardStatus] = useState("");

  const { payload, error: validationError } = useMemo<PayloadResult>(() => {
    switch (qrType) {
      case "url": {
        const value = urlValue.trim();
        if (!value) return { payload: "", error: "Enter a website URL to create your QR code." };
        if (!isValidHttpUrl(value)) return { payload: "", error: "Enter a valid URL starting with https:// or http://." };
        return { payload: value, error: "" };
      }
      case "text":
        return textValue.trim() ? { payload: textValue, error: "" } : { payload: "", error: "Enter some text to create your QR code." };
      case "wifi": {
        if (!wifiSsid.trim()) return { payload: "", error: "Enter the Wi-Fi network name (SSID)." };
        if (wifiSecurity !== "nopass" && !wifiPassword) return { payload: "", error: "Enter the Wi-Fi password for the selected security type." };
        const password = wifiSecurity === "nopass" ? "" : `P:${escapeWifiValue(wifiPassword)};`;
        const hidden = wifiHidden ? "H:true;" : "";
        return { payload: `WIFI:T:${wifiSecurity};S:${escapeWifiValue(wifiSsid)};${password}${hidden};`, error: "" };
      }
      case "whatsapp": {
        if (!/^\d{1,3}$/.test(waCountryCode.trim())) return { payload: "", error: "Enter a country code using 1–3 digits, without the + sign." };
        if (!/^[\d\s().-]+$/.test(waPhone.trim()) || !waPhone.trim()) return { payload: "", error: "Enter a valid phone number using digits only (spaces and parentheses are allowed)." };
        const phoneDigits = waPhone.replace(/\D/g, "");
        const fullNumber = `${waCountryCode.trim()}${phoneDigits}`;
        if (fullNumber.length < 7 || fullNumber.length > 15) return { payload: "", error: "The complete number must contain 7–15 digits, including country code." };
        const query = waMessage ? `?text=${encodeURIComponent(waMessage)}` : "";
        return { payload: `https://wa.me/${fullNumber}${query}`, error: "" };
      }
      case "phone": {
        const { normalized, digits, validChars } = parsePhone(phoneValue);
        if (!phoneValue.trim()) return { payload: "", error: "Enter a phone number to create your QR code." };
        if (!validChars || digits.length < 7 || digits.length > 15) return { payload: "", error: "Enter a valid phone number with 7–15 digits and an optional leading +." };
        return { payload: `tel:${normalized}`, error: "" };
      }
      case "email": {
        const address = emailAddress.trim();
        if (!address) return { payload: "", error: "Enter an email address to create your QR code." };
        if (!EMAIL_REGEX.test(address)) return { payload: "", error: "Enter a valid email address (for example, name@example.com)." };
        const params: string[] = [];
        if (emailSubject.trim()) params.push(`subject=${encodeURIComponent(emailSubject.trim())}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return { payload: `mailto:${address}${params.length ? `?${params.join("&")}` : ""}`, error: "" };
      }
      case "vcard": {
        const name = vcardName.trim();
        if (!name) return { payload: "", error: "Enter a full name to create a contact QR code." };
        const phone = vcardPhone.trim();
        if (phone) {
          const parsed = parsePhone(phone);
          if (!parsed.validChars || parsed.digits.length < 7 || parsed.digits.length > 15) return { payload: "", error: "Enter a valid contact phone number or leave it blank." };
        }
        const email = vcardEmail.trim();
        if (email && !EMAIL_REGEX.test(email)) return { payload: "", error: "Enter a valid contact email address or leave it blank." };
        const website = vcardWebsite.trim();
        if (website && !isValidHttpUrl(website)) return { payload: "", error: "Contact website must be a valid http:// or https:// URL." };
        const parts = name.split(/\s+/);
        const first = parts[0] ?? "";
        const last = parts.slice(1).join(" ");
        const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVCardValue(last)};${escapeVCardValue(first)};;;`, `FN:${escapeVCardValue(name)}`];
        if (vcardOrg.trim()) lines.push(`ORG:${escapeVCardValue(vcardOrg.trim())}`);
        if (phone) lines.push(`TEL;TYPE=CELL:${parsePhone(phone).normalized}`);
        if (email) lines.push(`EMAIL:${escapeVCardValue(email)}`);
        if (website) lines.push(`URL:${website}`);
        lines.push("END:VCARD");
        return { payload: lines.join("\r\n"), error: "" };
      }
    }
  }, [qrType, urlValue, textValue, wifiSsid, wifiPassword, wifiSecurity, wifiHidden, waCountryCode, waPhone, waMessage, phoneValue, emailAddress, emailSubject, emailBody, vcardName, vcardPhone, vcardEmail, vcardOrg, vcardWebsite]);

  useEffect(() => {
    let active = true;
    setDataUrl("");
    setGeneratedPayload("");
    setGenerationError("");
    setClipboardStatus("");
    if (validationError || !payload) return () => { active = false; };
    QRCode.toDataURL(payload, { width: 640, margin: 2, errorCorrectionLevel: (qrType === "vcard" || payload.length > 120) ? "M" : "H", color: { dark: "#101828", light: "#FFFFFF" } })
      .then((url) => { if (active) { setDataUrl(url); setGeneratedPayload(payload); } })
      .catch(() => { if (active) setGenerationError("We couldn't create that QR code. Try a shorter input."); });
    return () => { active = false; };
  }, [payload, validationError, qrType]);

  const activeError = validationError || generationError;
  const previewIsCurrent = Boolean(dataUrl && generatedPayload === payload && !activeError);
  const filenameBase = `ranjeet-labs-${qrType}-qr`;

  async function downloadSvg() {
    if (!previewIsCurrent) return;
    try {
      const svg = await QRCode.toString(payload, { type: "svg", margin: 2, errorCorrectionLevel: (qrType === "vcard" || payload.length > 120) ? "M" : "H", color: { dark: "#101828", light: "#FFFFFF" } });
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filenameBase}.svg`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setGenerationError("We couldn't export the SVG. Please try again."); }
  }

  async function copyQrImage() {
    if (!previewIsCurrent) return;
    setClipboardStatus("");
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("Image clipboard not supported");
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setClipboardStatus("QR image copied to clipboard.");
    } catch { setClipboardStatus("Copying images isn't supported in this browser. Download the PNG instead."); }
  }

  return (
    <div className="tool-workspace">
      <div className="tool-form">
        <div className={styles.typeSelector} aria-label="QR code type">
          {QR_TYPES.map(({ id, label, icon: Icon }) => {
            const selected = qrType === id;
            return <button key={id} type="button" aria-pressed={selected} className={`${styles.typeButton} ${selected ? styles.typeButtonActive : ""}`} onClick={() => setQrType(id)}><Icon size={15} /><span>{label}</span></button>;
          })}
        </div>
        <div className={styles.fieldGroup}>
          {qrType === "url" && <div className={styles.field}><label htmlFor="qr-url">Website URL</label><input id="qr-url" type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} maxLength={1500} placeholder="https://yourwebsite.com" /><div className="field-hint">Include https:// or http:// so phones open the link directly.</div></div>}
          {qrType === "text" && <div className={styles.field}><label htmlFor="qr-text">Plain text</label><textarea id="qr-text" value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={4} maxLength={1500} placeholder="Enter any message, note, or code" /><div className="field-hint">Your text, including line breaks, is encoded as entered.</div></div>}
          {qrType === "wifi" && <>
            <div className={styles.field}><label htmlFor="wifi-ssid">Network name (SSID)</label><input id="wifi-ssid" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} maxLength={64} placeholder="MyHomeWiFi" /></div>
            <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="wifi-security">Security type</label><select id="wifi-security" value={wifiSecurity} onChange={(e) => setWifiSecurity(e.target.value as WifiSecurity)}><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">None (Open)</option></select></div>{wifiSecurity !== "nopass" && <div className={styles.field}><label htmlFor="wifi-password">Password</label><input id="wifi-password" type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} maxLength={128} placeholder="Wi-Fi password" autoComplete="off" /></div>}</div>
            <label className={styles.checkboxLabel}><input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} /><span>Hidden network</span></label>
          </>}
          {qrType === "whatsapp" && <>
            <div className={styles.phoneRow}><div className={styles.field}><label htmlFor="wa-cc">Country code</label><input id="wa-cc" type="tel" inputMode="numeric" value={waCountryCode} onChange={(e) => setWaCountryCode(e.target.value)} maxLength={3} placeholder="91" /></div><div className={styles.field}><label htmlFor="wa-phone">Phone number</label><input id="wa-phone" type="tel" inputMode="tel" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} maxLength={20} placeholder="9876543210" /></div></div>
            <div className={styles.field}><label htmlFor="wa-message">Pre-filled message (optional)</label><textarea id="wa-message" value={waMessage} onChange={(e) => setWaMessage(e.target.value)} rows={3} maxLength={500} placeholder="Hi, I would like to know more..." /></div>
            <div className="field-hint">Enter the country code separately. Don&apos;t repeat it in the phone number.</div>
          </>}
          {qrType === "phone" && <div className={styles.field}><label htmlFor="qr-phone">Phone number</label><input id="qr-phone" type="tel" inputMode="tel" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} maxLength={20} placeholder="+91 98765 43210" /><div className="field-hint">Scanning opens the phone dialer with this number.</div></div>}
          {qrType === "email" && <>
            <div className={styles.field}><label htmlFor="email-address">Email address</label><input id="email-address" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} maxLength={254} placeholder="hello@example.com" /></div>
            <div className={styles.field}><label htmlFor="email-subject">Subject (optional)</label><input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} maxLength={200} placeholder="Project inquiry" /></div>
            <div className={styles.field}><label htmlFor="email-body">Message (optional)</label><textarea id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={3} maxLength={800} placeholder="Write a default email message..." /></div>
          </>}
          {qrType === "vcard" && <>
            <div className={styles.field}><label htmlFor="vcard-name">Full name</label><input id="vcard-name" value={vcardName} onChange={(e) => setVcardName(e.target.value)} maxLength={120} placeholder="Ranjeet Choudhary" /></div>
            <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="vcard-phone">Phone number (optional)</label><input id="vcard-phone" type="tel" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} maxLength={20} placeholder="+91 98765 43210" /></div><div className={styles.field}><label htmlFor="vcard-email">Email (optional)</label><input id="vcard-email" type="email" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} maxLength={254} placeholder="name@example.com" /></div></div>
            <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="vcard-org">Organization (optional)</label><input id="vcard-org" value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} maxLength={120} placeholder="Ranjeet Digital Studio" /></div><div className={styles.field}><label htmlFor="vcard-website">Website (optional)</label><input id="vcard-website" type="url" value={vcardWebsite} onChange={(e) => setVcardWebsite(e.target.value)} maxLength={300} placeholder="https://ranjeet-labs.netlify.app" /></div></div>
          </>}
        </div>
        {activeError && <p className="error-text" role="alert">{activeError}</p>}
        <div className="tool-tip"><QrCode size={18} /><span>Tip: Test your QR code with your phone camera before printing it.</span></div>
      </div>
      <div className="tool-result">
        <div className="result-label">YOUR QR CODE</div>
        {previewIsCurrent ? <img className="qr-preview" src={dataUrl} alt="Generated QR code" /> : <div className="empty-preview"><QrCode size={44} /></div>}
        <div className={styles.downloadActions}>
          <button type="button" className="button button-primary download-button" disabled={!previewIsCurrent} onClick={() => { if (!previewIsCurrent) return; const a = document.createElement("a"); a.href = dataUrl; a.download = `${filenameBase}.png`; a.click(); }}><Download size={17} /> Download PNG</button>
          <button type="button" className="button button-secondary" disabled={!previewIsCurrent} onClick={downloadSvg}><Download size={17} /> Download SVG</button>
          <button type="button" className="button button-secondary" disabled={!previewIsCurrent} onClick={copyQrImage}><Copy size={17} /> Copy QR Image</button>
        </div>
        {clipboardStatus && <p className={styles.clipboardStatus} role="status">{clipboardStatus}</p>}
      </div>
    </div>
  );
}
