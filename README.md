# 📄 PDFBuddy

> A full-featured, production-ready PDF tools web application built with **React** (frontend) and **Node.js** (backend). Completely free to build and deploy.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61DAFB)

---

## 🌟 Overview

This project is a complete clone of ilovepdf.com — one of the most popular PDF tool websites on the internet. It provides **22 PDF tools** accessible directly in the browser, with a clean modern UI, drag-and-drop file uploads, real-time progress tracking, and automatic file cleanup for privacy.

**Zero database required. Zero cost to run.**

---

## ✨ Features

### 🔧 22 PDF Tools

| Category | Tools |
|----------|-------|
| **Core** | Merge PDF, Split PDF, Compress PDF, Rotate PDF, Organize PDF |
| **Edit** | Watermark PDF, Page Numbers, Crop PDF, Sign PDF, Repair PDF |
| **Security** | Protect PDF (password), Unlock PDF |
| **Convert to PDF** | Word to PDF, Excel to PDF, PPT to PDF, JPG to PDF, HTML to PDF |
| **Convert from PDF** | PDF to Word, PDF to Excel, PDF to PPT, PDF to JPG |
| **Advanced** | OCR PDF |

### 🎨 Frontend Features
- Beautiful, responsive UI inspired by ilovepdf.com
- Drag & drop file upload with file preview
- Real-time upload progress bar
- Animated page transitions with Framer Motion
- Toast notifications for success and errors
- Mobile-first responsive design
- Sticky navbar with dropdown tool menu
- Tool cards grid with color-coded categories
- Draw or type signature for Sign PDF tool
- Per-tool configuration options (quality, position, rotation, etc.)
- Auto-delete reminder for user privacy

### ⚙️ Backend Features
- RESTful API with Express.js
- Multer for multipart file upload handling
- PDF processing with pdf-lib (merge, split, rotate, watermark, protect, crop, sign, organize, page numbers)
- Image processing with Sharp (JPG to PDF and PDF to JPG)
- LibreOffice integration for Office conversions (optional)
- Automatic file cleanup every 30 minutes via node-cron
- Rate limiting (100 requests per 15 minutes per IP)
- Helmet.js security headers
- CORS configuration
- Centralized error handling middleware

### 🔒 Security and Privacy
- Files automatically deleted after 2 hours
- Rate limiting per IP address
- File type validation on both client and server
- Max file size enforcement (100MB default)
- CORS protection
- Security headers via Helmet.js

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI Framework | 18.x |
| Vite | Build Tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| React Router DOM | Client-side routing | 6.x |
| Framer Motion | Animations | 10.x |
| React Dropzone | File upload UI | 14.x |
| React Hot Toast | Notifications | 2.x |
| Axios | HTTP client | 1.x |
| Lucide React | Icons | 0.294 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js | Runtime | 18+ |
| Express.js | Web framework | 4.x |
| pdf-lib | PDF manipulation | 1.x |
| Sharp | Image processing | 0.33 |
| Multer | File uploads | 1.x |
| Archiver | ZIP creation | 6.x |
| Mammoth | Word document reading | 1.x |
| node-cron | Scheduled file cleanup | 3.x |
| express-rate-limit | Rate limiting | 7.x |
| Helmet | Security headers | 7.x |
| Morgan | HTTP request logging | 1.x |
| uuid | Unique filename generation | 9.x |
| cors | CORS middleware | 2.x |
| dotenv | Environment variables | 16.x |

### Optional (Enhanced Features)
| Technology | Purpose |
|-----------|---------|
| LibreOffice | Full Word/Excel/PPT conversions |
| Ghostscript | Better PDF compression |
| Puppeteer | HTML to PDF conversion |
| Tesseract.js | Full OCR text recognition |

---

## 📁 Project Structure

