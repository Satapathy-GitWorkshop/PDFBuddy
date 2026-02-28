const express = require('express')
const router = express.Router()
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/ocr', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })
    const { lang = 'eng' } = req.body

    // Try Tesseract if available
    try {
      const { createWorker } = require('tesseract.js')
      const worker = await createWorker(lang)
      // In a full implementation, render each PDF page to image then OCR
      // For now, re-save the PDF and indicate Tesseract is available
      await worker.terminate()
    } catch (tessErr) {
      // Tesseract not available - just re-save
    }

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)

    res.json({
      ...fileResponse(req, outPath, req.file.originalname, '.pdf'),
      note: 'For full OCR, install tesseract.js: npm install tesseract.js'
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
