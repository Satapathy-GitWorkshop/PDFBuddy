import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Download, RefreshCw, Loader,
  ChevronRight, Home, Clock, Shield, FileText
} from 'lucide-react'
import FileUploader from './FileUploader'
import toast from 'react-hot-toast'

// Step indicator
const STEPS = ['Upload', 'Configure', 'Download']

const formatSize = (bytes) => {
  if (!bytes) return null
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ToolPage({
  title,
  description,
  icon,
  color = '#6366f1',
  accept,
  multiple = false,
  options,
  onProcess,
  buttonLabel = 'Process File'
}) {
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Processing…')

  // Determine current step
  const currentStep = result ? 2 : files.length > 0 ? 1 : 0

  const handleProcess = async () => {
    if (!files.length) {
      toast.error('Please select at least one file')
      return
    }
    setLoading(true)
    setProgress(10)
    setProgressLabel('Uploading file…')

    const interval = setInterval(() => {
      setProgress(p => {
        if (p < 30) { setProgressLabel('Uploading file…');    return p + 8 }
        if (p < 60) { setProgressLabel('Processing…');        return p + 6 }
        if (p < 80) { setProgressLabel('Optimizing output…'); return p + 4 }
        return Math.min(p + 1, 88)
      })
    }, 400)

    try {
      const res = await onProcess(files)
      clearInterval(interval)
      setProgressLabel('Done!')
      setProgress(100)
      setResult(res)
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      const msg = err?.response?.data?.error || err?.response?.data?.fix || err.message || 'Something went wrong.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setProgressLabel('Processing…')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href     = result.downloadUrl
    link.download = result.filename
    link.target   = '_blank'
    link.rel      = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // File size info
  const inputSize  = files[0]?.size
  const outputSize = result?.fileSize
  const savedPct   = (inputSize && outputSize && outputSize < inputSize)
    ? Math.round((1 - outputSize / inputSize) * 100)
    : null

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top bar: Breadcrumb + Step Indicator ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link to="/" className="hover:text-indigo-600 transition flex items-center gap-1">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">{title}</span>
          </nav>

          {/* Steps */}
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <div className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
                  ${i === currentStep
                    ? 'bg-indigo-600 text-white'
                    : i < currentStep
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-400'
                  }
                `}>
                  {i < currentStep
                    ? <CheckCircle size={11} />
                    : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]"
                        style={{ borderColor: i === currentStep ? 'white' : 'currentColor' }}>
                        {i + 1}
                      </span>
                  }
                  {step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-4 h-px ${i < currentStep ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
              style={{ background: color + '12', borderColor: color + '25' }}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-display font-extrabold text-slate-900">{title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{description}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Main Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                {/* File Uploader */}
                <FileUploader
                  files={files}
                  setFiles={setFiles}
                  accept={accept}
                  multiple={multiple}
                />

                {/* Options panel */}
                <AnimatePresence>
                  {options && files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                          Options
                        </p>
                        {options}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="flex items-center gap-2 text-indigo-700 font-medium">
                            <Loader size={13} className="animate-spin" />
                            {progressLabel}
                          </span>
                          <span className="font-bold text-indigo-600">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-600 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action button */}
                <AnimatePresence>
                  {files.length > 0 && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5"
                    >
                      <button
                        onClick={handleProcess}
                        className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        {buttonLabel}
                        <ChevronRight size={15} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            ) : (
              /* ── Result Panel ── */
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8"
              >
                {/* Success header */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-11 h-11 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle size={22} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Processing complete</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Your file is ready to download.</p>
                  </div>
                </div>

                {/* File stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {/* Output filename */}
                  <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-lg border border-slate-200 p-3">
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <FileText size={11} /> Output file
                    </p>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {result.filename}
                    </p>
                  </div>

                  {/* Page count if available */}
                  {result.pageCount && (
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-400 mb-1">Pages</p>
                      <p className="text-sm font-semibold text-slate-800">{result.pageCount}</p>
                    </div>
                  )}

                  {/* Size saved (compress tool) */}
                  {savedPct !== null && (
                    <div className="bg-green-50 rounded-lg border border-green-200 p-3">
                      <p className="text-xs text-green-600 mb-1">Size reduced</p>
                      <p className="text-sm font-bold text-green-700">{savedPct}% smaller</p>
                    </div>
                  )}

                  {/* Auto delete notice */}
                  <div className="col-span-2 sm:col-span-3 bg-amber-50 rounded-lg border border-amber-100 p-3 flex items-center gap-2">
                    <Clock size={13} className="text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700">
                      This file will be automatically deleted from our servers in <strong>2 hours</strong>.
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download {result.filename}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 py-3 px-5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RefreshCw size={14} />
                    Process another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Security footer note ── */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Shield size={11} /> SSL encrypted upload
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> Files deleted after 2 hours
          </span>
          <span>·</span>
          <span>No account required</span>
        </div>
      </div>
    </div>
  )
}