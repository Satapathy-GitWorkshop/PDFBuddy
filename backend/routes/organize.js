const express      = require('express')
const router       = express.Router()
const { PDFDocument, degrees } = require('pdf-lib')
const fs           = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/organize', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    // rotation: '90' | '180' | '270' | 'none'
    // applyTo:  'all' | 'odd' | 'even'
    // blankPage: 'none' | 'start' | 'end' | 'both'
    // blankCount: number
    const {
      rotation   = 'none',
      applyTo    = 'all',
      blankPage  = 'none',
      blankCount = '1',
    } = req.body

    const bytes  = fs.readFileSync(inputPath)
    const srcPdf = await PDFDocument.load(bytes)
    const total  = srcPdf.getPageCount()

    // Apply rotation
    if (rotation !== 'none') {
      const deg = parseInt(rotation)
      for (let i = 0; i < total; i++) {
        const isOdd  = (i + 1) % 2 !== 0
        const isEven = (i + 1) % 2 === 0
        const shouldRotate =
          applyTo === 'all' ||
          (applyTo === 'odd'  && isOdd) ||
          (applyTo === 'even' && isEven)

        if (shouldRotate) {
          const page    = srcPdf.getPage(i)
          const current = page.getRotation().angle
          page.setRotation(degrees((current + deg) % 360))
        }
      }
    }

    // Add blank pages
    const count = Math.max(1, Math.min(10, parseInt(blankCount) || 1))
    if (blankPage !== 'none') {
      // Get dimensions of first page for blank page size
      const firstPage = srcPdf.getPage(0)
      const { width, height } = firstPage.getSize()

      if (blankPage === 'start' || blankPage === 'both') {
        for (let i = 0; i < count; i++) {
          srcPdf.insertPage(0).setSize(width, height)
        }
      }
      if (blankPage === 'end' || blankPage === 'both') {
        for (let i = 0; i < count; i++) {
          srcPdf.addPage().setSize(width, height)
        }
      }
    }

    const outBytes = await srcPdf.save()
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