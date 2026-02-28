const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const OUTPUTS_DIR = path.join(__dirname, '../outputs')

/**
 * Generate a unique output file path
 */
exports.outputPath = (ext) => {
  return path.join(OUTPUTS_DIR, `${uuidv4()}${ext}`)
}

/**
 * Build download URL for a file
 */
exports.downloadUrl = (req, filePath) => {
  const filename = path.basename(filePath)
  const baseUrl = `${req.protocol}://${req.get('host')}`
  return `${baseUrl}/outputs/${filename}`
}

/**
 * Build a response object for a processed file
 */
exports.fileResponse = (req, filePath, originalName, ext) => {
  return {
    success: true,
    downloadUrl: exports.downloadUrl(req, filePath),
    filename: `${path.basename(originalName, path.extname(originalName))}${ext}`
  }
}

/**
 * Safely delete temp files
 */
exports.cleanupFiles = (...filePaths) => {
  filePaths.forEach(fp => {
    if (fp && fs.existsSync(fp)) {
      try { fs.unlinkSync(fp) } catch {}
    }
  })
}
