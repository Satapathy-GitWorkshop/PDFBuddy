const express = require('express')
const router = express.Router()
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

router.post('/page-numbers', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })
    const { position = 'bottom-center', format = '1', startNum = 1 } = req.body

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const pages = pdf.getPages()
    const total = pages.length

    pages.forEach((page, i) => {
      const { width, height } = page.getSize()
      const num = parseInt(startNum) + i
      let text = String(num)
      if (format === 'Page 1') text = `Page ${num}`
      if (format === '1/10') text = `${num}/${total}`

      const textWidth = font.widthOfTextAtSize(text, 11)

      let x = width / 2 - textWidth / 2
      let y = 20

      if (position.includes('top')) y = height - 30
      if (position.includes('left')) x = 20
      if (position.includes('right')) x = width - textWidth - 20

      page.drawText(text, { x, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
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
