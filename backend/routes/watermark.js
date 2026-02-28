const express = require('express')
const router = express.Router()
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return rgb(r, g, b)
}

router.post('/watermark', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const { text = 'CONFIDENTIAL', opacity = 30, fontSize = 48, color = '#E8302A', position = 'center' } = req.body

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)
    const opacityVal = parseFloat(opacity) / 100

    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize()
      const textWidth = font.widthOfTextAtSize(text, parseInt(fontSize))
      const textHeight = font.heightAtSize(parseInt(fontSize))

      let x = width / 2 - textWidth / 2
      let y = height / 2 - textHeight / 2

      if (position.includes('left')) x = 20
      if (position.includes('right')) x = width - textWidth - 20
      if (position.includes('top')) y = height - textHeight - 20
      if (position.includes('bottom')) y = 20

      page.drawText(text, {
        x, y,
        size: parseInt(fontSize),
        font,
        color: hexToRgb(color || '#E8302A'),
        opacity: opacityVal,
        rotate: position === 'center' ? degrees(45) : degrees(0),
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
