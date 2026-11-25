# Ranjeet Labs Toolbox Expansion

This expansion adds 21 generated tool routes. Browser processing is used for supported file operations; no backend upload endpoints are introduced.

## Added routes
- Image to PDF
- PDF to Image
- Merge PDF
- Split / Extract PDF
- PDF Compressor (structure re-save; not image recompression)
- PDF Page Organizer (page reorder and rotation)
- PDF Watermark and Page Numbers
- Passport Photo Maker
- Photo & Signature Resizer
- Image Format Converter (JPG, PNG, WebP, HEIC input where browser support/dependency works)
- Image Cropper & Resizer
- Social Media Image Resizer
- Invoice Generator
- UPI QR Code Generator
- GST Calculator
- EMI Calculator
- Percentage Calculator
- Text Toolkit
- OCR Image to Text
- Age Calculator
- Date Calculator
- Password Generator

## Install dependencies
Run `npm install` in the project directory after replacing the files. The expansion uses `pdf-lib`, `pdfjs-dist`, `tesseract.js`, and `heic2any`.

## Limitations to verify
- Browser/device HEIC support can vary.
- PDF compression only re-saves structure and is not a full image recompressor.
- OCR language currently uses English.
- Passport photo output is a generic size preset; verify exact official requirements before submitting.
- PDF to Image currently downloads page images separately rather than as a ZIP.
- Invoice template is a simple starter invoice; verify tax and legal requirements before use.
- The photo/signature file-size target uses quality reduction for JPEG/WebP and cannot guarantee a target for PNG.

## QA required
Run `npx.cmd tsc --noEmit`, `npm.cmd run lint`, and `npm.cmd run build`. Then test each route in the browser, including large files, mobile layout, PDF password-protected inputs, unsupported formats, and download output.