```
ilovepdf-clone/
│
├── README.md                        ← Project documentation
├── SETUP.txt                        ← Step-by-step setup guide
├── .gitignore
├── docker-compose.yml               ← Run everything with Docker
│
├── frontend/                        ← React App (Vite)
│   ├── Dockerfile
│   ├── index.html                   ← HTML entry with Google Fonts
│   ├── vite.config.js               ← Vite + proxy config
│   ├── tailwind.config.js           ← Custom colors and fonts
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                 ← React entry point
│       ├── App.jsx                  ← Router setup with all 22 routes
│       ├── index.css                ← Global styles + Tailwind directives
│       │
│       ├── components/              ← Reusable UI components
│       │   ├── Navbar.jsx           ← Sticky nav with tool dropdown
│       │   ├── Footer.jsx           ← Links and privacy info
│       │   ├── FileUploader.jsx     ← Drag and drop file input
│       │   └── ToolPage.jsx         ← Shared layout for all tool pages
│       │
│       ├── pages/                   ← One page per PDF tool (22 total)
│       │   ├── Home.jsx             ← Animated tool card grid
│       │   ├── MergePDF.jsx         ← Merge with drag-to-reorder
│       │   ├── SplitPDF.jsx         ← Split by range or every N pages
│       │   ├── CompressPDF.jsx      ← Compression quality selector
│       │   ├── RotatePDF.jsx        ← Angle and page scope selector
│       │   ├── WatermarkPDF.jsx     ← Text, opacity, color, position
│       │   ├── ProtectPDF.jsx       ← Password input with confirm
│       │   ├── UnlockPDF.jsx        ← Remove PDF password
│       │   ├── PageNumbers.jsx      ← Format and position options
│       │   ├── SignPDF.jsx          ← Canvas draw or typed signature
│       │   ├── OrganizePDF.jsx      ← Reorder and delete pages
│       │   ├── CropPDF.jsx          ← Margin controls (top/right/bottom/left)
│       │   ├── RepairPDF.jsx        ← Repair corrupted PDFs
│       │   ├── OCR.jsx              ← Language selector for OCR
│       │   ├── PDFtoJPG.jsx         ← Image quality selector
│       │   ├── JPGtoPDF.jsx         ← Page size and orientation
│       │   ├── PDFtoWord.jsx
│       │   ├── WordtoPDF.jsx
│       │   ├── PDFtoExcel.jsx
│       │   ├── ExceltoPDF.jsx
│       │   ├── PDFtoPPT.jsx
│       │   ├── PPTtoPDF.jsx
│       │   ├── HTMLtoPDF.jsx        ← URL input field
│       │   └── NotFound.jsx         ← 404 error page
│       │
│       └── utils/
│           └── api.js               ← All Axios API call functions
│
└── backend/                         ← Node.js + Express API
    ├── Dockerfile
    ├── server.js                    ← Main entry, middleware, cron cleanup
    ├── package.json
    ├── .env.example                 ← Copy to .env and fill in values
    │
    ├── middleware/
    │   └── upload.js                ← Multer config for PDF, images, office files
    │
    ├── utils/
    │   └── fileHelper.js            ← Shared helpers: outputPath, downloadUrl, cleanup
    │
    └── routes/                      ← One file per tool or tool group
        ├── merge.js                 ← POST /api/merge
        ├── split.js                 ← POST /api/split
        ├── compress.js              ← POST /api/compress
        ├── rotate.js                ← POST /api/rotate
        ├── watermark.js             ← POST /api/watermark
        ├── protect.js               ← POST /api/protect and /api/unlock
        ├── pagenumbers.js           ← POST /api/page-numbers
        ├── sign.js                  ← POST /api/sign
        ├── organize.js              ← POST /api/organize
        ├── crop.js                  ← POST /api/crop
        ├── repair.js                ← POST /api/repair
        ├── ocr.js                   ← POST /api/ocr
        ├── images.js                ← POST /api/jpg-to-pdf and /api/pdf-to-jpg
        └── convert.js               ← POST /api/*-to-pdf and /api/pdf-to-*
```

---

## 🚀 API Reference

All endpoints accept `multipart/form-data`. Files go in the `files` field.

| Method | Endpoint | Body Fields | Description |
|--------|----------|-------------|-------------|
| POST | `/api/merge` | `files` (multiple PDFs) | Merge PDFs in order |
| POST | `/api/split` | `files`, `splitMode`, `pageRange`, `everyN` | Split PDF pages |
| POST | `/api/compress` | `files`, `quality` | Reduce PDF file size |
| POST | `/api/rotate` | `files`, `rotation`, `pages` | Rotate PDF pages |
| POST | `/api/watermark` | `files`, `text`, `opacity`, `position`, `fontSize`, `color` | Add text watermark |
| POST | `/api/protect` | `files`, `password` | Encrypt PDF |
| POST | `/api/unlock` | `files`, `password` | Remove PDF encryption |
| POST | `/api/page-numbers` | `files`, `position`, `format`, `startNum` | Add page numbers |
| POST | `/api/sign` | `files`, `signMode`, `signature` | Embed signature |
| POST | `/api/organize` | `files`, `pageOrder`, `deletePages` | Reorder or delete pages |
| POST | `/api/crop` | `files`, `top`, `right`, `bottom`, `left` | Crop page margins (mm) |
| POST | `/api/repair` | `files` | Repair corrupted PDF |
| POST | `/api/ocr` | `files`, `lang` | OCR scanned document |
| POST | `/api/jpg-to-pdf` | `files` (images), `pageSize`, `orientation` | Images to PDF |
| POST | `/api/pdf-to-jpg` | `files`, `quality` | PDF pages to images |
| POST | `/api/word-to-pdf` | `files` (.doc/.docx) | Word document to PDF |
| POST | `/api/pdf-to-word` | `files` | PDF to Word document |
| POST | `/api/excel-to-pdf` | `files` (.xls/.xlsx) | Spreadsheet to PDF |
| POST | `/api/pdf-to-excel` | `files` | PDF to spreadsheet |
| POST | `/api/ppt-to-pdf` | `files` (.ppt/.pptx) | Presentation to PDF |
| POST | `/api/pdf-to-ppt` | `files` | PDF to presentation |
| POST | `/api/html-to-pdf` | `url` (JSON body) | Webpage URL to PDF |
| GET | `/health` | — | Server health check |

