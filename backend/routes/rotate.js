const express = require('express')
const router = express.Router()
const { PDFDocument, degrees } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/rotate', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const { rotation = '90', pages = 'all' } = req.body
    const angle = parseInt(rotation)
    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const pageCount = pdf.getPageCount()

    const shouldRotate = (i) => {
      if (pages === 'all') return true
      if (pages === 'odd') return (i + 1) % 2 !== 0
      if (pages === 'even') return (i + 1) % 2 === 0
      return true
    }

    pdf.getPages().forEach((page, i) => {
      if (shouldRotate(i)) {
        const current = page.getRotation().angle
        page.setRotation(degrees((current + angle) % 360))
      }
    })

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
