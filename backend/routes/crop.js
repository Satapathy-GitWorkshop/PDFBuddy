const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

// 1mm = 2.83465 points
const mmToPt = mm => parseFloat(mm) * 2.83465

router.post('/crop', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const top = mmToPt(req.body.top || 0)
    const right = mmToPt(req.body.right || 0)
    const bottom = mmToPt(req.body.bottom || 0)
    const left = mmToPt(req.body.left || 0)

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)

    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize()
      page.setCropBox(left, bottom, width - left - right, height - top - bottom)
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
