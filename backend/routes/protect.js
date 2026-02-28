const express = require('express')
const router = express.Router()
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const { uploadPDF } = require('../middleware/upload')
const { outputPath, fileResponse, cleanupFiles } = require('../utils/fileHelper')

// Protect PDF
router.post('/protect', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })
    const { password } = req.body
    if (!password) return res.status(400).json({ error: 'Password is required' })

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes)

    // pdf-lib encryption (basic)
    const outBytes = await pdf.save({
      userPassword: password,
      ownerPassword: password + '_owner',
      permissions: {
        printing: 'lowResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false
      }
    })

    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)
    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

// Unlock PDF
router.post('/unlock', uploadPDF.single('files'), async (req, res, next) => {
  const inputPath = req.file?.path
  let outPath = null
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' })
    const { password = '' } = req.body

    const bytes = fs.readFileSync(inputPath)
    const pdf = await PDFDocument.load(bytes, {
      password,
      ignoreEncryption: false
    })

    // Save without encryption
    const outBytes = await pdf.save()
    outPath = outputPath('.pdf')
    fs.writeFileSync(outPath, outBytes)
    res.json(fileResponse(req, outPath, req.file.originalname, '.pdf'))
  } catch (err) {
    if (err.message?.includes('password')) {
      return res.status(400).json({ error: 'Incorrect password' })
    }
    next(err)
  } finally {
    cleanupFiles(inputPath)
  }
})

module.exports = router
