const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/merge', uploadPDF.array('files', 20), async (req, res, next) => {
  const inputPaths = req.files?.map(f => f.path) || []
  let outPath = null
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files' })
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of req.files) {
      const bytes = fs.readFileSync(file.path)
      const pdf = await PDFDocument.load(bytes)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach(p => mergedPdf.addPage(p))
    }

    const pdfBytes = await mergedPdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, pdfBytes)

    res.json(fileResponse(req, outPath, 'merged', '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(...inputPaths)
  }
})

module.exports = router
