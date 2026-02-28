import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Download, RefreshCw, Loader } from 'lucide-react'
import FileUploader from './FileUploader'
import toast from 'react-hot-toast'

export default function ToolPage({
  title,
  description,
  icon,
  color = '#6366f1',
  accept,
  multiple = false,
  options,
  onProcess,
  buttonLabel = 'Process'
}) {
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [progress, setProgress] = useState(0)

  const handleProcess = async () => {
    if (!files.length) {
      toast.error('Please select at least one file')
      return
    }
    setLoading(true)
    setProgress(10)
    const interval = setInterval(() => setProgress(p => Math.min(p + 14, 85)), 450)
    try {
      const res = await onProcess(files)
      clearInterval(interval)
      setProgress(100)
      setResult(res)
      toast.success('Done! Your file is ready to download.')
    } catch (err) {
      clearInterval(interval)
      toast.error(err?.response?.data?.error || err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
  }

  // ── Download handler: opens in new tab (fixes same-tab navigation bug) ──
  const handleDownload = (e) => {
    e.preventDefault()
    const link = document.createElement('a')
    link.href        = result.downloadUrl
    link.download    = result.filename
    link.target      = '_blank'
    link.rel         = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: color + '15', border: `1.5px solid ${color}25` }}
          >
            {icon}
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-2 text-sm">{description}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
        >
          {!result ? (
            <>
              <FileUploader
                files={files}
                setFiles={setFiles}
                accept={accept}
                multiple={multiple}
              />

              {/* Options panel — shown once file is selected */}
              {options && files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  {options}
                </motion.div>
              )}

              {/* Progress bar */}
              {loading && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Processing…</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Process button */}
              {files.length > 0 && !loading && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleProcess}
                  className="mt-6 w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  {buttonLabel}
                </motion.button>
              )}

              {loading && (
                <div className="mt-6 w-full bg-indigo-50 text-indigo-600 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
                  <Loader size={16} className="animate-spin" />
                  Processing your file…
                </div>
              )}
            </>
          ) : (
            /* ── Result panel ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Your file is ready!</h3>
              <p className="text-slate-400 text-xs mb-7">
                Files are automatically deleted after 2 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* ✅ Fixed: opens download in new tab, not same tab */}
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-sm"
                >
                  <Download size={16} />
                  Download {result.filename}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-3 px-6 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  <RefreshCw size={14} />
                  Process another
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-5">
          🔒 Processed securely · Files auto-deleted after 2 hours
        </p>
      </div>
    </div>
  )
}
