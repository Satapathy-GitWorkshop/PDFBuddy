const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const mammoth = require('mammoth')
const fs = require('fs')
const path = require('path')
const { execSync, exec } = require('child_process')
const { uploadOffice, uploadPDF } = require('../middleware/upload')
const { outputPath, downloadUrl, fileResponse, cleanupFiles } = require('../utils/fileHelper')

// ─── Helpers ────────────────────────────────────────────────────────────────

// Check if LibreOffice is installed (Windows + Mac + Linux)
const hasLibreOffice = () => {
  try {
    // Windows path check
    if (process.platform === 'win32') {
      execSync('where soffice', { stdio: 'ignore' })
    } else {
      execSync('which libreoffice || which soffice', { stdio: 'ignore' })
    }
    return true
  } catch {
    return false
  }
}

// Run LibreOffice conversion
const convertWithLibreOffice = (inputPath, outputDir, format = 'pdf') => {
  return new Promise((resolve, reject) => {
    const bin = process.platform === 'win32' ? 'soffice' : 'libreoffice'
    const cmd = `${bin} --headless --convert-to ${format} --outdir "${outputDir}" "${inputPath}"`
    exec(cmd, { timeout: 60000 }, (err) => {
      if (err) reject(new Error('LibreOffice conversion failed.'))
      else resolve()
    })
  })
}

