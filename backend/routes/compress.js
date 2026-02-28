const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/compress', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })

    // Basic compression via pdf-lib (re-serialization removes redundant data)
    const compressedBytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false })
    
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, compressedBytes)

    const originalSize = bytes.length
    const compressedSize = compressedBytes.length
    const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)

    res.json({
      ...fileResponse(req, outPath, req.file.originalname, '.pdf'),
      originalSize,
      compressedSize,
      reduction: `${reduction}%`
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
