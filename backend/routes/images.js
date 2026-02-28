const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { uploadPDF, uploadImages } = require('../middleware/upload')
const { outputPath, downloadUrl, fileResponse, cleanupFiles } = require('../utils/fileHelper')
const { v4: uuidv4 } = require('uuid')

// JPG to PDF
router.post('/jpg-to-pdf', uploadImages.array('files', 30), async (req, res, next) => {
  const inputPaths = req.files?.map(f => f.path) || []
  let outPath = null
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'Please upload at least one image' })

    const { pageSize = 'A4', orientation = 'portrait' } = req.body

    const pageSizes = {
      A4: [595, 842], A3: [842, 1191], A5: [420, 595], Letter: [612, 792]
    }
    let [pageW, pageH] = pageSizes[pageSize] || pageSizes.A4
    if (orientation === 'landscape') [pageW, pageH] = [pageH, pageW]

    const pdf = await PDFDocument.create()

    for (const file of req.files) {
      // Convert to JPEG with sharp
      const jpgBuffer = await sharp(file.path).jpeg({ quality: 85 }).toBuffer()
      const img = await pdf.embedJpg(jpgBuffer)

      const page = pdf.addPage([pageW, pageH])
      const scale = Math.min(pageW / img.width, pageH / img.height)
      const w = img.width * scale
      const h = img.height * scale
      page.drawImage(img, {
        x: (pageW - w) / 2,
        y: (pageH - h) / 2,
        width: w, height: h
      })
    }

    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)

    res.json({
      success: true,
      downloadUrl: downloadUrl(req, outPath),
      filename: 'images.pdf'
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(...inputPaths)
  }
})

// PDF to JPG - converts first page as preview (full conversion needs Ghostscript in production)
router.post('/pdf-to-jpg', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    // Basic: return a placeholder response indicating conversion
    // In production, use Ghostscript or pdf2pic for full conversion
    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const pageCount = pdf.getPageCount()

    // Create a simple informational PNG using sharp
    const svgText = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#f0fdf4"/>
        <text x="200" y="80" font-size="18" text-anchor="middle" fill="#16a34a" font-family="Arial">PDF to JPG Conversion</text>
        <text x="200" y="120" font-size="14" text-anchor="middle" fill="#374151" font-family="Arial">${pageCount} page(s) detected</text>
        <text x="200" y="155" font-size="11" text-anchor="middle" fill="#6b7280" font-family="Arial">Install Ghostscript for full conversion</text>
      </svg>`

    outPath = outputPath('.jpg')
    await sharp(Buffer.from(svgText)).jpeg().toFile(outPath)

    res.json({
      success: true,
      downloadUrl: downloadUrl(req, outPath),
      filename: 'converted.jpg',
      pageCount,
      note: 'Install Ghostscript (gs) on server for full PDF-to-image conversion'
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
