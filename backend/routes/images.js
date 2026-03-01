const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { uploadPDF, uploadImages } = require('../middleware/upload')
const { outputPath, downloadUrl, cleanupFiles } = require('../utils/fileHelper')

// ─────────────────────────────────────────────
// JPG / PNG  →  PDF
// ─────────────────────────────────────────────
router.post('/jpg-to-pdf', uploadImages.array('files', 30), async (req, res, next) => {
  const inputPaths = req.files?.map(f => f.path) || []
  let outPath = null
  try {
    if (!req.files?.length)
      return res.status(400).json({ error: 'Please upload at least one image' })

    const { pageSize = 'A4', orientation = 'portrait' } = req.body
    const pageSizes = { A4: [595, 842], A3: [842, 1191], A5: [420, 595], Letter: [612, 792] }
    let [pageW, pageH] = pageSizes[pageSize] || pageSizes.A4
    if (orientation === 'landscape') [pageW, pageH] = [pageH, pageW]

    const pdf = await PDFDocument.create()

    for (const file of req.files) {
      const jpgBuffer = await sharp(file.path).jpeg({ quality: 90 }).toBuffer()
      const img = await pdf.embedJpg(jpgBuffer)
      const page = pdf.addPage([pageW, pageH])
      const scale = Math.min(pageW / img.width, pageH / img.height)
      const w = img.width * scale
      const h = img.height * scale
      page.drawImage(img, { x: (pageW - w) / 2, y: (pageH - h) / 2, width: w, height: h })
    }

    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)

    res.json({ success: true, downloadUrl: downloadUrl(req, outPath), filename: 'images.pdf' })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(...inputPaths)
  }
})

// ─────────────────────────────────────────────
// PDF  →  JPG
// Strategy 1: pdf2pic  (npm install pdf2pic)     ← recommended
// Strategy 2: Ghostscript if installed on system ← auto fallback  
// ─────────────────────────────────────────────
router.post('/pdf-to-jpg', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  const imagePaths = []
  let zipPath = null

  try {
    if (!req.file)
      return res.status(400).json({ error: 'Please upload a PDF file' })

    const { quality = 'high' } = req.body
    const dpi         = quality === 'low' ? 100 : quality === 'medium' ? 150 : 200
    const jpegQuality = quality === 'low' ? 70  : quality === 'medium' ? 85  : 95

    // Get page count first
    const pdfBytes = fs.readFileSync(inputPath)
    const pdfDoc   = await PDFDocument.load(pdfBytes)
    const numPages = pdfDoc.getPageCount()

    // ── Strategy 1: pdf2pic ──────────────────────────────────────────────────
    let rendered = false
    try {
      const { fromPath } = require('pdf2pic')
      const outputDir = path.join(__dirname, '../outputs')

      const converter = fromPath(inputPath, {
        density: dpi,
        saveFilename: `pdf2pic_${Date.now()}`,
        savePath: outputDir,
        format: 'jpg',
        width: 1240,
        height: 1754
      })

      for (let i = 1; i <= numPages; i++) {
        const result = await converter(i)
        if (result?.path && fs.existsSync(result.path)) {
          // Re-compress with sharp for better quality control
          const compressed = outputPath('.jpg')
          await sharp(result.path).jpeg({ quality: jpegQuality }).toFile(compressed)
          // Clean up the pdf2pic output
          try { fs.unlinkSync(result.path) } catch {}
          imagePaths.push({ path: compressed, name: `page_${i}.jpg` })
        }
      }

      if (imagePaths.length > 0) rendered = true
    } catch (pdf2picErr) {
      console.warn('pdf2pic not available:', pdf2picErr.message)
    }

    // ── Strategy 2: Ghostscript CLI ─────────────────────────────────────────
    if (!rendered) {
      try {
        const { execSync } = require('child_process')
        // Find Ghostscript on Windows (common install paths) or Unix
        const gsBins = process.platform === 'win32'
          ? ['gswin64c', 'gswin32c', 'gs']
          : ['gs']

        let gsBin = null
        for (const bin of gsBins) {
          try { execSync(`where ${bin}`, { stdio: 'ignore' }); gsBin = bin; break } catch {}
          try { execSync(`which ${bin}`, { stdio: 'ignore' }); gsBin = bin; break } catch {}
        }

        if (gsBin) {
          const outDir      = path.join(__dirname, '../outputs')
          const baseName    = `gs_${Date.now()}`
          const outTemplate = path.join(outDir, `${baseName}_%03d.jpg`)

          execSync(
            `"${gsBin}" -dNOPAUSE -dBATCH -sDEVICE=jpeg -r${dpi} -dJPEGQ=${jpegQuality} -sOutputFile="${outTemplate}" "${inputPath}"`,
            { timeout: 120000 }
          )

          const gsFiles = fs.readdirSync(outDir)
            .filter(f => f.startsWith(baseName))
            .sort()

          gsFiles.forEach((f, i) => {
            imagePaths.push({ path: path.join(outDir, f), name: `page_${i + 1}.jpg` })
          })

          if (imagePaths.length > 0) rendered = true
        }
      } catch (gsErr) {
        console.warn('Ghostscript not available:', gsErr.message)
      }
    }

    // ── Nothing worked ───────────────────────────────────────────────────────
    if (!rendered || imagePaths.length === 0) {
      return res.status(501).json({
        error: 'PDF to JPG requires the pdf2pic package.',
        fix: 'Run this in your backend folder then restart the server:',
        command: 'npm install pdf2pic',
        note: 'pdf2pic works on Windows, Mac and Linux with no extra installs needed.'
      })
    }

    // ── Single page → return JPG directly ───────────────────────────────────
    if (imagePaths.length === 1) {
      return res.json({
        success: true,
        downloadUrl: downloadUrl(req, imagePaths[0].path),
        filename: 'page_1.jpg',
        pageCount: 1
      })
    }

    // ── Multiple pages → ZIP ─────────────────────────────────────────────────
    zipPath = outputPath('.zip')
    await new Promise((resolve, reject) => {
      const out     = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 6 } })
      out.on('close', resolve)
      archive.on('error', reject)
      archive.pipe(out)
      imagePaths.forEach(({ path: p, name }) => archive.file(p, { name }))
      archive.finalize()
    })

    res.json({
      success: true,
      downloadUrl: downloadUrl(req, zipPath),
      filename: 'pdf_pages.zip',
      pageCount: imagePaths.length
    })

  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath, ...imagePaths.map(i => i.path))
  }
})

module.exports = router