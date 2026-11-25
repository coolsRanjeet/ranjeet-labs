 "use client";

import { FormEvent, useState } from "react";
import { Copy, RefreshCw, Sparkles } from "lucide-react";

type Language = "English" | "Hindi" | "Hinglish";

function makeScript(business: string, offer: string, audience: string, language: Language, duration: string) {
  const isHindi = language === "Hindi";
  const isMix = language === "Hinglish";
  const name = business.trim() || (isHindi ? "आपका बिज़नेस" : "your business");
  const product = offer.trim() || (isHindi ? "आपकी खास सर्विस" : "your product or service");
  const people = audience.trim() || (isHindi ? "आपके ग्राहक" : "your audience");
  const copy = (en: string, hi: string, mix: string) => isHindi ? hi : isMix ? mix : en;

  return {
    title: `${name}: ${duration}-second Reel concept`,
    hook: copy(
      `Still looking for a better ${product.toLowerCase()}? Watch this.`,
      `क्या आप ${product} के लिए बेहतर विकल्प ढूंढ रहे हैं?`,
      `${product} के लिए कुछ better ढूंढ रहे हैं? ये देखिए!`
    ),
    scenes: [
      { time: "0–3 sec", title: "Stop the scroll", detail: copy(`Open with a close-up or the most eye-catching result. Put the hook on screen: “${product} — here's what makes it worth a look.”`, `एक आकर्षक close-up दिखाएं। स्क्रीन पर लिखें: “${product} — जानिए इसकी खासियत।”`, `एक eye-catching close-up से शुरू करें। Text: “${product} — ये क्यों खास है?”`) },
      { time: "3–9 sec", title: "Show the value", detail: copy(`Show ${product} in action. Use two or three quick shots that make the benefit clear to ${people}.`, `${product} को इस्तेमाल करते हुए दिखाएं। ${people} के लिए इसके फायदे साफ बताएं।`, `${product} को use करते हुए दिखाएं। ${people} को मिलने वाला benefit highlight करें।`) },
      { time: "9–15 sec", title: "Build confidence", detail: copy(`Show a real detail: ingredients, process, feature, result or customer experience. Avoid claims you cannot verify.`, `कोई असली detail दिखाएं: प्रक्रिया, feature, quality या customer experience।`, `कोई real detail दिखाएं: process, feature, quality या customer experience।`) },
      { time: "Final 3 sec", title: "Clear call to action", detail: copy(`Invite viewers to message you, visit your store or check the link in your bio.`, `लोगों से कहें कि वे message करें, दुकान पर आएं या bio में link देखें।`, `Viewers को DM करने, store visit करने या bio link check करने के लिए कहें।`) }
    ],
    caption: copy(
      `Looking for ${product.toLowerCase()}? Discover what ${name} has to offer. Save this Reel or send us a message to know more.`,
      `${product} के बारे में जानना चाहते हैं? ${name} पर जरूर आएं। अधिक जानकारी के लिए हमें मैसेज करें।`,
      `${product} के बारे में जानना चाहते हैं? ${name} को explore करें और details के लिए DM करें!`
    ),
    hashtags: ["#SmallBusiness", "#MadeInIndia", "#ReelsIndia", "#BusinessGrowth", `#${name.replace(/[^a-z0-9]/gi, "")}`]
  };
}

export default function ReelScriptGenerator() {
  const [business, setBusiness] = useState("Restaurant");
  const [offer, setOffer] = useState("Paneer tikka");
  const [audience, setAudience] = useState("Local food lovers");
  const [language, setLanguage] = useState<Language>("Hinglish");
  const [duration, setDuration] = useState("20");
  const [result, setResult] = useState<ReturnType<typeof makeScript> | null>(null);
  const [copied, setCopied] = useState(false);

  function generate(e: FormEvent) {
    e.preventDefault();
    setResult(makeScript(business, offer, audience, language, duration));
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;
    const text = `${result.title}\n\nHOOK\n${result.hook}\n\n${result.scenes.map(s => `${s.time} — ${s.title}\n${s.detail}`).join("\n\n")}\n\nCAPTION\n${result.caption}\n\n${result.hashtags.join(" ")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return <div className="script-layout">
    <form className="script-form" onSubmit={generate}>
      <label htmlFor="business">Business or creator niche</label>
      <input id="business" value={business} onChange={e => setBusiness(e.target.value)} placeholder="e.g. Restaurant, salon, fitness coach" maxLength={60} />
      <label htmlFor="offer">Product, service or topic</label>
      <input id="offer" value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. Paneer tikka, haircut, yoga class" maxLength={100} />
      <label htmlFor="audience">Who do you want to reach?</label>
      <input id="audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Local families, students" maxLength={100} />
      <div className="form-two">
        <div><label htmlFor="language">Language</label><select id="language" value={language} onChange={e => setLanguage(e.target.value as Language)}><option>Hinglish</option><option>English</option><option>Hindi</option></select></div>
        <div><label htmlFor="duration">Video length</label><select id="duration" value={duration} onChange={e => setDuration(e.target.value)}><option value="15">15 seconds</option><option value="20">20 seconds</option><option value="30">30 seconds</option></select></div>
      </div>
      <button className="button button-primary full-button" type="submit"><Sparkles size={17} /> Generate my script</button>
      <p className="field-hint">This starter tool uses built-in templates. It does not call an AI service.</p>
    </form>
    <div className="script-output">
      {!result ? <div className="script-empty"><span><Sparkles size={25} /></span><strong>Your script will appear here</strong><p>Fill in the details and generate a video concept you can adapt.</p></div> : <>
        <div className="output-top"><span className="result-label">YOUR REEL PLAN</span><button className="copy-button" onClick={copyResult}><Copy size={15} /> {copied ? "Copied" : "Copy all"}</button></div>
        <h3>{result.title}</h3>
        <div className="script-block"><small>OPENING HOOK</small><p className="hook-text">“{result.hook}”</p></div>
        {result.scenes.map(scene => <div className="scene" key={scene.time}><span className="scene-time">{scene.time}</span><div><strong>{scene.title}</strong><p>{scene.detail}</p></div></div>)}
        <div className="script-block"><small>CAPTION</small><p>{result.caption}</p></div>
        <div className="hashtags">{result.hashtags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <button className="button button-secondary full-button" onClick={() => setResult(makeScript(business, offer, audience, language, duration))}><RefreshCw size={15} /> Refresh concept</button>
      </>}
    </div>
  </div>;
}
