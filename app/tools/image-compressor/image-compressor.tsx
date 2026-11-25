"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Images, RefreshCw, Trash2, FileImage, Settings2, Zap, ShieldCheck, Eye, Archive } from "lucide-react";
import styles from "./image-compressor.module.css";

type OutputFormat = "image/jpeg" | "image/webp" | "image/png";
type ImageItem = { id: string; file: File; originalUrl: string; outputUrl?: string; outputBlob?: Blob; outputName?: string; width: number; height: number; outWidth?: number; outHeight?: number; busy: boolean; error?: string; };
const MAX_FILE = 25 * 1024 * 1024;
const formats: { label: string; value: OutputFormat; ext: string }[] = [{ label: "JPEG", value: "image/jpeg", ext: "jpg" }, { label: "WebP", value: "image/webp", ext: "webp" }, { label: "PNG", value: "image/png", ext: "png" }];
const presets = [{ name: "Best quality", quality: 0.92 }, { name: "Balanced", quality: 0.78 }, { name: "Small file", quality: 0.58 }, { name: "Website", quality: 0.72 }, { name: "Email", quality: 0.55 }];
function bytes(n: number) { if (n < 1024) return `${n} B`; if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`; return `${(n / 1024 / 1024).toFixed(2)} MB`; }
function percent(original: number, compressed: number) { return Math.round((1 - compressed / original) * 100); }
function safeName(name: string) { return name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "-"); }
function loadImage(file: File): Promise<HTMLImageElement> { return new Promise((resolve, reject) => { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { URL.revokeObjectURL(url); resolve(img); }; img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This image could not be opened.")); }; img.src = url; }); }
function canvasBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> { return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Your browser couldn't create the compressed image.")), format, quality)); }
// Small ZIP writer (store method; no external library or server required).
function crc32(data: Uint8Array) { let c = 0xffffffff; for (const b of data) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return (c ^ 0xffffffff) >>> 0; }
function zipFiles(files: { name: string; blob: Blob }[]) {
  return Promise.all(
    files.map(async (file) => ({
      name: file.name,
      data: new Uint8Array(await file.blob.arrayBuffer()),
    }))
  ).then((entries) => {
    const local: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    let offset = 0;
    const encoder = new TextEncoder();

    entries.forEach(({ name, data }) => {
      const filename = encoder.encode(name);
      const crc = crc32(data);

      const localHeader = new Uint8Array(30 + filename.length);
      const localView = new DataView(localHeader.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0, true);
      localView.setUint16(8, 0, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, filename.length, true);
      localHeader.set(filename, 30);
      local.push(localHeader, data);

      const centralHeader = new Uint8Array(46 + filename.length);
      const centralView = new DataView(centralHeader.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, filename.length, true);
      centralView.setUint32(42, offset, true);
      centralHeader.set(filename, 46);
      central.push(centralHeader);

      offset += localHeader.length + data.length;
    });

    const centralSize = central.reduce((total, part) => total + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);

    const parts = [...local, ...central, end].map((part) => {
      const buffer = new ArrayBuffer(part.byteLength);
      new Uint8Array(buffer).set(part);
      return buffer;
    });

    return new Blob(parts, { type: "application/zip" });
  });
}

export default function ImageCompressor() {
 const [items, setItems] = useState<ImageItem[]>([]); const [quality, setQuality] = useState(0.78); const [format, setFormat] = useState<OutputFormat>("image/webp"); const [resize, setResize] = useState(false); const [width, setWidth] = useState(1920); const [height, setHeight] = useState(1920); const [keepRatio, setKeepRatio] = useState(true); const [scale, setScale] = useState(100); const [preset, setPreset] = useState("Balanced"); const [targetEnabled, setTargetEnabled] = useState(false); const [targetKB, setTargetKB] = useState("300"); const [bg, setBg] = useState("#ffffff"); const [compare, setCompare] = useState(50); const [drag, setDrag] = useState(false); const [error, setError] = useState(""); const [processing, setProcessing] = useState(false); const inputRef = useRef<HTMLInputElement>(null); const itemsRef = useRef<ImageItem[]>(items); itemsRef.current = items;
 const totalOriginal = items.reduce((s, i) => s + i.file.size, 0); const totalOutput = items.reduce((s, i) => s + (i.outputBlob?.size || 0), 0); const done = items.filter(i => i.outputBlob).length;
 useEffect(() => () => { itemsRef.current.forEach(i => { URL.revokeObjectURL(i.originalUrl); if (i.outputUrl) URL.revokeObjectURL(i.outputUrl); }); }, []);
 async function processOne(item: ImageItem, settings = { quality, format, resize, width, height, keepRatio, scale, targetEnabled, targetKB: Number(targetKB), bg }) {
   setItems(prev => prev.map(x => x.id === item.id ? { ...x, busy: true, error: undefined } : x));
   try { const img = await loadImage(item.file); let w = img.naturalWidth, h = img.naturalHeight;
     if (settings.resize) { if (settings.scale !== 100) { w = Math.max(1, Math.round(w * settings.scale/100)); h = Math.max(1, Math.round(h * settings.scale/100)); } else if (settings.keepRatio) { const f = Math.min(1, settings.width/w, settings.height/h); w = Math.max(1, Math.round(w*f)); h = Math.max(1, Math.round(h*f)); } else { w = Math.max(1, settings.width); h = Math.max(1, settings.height); } }
     const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; const ctx = canvas.getContext("2d", { alpha: settings.format !== "image/jpeg" }); if (!ctx) throw new Error("Canvas is unavailable in this browser."); if (settings.format === "image/jpeg") { ctx.fillStyle = settings.bg; ctx.fillRect(0,0,w,h); } ctx.drawImage(img,0,0,w,h);
     let q = settings.quality, blob = await canvasBlob(canvas, settings.format, q); if (settings.targetEnabled && settings.format !== "image/png") { const safeTargetKB = Number.isFinite(settings.targetKB) ? Math.min(25000, Math.max(10, settings.targetKB)) : 300; const target = safeTargetKB * 1024; for (let tries=0; blob.size > target && q > 0.1 && tries < 8; tries++) { q = Math.max(0.1, q - 0.1); blob = await canvasBlob(canvas, settings.format, q); } }
     const ext = formats.find(f=>f.value===settings.format)?.ext || "img"; const name = `${safeName(item.file.name)}-compressed.${ext}`; const outUrl = URL.createObjectURL(blob);
     setItems(prev=>prev.map(x=>{ if(x.id!==item.id)return x; if(x.outputUrl)URL.revokeObjectURL(x.outputUrl); return {...x, outputUrl:outUrl, outputBlob:blob, outputName:name, outWidth:w, outHeight:h, width:img.naturalWidth, height:img.naturalHeight, busy:false}; }));
   } catch(e) { setItems(prev=>prev.map(x=>x.id===item.id?{...x,busy:false,error:e instanceof Error?e.message:"Compression failed."}:x)); }
 }
 async function addFiles(files: FileList | File[]) { setError(""); const list=Array.from(files); const accepted=list.filter(f=>["image/jpeg","image/png","image/webp","image/avif"].includes(f.type)); if(!accepted.length){setError("Choose JPG, PNG, WebP or AVIF images.");return;} const tooLarge=accepted.filter(f=>f.size>MAX_FILE); if(tooLarge.length){setError(`${tooLarge.map(f=>f.name).join(", ")} exceed the 25 MB limit and were skipped.`);} const valid=accepted.filter(f=>f.size<=MAX_FILE); const newItems:ImageItem[]=[]; for(const f of valid){try{const img=await loadImage(f); newItems.push({id:crypto.randomUUID(),file:f,originalUrl:URL.createObjectURL(f),width:img.naturalWidth,height:img.naturalHeight,busy:false});}catch{setError(`Could not read ${f.name}.`);}} setItems(prev=>[...prev,...newItems]); }
 function onInput(e:ChangeEvent<HTMLInputElement>){if(e.target.files)void addFiles(e.target.files);e.target.value="";}
 function applyPreset(name:string){setPreset(name);const p=presets.find(x=>x.name===name);if(p)setQuality(p.quality);}
 async function recompressAll(){
   const targetValue = Number(targetKB);
   if(targetEnabled && (!Number.isFinite(targetValue) || targetValue < 10 || targetValue > 25000)){
     setError("Enter a target size between 10 KB and 25,000 KB.");
     return;
   }
   setError("");
   setProcessing(true);
   const snapshot=items;
   const settings = { quality, format, resize, width, height, keepRatio, scale, targetEnabled, targetKB: targetValue, bg };
   for(const it of snapshot) await processOne(it, settings);
   setProcessing(false);
 }
 function remove(id:string){setItems(prev=>{const item=prev.find(x=>x.id===id);if(item){URL.revokeObjectURL(item.originalUrl);if(item.outputUrl)URL.revokeObjectURL(item.outputUrl);}return prev.filter(x=>x.id!==id);});}
 function clear(){items.forEach(i=>{URL.revokeObjectURL(i.originalUrl);if(i.outputUrl)URL.revokeObjectURL(i.outputUrl);});setItems([]);setError("");}
 function download(item:ImageItem){if(item.outputUrl&&item.outputName){const a=document.createElement("a");a.href=item.outputUrl;a.download=item.outputName;a.click();}}
 async function downloadZip(){const ready=items.filter(i=>i.outputBlob&&i.outputName);if(!ready.length)return;const used=new Set<string>();const files=ready.map(i=>{const original=i.outputName!;const dot=original.lastIndexOf(".");const stem=dot>0?original.slice(0,dot):original;const ext=dot>0?original.slice(dot):"";let name=original;let suffix=2;while(used.has(name.toLowerCase())){name=`${stem}-${suffix}${ext}`;suffix++;}used.add(name.toLowerCase());return{name,blob:i.outputBlob!};});const blob=await zipFiles(files);const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="compressed-images.zip";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function drop(e:DragEvent<HTMLDivElement>){e.preventDefault();setDrag(false);void addFiles(e.dataTransfer.files);}
 return <div className={styles.app}>
   <div className={styles.privacy}><ShieldCheck size={16}/> Private & secure: images are processed entirely on your device.</div>
   <div className={`${styles.drop} ${drag?styles.dragging:""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={drop} onClick={()=>inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")inputRef.current?.click();}}>
     <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={onInput}/><div className={styles.uploadIcon}><ImagePlus size={27}/></div><strong>Drop images here or browse files</strong><span>JPG, PNG, WebP, AVIF · Up to 25 MB each · Multiple files supported</span><button type="button" className="button button-secondary" onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>Choose images</button>
   </div>
   {error&&<div className={styles.error}>{error}</div>}
   {items.length>0&&<>
    <div className={styles.toolbar}><div><strong>{items.length} image{items.length!==1?"s":""}</strong><span>{done} compressed · {bytes(totalOriginal)} total</span></div><div className={styles.toolbarActions}><button className={styles.textButton} onClick={clear}><Trash2 size={15}/> Clear all</button><button className="button button-secondary" onClick={()=>inputRef.current?.click()}><Images size={15}/> Add more</button></div></div>
    <section className={styles.settings}><div className={styles.settingsHeading}><Settings2 size={17}/><strong>Compression settings</strong><span>Apply to all images</span></div>
      <div className={styles.settingGrid}><label>Output format<select value={format} onChange={e=>setFormat(e.target.value as OutputFormat)}><option value="image/webp">WebP · Recommended</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG · Lossless</option></select></label><label>Preset<select value={preset} onChange={e=>applyPreset(e.target.value)}>{presets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}<option value="Custom">Custom</option></select></label></div>
      <div className={styles.quality}><div><label>Quality</label><small>Lower quality usually produces a smaller file</small></div><b>{Math.round(quality*100)}%</b></div><input className={styles.range} type="range" min={10} max={100} step={5} value={Math.round(quality*100)} onChange={e=>{setQuality(Number(e.target.value)/100);setPreset("Custom");}}/>
      <label className={styles.check}><input type="checkbox" checked={targetEnabled} onChange={e=>setTargetEnabled(e.target.checked)}/> Try to reach a target file size</label>{targetEnabled&&<div className={styles.target}><label htmlFor="target-size">Target size (KB)</label><input id="target-size" type="text" inputMode="numeric" pattern="[0-9]*" value={targetKB} onChange={e=>setTargetKB(e.target.value)} onBlur={()=>{if(targetKB.trim()==="")return;const n=Number(targetKB);if(Number.isFinite(n))setTargetKB(String(Math.min(25000,Math.max(10,Math.round(n)))));}}/><div className={styles.targetPresets}>{[50,100,200,500,1024].map(v=><button type="button" key={v} onClick={()=>setTargetKB(String(v))}>{v===1024?"1 MB":`${v} KB`}</button>)}</div><small>Type any value from 10 KB to 25,000 KB. Quality is reduced automatically until the target is reached or minimum quality is tried.</small></div>}
      <div className={styles.resizeHeader}><label className={styles.check}><input type="checkbox" checked={resize} onChange={e=>setResize(e.target.checked)}/> Resize images</label><span>Optional</span></div>{resize&&<div className={styles.resizeBox}><div className={styles.settingGrid}><label>Width (px)<input type="number" min={1} max={12000} value={width} onChange={e=>setWidth(Math.max(1,Number(e.target.value)||1))}/></label><label>Height (px)<input type="number" min={1} max={12000} value={height} onChange={e=>setHeight(Math.max(1,Number(e.target.value)||1))}/></label></div><label className={styles.check}><input type="checkbox" checked={keepRatio} onChange={e=>setKeepRatio(e.target.checked)}/> Maintain aspect ratio (fit within dimensions)</label><label>Resize by percentage: <b>{scale}%</b><input className={styles.range} type="range" min={10} max={100} step={5} value={scale} onChange={e=>setScale(Number(e.target.value))}/></label><div className={styles.presets}>{[640,1280,1920,2400].map(v=><button key={v} onClick={()=>{setWidth(v);setHeight(v);setKeepRatio(true);setScale(100);}}>{v}px max</button>)}</div></div>}
      {format==="image/jpeg"&&<label className={styles.bg}>Background for transparency <input type="color" value={bg} onChange={e=>setBg(e.target.value)}/></label>}
      <button className="button button-primary" onClick={recompressAll} disabled={processing}><RefreshCw size={16} className={processing?styles.spin:""}/>{processing?"Compressing…":"Compress / Apply settings to all"}</button>
    </section>
    {done>0&&<div className={styles.summary}><div><small>Total original</small><strong>{bytes(totalOriginal)}</strong></div><div><small>Compressed</small><strong>{bytes(totalOutput)}</strong></div><div><small>Total saved</small><strong className={styles.saved}>{bytes(Math.max(0,totalOriginal-totalOutput))} ({Math.max(0,percent(totalOriginal,totalOutput))}%)</strong></div><button className="button button-secondary" onClick={downloadZip} disabled={done<2}><Archive size={16}/> Download ZIP ({done})</button></div>}
    <div className={styles.list}>
      {items.map(item => (
        <article className={styles.item} key={item.id}>
          <div className={styles.itemHead}>
            <div className={styles.fileIcon}><FileImage size={18}/></div>
            <div className={styles.fileInfo}><strong title={item.file.name}>{item.file.name}</strong><span>{bytes(item.file.size)} · {item.width} × {item.height}</span></div>
            <button className={styles.iconButton} aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)}><Trash2 size={16}/></button>
          </div>
          {item.error && <p className={styles.error}>{item.error}</p>}
          {item.busy ? <div className={styles.loading}><RefreshCw size={16} className={styles.spin}/> Processing…</div> : item.outputUrl && item.outputBlob ? (
            <>
              <div className={styles.preview}><div className={styles.previewLabels}><span>Original</span><span>Compressed</span></div><div className={styles.compare}><img src={item.originalUrl} alt="Original image"/><div className={styles.after} style={{clipPath: `inset(0 0 0 ${compare}%)`}}><img src={item.outputUrl} alt="Compressed preview"/></div><div className={styles.divider} style={{left: `${compare}%`}}/></div></div>
              <input className={styles.range} aria-label="Compare original and compressed" type="range" min={0} max={100} value={compare} onChange={e => setCompare(Number(e.target.value))}/>
              <div className={styles.stats}><div><small>Output</small><strong>{bytes(item.outputBlob.size)}</strong></div><div><small>Dimensions</small><strong>{item.outWidth} × {item.outHeight}</strong></div><div><small>Saved</small><strong className={item.outputBlob.size < item.file.size ? styles.saved : styles.neutral}>{percent(item.file.size,item.outputBlob.size)}%</strong></div></div>
              <button className="button button-primary" onClick={() => download(item)}><Download size={16}/> Download</button>
              {item.outputBlob.size >= item.file.size && <small className={styles.note}>This output is larger than the original. Try a smaller size or a different format.</small>}
            </>
          ) : <button className="button button-secondary" onClick={() => processOne(item)}><Zap size={15}/> Compress this image</button>}
        </article>
      ))}
    </div>
   </>}
   <div className={styles.footerNote}><ShieldCheck size={15}/> Processing happens locally. Metadata is not copied into the exported image. <span><Eye size={14}/> Preview before downloading</span></div>
 </div>;
}