// Build a real .docx file from plain text lines using the docx package
const buildDocx = async (lines, title = 'Converted Document') => {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType
  } = require('docx')

  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    ...lines
      .filter(l => l.trim())
      .map(line =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
          spacing: { after: 120 }
        })
      )
  ]

  const doc = new Document({
    sections: [{ properties: {}, children }]
  })

  return await Packer.toBuffer(doc)
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// ✅ PDF to Word — produces a real .docx file
router.post('/pdf-to-word', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    const outputDir = path.join(__dirname, '../outputs')

    // Option 1: LibreOffice (best quality)
    if (hasLibreOffice()) {
      await convertWithLibreOffice(inputPath, outputDir, 'docx')
      const convertedName = path.basename(inputPath, path.extname(inputPath)) + '.docx'
      outPath = path.join(outputDir, convertedName)
    }
    // Option 2: pdf-parse + docx package (good fallback — real .docx!)
    else {
      let lines = []
      try {
        const pdfParse = require('pdf-parse')
        const dataBuffer = fs.readFileSync(inputPath)
        const data = await pdfParse(dataBuffer)
        lines = data.text.split('\n').filter(l => l.trim()).slice(0, 500)
      } catch {
        // pdf-parse not installed — use pdf-lib basic info
        const bytes = fs.readFileSync(inputPath)
        const pdf = await PDFDocument.load(bytes)
        lines = [
          `File: ${req.file.originalname}`,
          `Pages: ${pdf.getPageCount()}`,
          '',
          'Note: Install pdf-parse for full text extraction:',
          'npm install pdf-parse'
        ]
      }

      const docxBuffer = await buildDocx(
        lines,
        path.basename(req.file.originalname, '.pdf')
      )
      outPath = outputPath('.docx')
      fs.writeFileSync(outPath, docxBuffer)
    }

    res.json(fileResponse(req, outPath, req.file.originalname, '.docx'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ Word to PDF
router.post('/word-to-pdf', uploadOffice.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a Word file' })

    const outputDir = path.join(__dirname, '../outputs')

    if (hasLibreOffice()) {
      await convertWithLibreOffice(inputPath, outputDir, 'pdf')
      const convertedName = path.basename(inputPath, path.extname(inputPath)) + '.pdf'
      outPath = path.join(outputDir, convertedName)
    } else {
      // Fallback: extract text with mammoth, build basic PDF
      const result = await mammoth.extractRawText({ path: inputPath })
      const { StandardFonts } = require('pdf-lib')
      const pdf = await PDFDocument.create()
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const lines = result.value.split('\n').filter(Boolean)

      let page = pdf.addPage()
      let y = page.getHeight() - 50
      const lineHeight = 16
      const margin = 50
      const maxWidth = page.getWidth() - margin * 2

      for (const line of lines) {
        if (y < margin) {
          page = pdf.addPage()
          y = page.getHeight() - 50
        }
        const truncated = line.length > 95 ? line.substring(0, 95) + '...' : line
        page.drawText(truncated, { x: margin, y, size: 11, font })
        y -= lineHeight
      }

      const outBytes = await pdf.save()
      outPath = outputPath('.pdf')
      fs.writeFileSync(outPath, outBytes)
    }

    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ Excel to PDF
router.post('/excel-to-pdf', uploadOffice.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload an Excel file' })
    if (!hasLibreOffice()) {
      return res.status(501).json({
        error: 'LibreOffice is required for Excel to PDF conversion.',
        install: 'https://www.libreoffice.org/download/'
      })
    }

    const outputDir = path.join(__dirname, '../outputs')
    await convertWithLibreOffice(inputPath, outputDir, 'pdf')
    const outPath = path.join(outputDir, path.basename(inputPath, path.extname(inputPath)) + '.pdf')

    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ PDF to Excel — produces .xlsx using exceljs if available, else .csv
router.post('/pdf-to-excel', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })

    if (hasLibreOffice()) {
      const outputDir = path.join(__dirname, '../outputs')
      await convertWithLibreOffice(inputPath, outputDir, 'xlsx')
      outPath = path.join(outputDir, path.basename(inputPath, '.pdf') + '.xlsx')
      return res.json(fileResponse(req, outPath, req.file.originalname, '.xlsx'))
    }

    // Fallback: extract text rows → CSV (opens in Excel)
    let rows = [['Content extracted from PDF'], ['']]
    try {
      const pdfParse = require('pdf-parse')
      const data = await pdfParse(fs.readFileSync(inputPath))
      const lines = data.text.split('\n').filter(l => l.trim()).slice(0, 200)
      rows = lines.map(l => [l.replace(/,/g, ' ')])
    } catch {
      const bytes = fs.readFileSync(inputPath)
      const pdf = await PDFDocument.load(bytes)
      rows = [
        ['Filename', 'Pages'],
        [req.file.originalname, pdf.getPageCount()],
        [''],
        ['Note: Install pdf-parse for full text extraction: npm install pdf-parse']
      ]
    }

    const csvContent = rows.map(r => r.join(',')).join('\n')
    outPath = outputPath('.csv')
    fs.writeFileSync(outPath, csvContent)

    res.json({
      ...fileResponse(req, outPath, req.file.originalname, '.csv'),
      note: 'CSV format — opens directly in Excel. Install LibreOffice for .xlsx output.'
    })
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ PPT to PDF
router.post('/ppt-to-pdf', uploadOffice.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PowerPoint file' })
    if (!hasLibreOffice()) {
      return res.status(501).json({
        error: 'LibreOffice is required for PowerPoint to PDF conversion.',
        install: 'https://www.libreoffice.org/download/'
      })
    }

    const outputDir = path.join(__dirname, '../outputs')
    await convertWithLibreOffice(inputPath, outputDir, 'pdf')
    const outPath = path.join(outputDir, path.basename(inputPath, path.extname(inputPath)) + '.pdf')

    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ PDF to PPT
router.post('/pdf-to-ppt', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })
    if (!hasLibreOffice()) {
      return res.status(501).json({
        error: 'LibreOffice is required for PDF to PowerPoint conversion.',
        install: 'https://www.libreoffice.org/download/'
      })
    }

    const outputDir = path.join(__dirname, '../outputs')
    await convertWithLibreOffice(inputPath, outputDir, 'pptx')
    const outPath = path.join(outputDir, path.basename(inputPath, '.pdf') + '.pptx')

    res.json(fileResponse(req, outPath, req.file.originalname, '.pptx'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// ✅ HTML to PDF
router.post('/html-to-pdf', async (req, res, next) => {
  try {
    const { url } = req.body
    if (!url) return res.status(400).json({ error: 'Please provide a URL' })

    try {
      const puppeteer = require('puppeteer')
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
      const outPath = outputPath('.pdf')
      await page.pdf({ path: outPath, format: 'A4', printBackground: true })
      await browser.close()
      return res.json({
        success: true,
        downloadUrl: downloadUrl(req, outPath),
        filename: 'webpage.pdf'
      })
    } catch {
      return res.status(501).json({
        error: 'Puppeteer is required for HTML to PDF.',
        install: 'Run: npm install puppeteer in the backend folder'
      })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