### Standard Success Response
```json
{
  "success": true,
  "downloadUrl": "http://localhost:5000/outputs/550e8400-e29b-41d4-a716-446655440000.pdf",
  "filename": "merged.pdf"
}
```

### Standard Error Response
```json
{
  "error": "Please upload at least 2 PDF files"
}
```

---

## 🌐 Free Deployment Guide

### Frontend → Vercel (Recommended)
```bash
cd frontend
npm install -g vercel
vercel
# Follow the prompts. Live in under 60 seconds.
```

Set environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend.fly.dev/api
```

### Backend → Fly.io (Recommended)
```bash
cd backend
npm install -g flyctl
fly auth login
fly launch
fly deploy
```

Set secrets on Fly.io:
```bash
fly secrets set NODE_ENV=production
fly secrets set FRONTEND_URL=https://your-app.vercel.app
```

### File Storage → Cloudflare R2 (Free 10GB)
1. Go to cloudflare.com → R2 → Create bucket
2. Create API token with R2 permissions
3. Add to backend `.env`:
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=ilovepdf-files
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### Free Tier Summary
| Service | Free Allowance |
|---------|---------------|
| Vercel | 100GB bandwidth/month |
| Fly.io | 3 shared VMs, always on |
| Cloudflare R2 | 10GB storage, unlimited downloads |
| Total Cost | $0/month |

---

## ⚙️ Environment Variables

### Backend `.env`
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Settings
MAX_FILE_SIZE_MB=100
FILE_EXPIRY_HOURS=2

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100

# Cloudflare R2 (optional — uses local storage if not set)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔌 Installing Optional Tools

### LibreOffice — for Office file conversions
```bash
# Ubuntu / Debian / WSL
sudo apt-get update && sudo apt-get install -y libreoffice

# macOS
brew install --cask libreoffice

# Verify installation
libreoffice --version
```

### Puppeteer — for HTML to PDF
```bash
cd backend
npm install puppeteer
# Downloads Chromium automatically (~170MB)
```

### Tesseract.js — for OCR
```bash
cd backend
npm install tesseract.js
```

### Ghostscript — for enhanced PDF compression
```bash
# Ubuntu / Debian / WSL
sudo apt-get install -y ghostscript

# macOS
brew install ghostscript

# Verify
gs --version
```

---

## 🐛 Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| CORS error in browser | Backend URL mismatch | Set `FRONTEND_URL` in backend `.env` |
| File too large (413 error) | Size limit exceeded | Increase `MAX_FILE_SIZE_MB` |
| LibreOffice conversion fails | Not installed | Install LibreOffice or use Docker |
| Port 3000 or 5000 in use | Another process | Change `PORT` in `.env` |
| Rate limit error (429) | Too many requests | Wait 15 min or increase `RATE_LIMIT_MAX_REQUESTS` |
| PDF cannot be opened | May be encrypted | Use Unlock PDF tool first |
| `npm install` fails | Node version too old | Use Node.js 18 or higher |
| Vite proxy not working | Wrong proxy config | Check `vite.config.js` target URL |

---

## 📈 Roadmap

- [ ] Cloudflare R2 cloud storage integration
- [ ] Redis + Bull job queue for large files
- [ ] WebSocket real-time progress updates
- [ ] Batch download as ZIP
- [ ] PWA support for offline use
- [ ] User accounts (optional, no DB needed with Supabase)
- [ ] API access with key management
- [ ] Admin dashboard
- [ ] Google AdSense integration
- [ ] Stripe Pro plan

---

## 📄 License

MIT License — Free to use, modify, and distribute for personal and commercial projects.

---

## 🙏 Credits

- [pdf-lib](https://pdf-lib.js.org/) — PDF manipulation in JavaScript
- [Sharp](https://sharp.pixelplumbing.com/) — High-performance image processing
- [LibreOffice](https://www.libreoffice.org/) — Office file conversions
- [ilovepdf.com](https://ilovepdf.com) — Original design inspiration

---

*Built with ❤️ — 22 PDF tools, zero database, 100% free to run*
