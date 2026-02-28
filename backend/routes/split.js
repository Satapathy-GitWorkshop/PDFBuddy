const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, downloadUrl, cleanupFiles } = require('../utils/fileHelper')

const parsePageRange = (rangeStr, totalPages) => {
  const pages = new Set()
  const parts = rangeStr.split(',').map(s => s.trim())
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= Math.min(end, totalPages); i++) pages.add(i - 1)
    } else {
      const n = parseInt(part)
      if (n >= 1 && n <= totalPages) pages.add(n - 1)
    }
  }
  return [...pages].sort((a, b) => a - b)
}

router.post('/split', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  const splitPaths = []
  let zipPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const { splitMode = 'all', pageRange = '', everyN = 1 } = req.body
    const bytes = fs.readFileSync(inputPath)
    const srcPdf = await PDFDocument.load(bytes)
    const totalPages = srcPdf.getPageCount()

    let chunks = [] // array of page index arrays

    if (splitMode === 'range' && pageRange) {
      chunks = [parsePageRange(pageRange, totalPages)]
    } else if (splitMode === 'every') {
      const n = parseInt(everyN) || 1
      for (let i = 0; i < totalPages; i += n) {
        chunks.push(Array.from({ length: Math.min(n, totalPages - i) }, (_, j) => i + j))
      }
    } else {
      // all pages individually
      chunks = Array.from({ length: totalPages }, (_, i) => [i])
    }

    for (const chunk of chunks) {
      const newPdf = await PDFDocument.create()
      const copied = await newPdf.copyPages(srcPdf, chunk)
      copied.forEach(p => newPdf.addPage(p))
      const outBytes = await newPdf.save()
      const sp = outputPath('.pdf')
      fs.writeFileSync(sp, outBytes)
      splitPaths.push(sp)
    }

    if (splitPaths.length === 1) {
      return res.json({
        success: true,
        downloadUrl: downloadUrl(req, splitPaths[0]),
        filename: 'split.pdf'
      })
    }

    // Zip multiple files
    zipPath = outputPath('.zip')
    await new Promise((resolve, reject) => {
      const out = fs.createWriteStream(zipPath)
      const archive = archiver('zip')
      out.on('close', resolve)
      archive.on('error', reject)
      archive.pipe(out)
      splitPaths.forEach((sp, i) => archive.file(sp, { name: `page_${i + 1}.pdf` }))
      archive.finalize()
    })

    res.json({
      success: true,
      downloadUrl: downloadUrl(req, zipPath),
      filename: 'split_pages.zip'
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath, ...splitPaths)
  }
})

module.exports = router
