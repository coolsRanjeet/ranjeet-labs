# Ranjeet Labs

A separate digital-products and free-tools platform by Ranjeet Digital Studio.

## Included in this first release

- Responsive Ranjeet Labs homepage
- QR Code Generator (creates downloadable PNG QR codes)
- Image Compressor (client-side JPEG compression; files stay in the browser)
- Reel Script Generator (template-based English, Hindi and Hinglish output)
- Ranjeet AI Studio showcase page section
- Marketplace placeholder (clearly marked as not yet selling products)

## Important project boundary

This repository is independent. It does not contain, import, modify or replace the existing Ranjeet AI Studio project.

The Ranjeet AI Studio homepage section is a product showcase only. It does not claim the application is production-ready or available for purchase.

## Requirements

- Windows 10/11, macOS or Linux
- Node.js 20.9 or newer (Node.js 22 LTS recommended)
- npm
- Git (optional, for version control)

## Run locally on Windows

1. Extract this ZIP to a folder such as `D:\Projects\ranjeet-labs`.
2. Open that folder in VS Code.
3. Open Terminal → New Terminal.
4. Confirm Node and npm are available:

   ```powershell
   node -v
   npm -v
   ```

5. Install dependencies:

   ```powershell
   npm install
   ```

6. Start the development server:

   ```powershell
   npm run dev
   ```

7. Open `http://localhost:3000`.

## Production build

```powershell
npm run build
npm run start
```

Run `npm run build` before deployment. Fix any reported TypeScript or build errors before publishing.

## Deploy to Netlify

1. Create a new GitHub repository named `ranjeet-labs`.
2. Push this project to that new repository.
3. In Netlify, choose **Add new site → Import an existing project**.
4. Connect the `ranjeet-labs` repository.
5. Use the Next.js build configuration detected by Netlify.
6. Deploy and verify all three tools on desktop and mobile.

Do not connect this repository to the existing Ranjeet AI Studio deployment.

## Tool notes

### QR Code Generator
- Uses the `qrcode` package.
- Generates a PNG locally in the browser.
- Input is not sent to a backend.

### Image Compressor
- Uses the browser's Canvas API.
- Converts selected images to JPEG.
- Maximum input size is 15 MB.
- The current version does not preserve transparency or animated GIF frames. Transparent areas become white.
- Compression is local; files are not uploaded.

### Reel Script Generator
- Uses built-in templates and language variants.
- Does not call Gemini, OpenAI or any paid AI API.
- Outputs are suggestions, not verified marketing claims. Review details before publishing.

## Before public launch

- Replace `https://example.com` in `app/layout.tsx` with the verified production domain.
- Add a real business contact email.
- Add privacy, terms and support pages before collecting personal data or taking payments.
- Test on Chrome, Edge, Firefox and mobile browsers.
- Verify all tool outputs and accessibility.
- Add analytics only after configuring the relevant privacy notice.
- Do not list source code or AI Studio as purchasable until clean-install, licensing and security checks are complete.

## Suggested next milestones

1. Add automated tests and a deployment preview.
2. Add real contact/enquiry handling with spam protection.
3. Add tool-specific SEO content and social sharing images.
4. Add marketplace product detail pages.
5. Add secure payments and customer downloads only after products and licences are ready.
