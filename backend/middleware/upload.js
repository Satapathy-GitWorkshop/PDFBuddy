const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const UPLOADS_DIR = path.join(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  }
})

const fileFilter = (allowedExts) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowedExts.includes(ext)) cb(null, true)
  else cb(new Error(`Invalid file type. Allowed: ${allowedExts.join(', ')}`))
}

const maxSize = (parseInt(process.env.MAX_FILE_SIZE_MB) || 100) * 1024 * 1024

exports.uploadPDF = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(['.pdf'])
})

exports.uploadOffice = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'])
})

exports.uploadImages = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
})

exports.uploadAny = multer({
  storage,
  limits: { fileSize: maxSize }
})
