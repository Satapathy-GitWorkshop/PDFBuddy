const express = require('express')
const router = express.Router()
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/sign', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const { signMode = 'type', signature = 'Signature' } = req.body

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const pages = pdf.getPages()
    const lastPage = pages[pages.length - 1]
    const { width } = lastPage.getSize()

    if (signMode === 'draw' && signature.startsWith('data:image')) {
      // Embed image signature
      const base64Data = signature.replace(/^data:image\/\w+;base64,/, '')
      const imgBytes = Buffer.from(base64Data, 'base64')
      const img = await pdf.embedPng(imgBytes).catch(() => pdf.embedJpg(imgBytes))
      lastPage.drawImage(img, { x: 40, y: 40, width: 150, height: 50 })
    } else {
      // Text signature
      const font = await pdf.embedFont(StandardFonts.TimesRomanItalic)
      lastPage.drawText(signature || 'Signed', {
        x: 40, y: 40,
        size: 24,
        font,
        color: rgb(0.1, 0.1, 0.6)
      })
    }

    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)

    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
