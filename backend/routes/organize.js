const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/organize', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    // pageOrder: comma-separated 1-based page indices e.g. "3,1,2,4"
    const { pageOrder = '', deletePages = '' } = req.body

    const bytes = fs.readFileSync(inputPath)
    const srcPdf = await PDFDocument.load(bytes)
    const total = srcPdf.getPageCount()

    const deletedSet = deletePages
      ? new Set(deletePages.split(',').map(n => parseInt(n) - 1))
      : new Set()

    let order = pageOrder
      ? pageOrder.split(',').map(n => parseInt(n) - 1)
      : Array.from({ length: total }, (_, i) => i)

    order = order.filter(i => i >= 0 && i < total && !deletedSet.has(i))

    const newPdf = await PDFDocument.create()
    const copied = await newPdf.copyPages(srcPdf, order)
    copied.forEach(p => newPdf.addPage(p))

    const outBytes = await newPdf.save()
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
