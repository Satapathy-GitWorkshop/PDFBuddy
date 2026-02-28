require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const cron = require('node-cron')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 5000

// Ensure upload/output directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads')
const OUTPUTS_DIR = path.join(__dirname, 'outputs')
;[UPLOADS_DIR, OUTPUTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}))
app.use(morgan('dev'))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// Serve output files
app.use('/outputs', express.static(OUTPUTS_DIR))

// Routes
app.use('/api', require('./routes/merge'))
app.use('/api', require('./routes/split'))
app.use('/api', require('./routes/compress'))
app.use('/api', require('./routes/rotate'))
app.use('/api', require('./routes/watermark'))
app.use('/api', require('./routes/protect'))
app.use('/api', require('./routes/convert'))
app.use('/api', require('./routes/images'))
app.use('/api', require('./routes/repair'))
app.use('/api', require('./routes/sign'))
app.use('/api', require('./routes/ocr'))
app.use('/api', require('./routes/crop'))
app.use('/api', require('./routes/pagenumbers'))
app.use('/api', require('./routes/organize'))

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auto-cleanup: delete files older than 2 hours
cron.schedule('*/30 * * * *', () => {
  const now = Date.now()
  const maxAge = (parseInt(process.env.FILE_EXPIRY_HOURS) || 2) * 60 * 60 * 1000
  ;[UPLOADS_DIR, OUTPUTS_DIR].forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
      const fp = path.join(dir, file)
      try {
        const stat = fs.statSync(fp)
        if (now - stat.mtimeMs > maxAge) fs.unlinkSync(fp)
      } catch {}
    })
  })
  console.log('🗑️  Cleanup complete')
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  // Clean up any temp files
  if (req.files) req.files.forEach(f => { try { fs.unlinkSync(f.path) } catch {} })
  if (req.file) { try { fs.unlinkSync(req.file.path) } catch {} }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
