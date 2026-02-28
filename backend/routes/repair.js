const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

// Repair PDF - reload and re-save (fixes minor corruption)
router.post('/repair', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false })
    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)

    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(new Error('Could not repair PDF. The file may be too damaged.'))
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
