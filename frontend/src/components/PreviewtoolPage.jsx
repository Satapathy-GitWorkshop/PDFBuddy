import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Download, RefreshCw, Loader, Trash2,
  ChevronRight, Home, Clock, Shield, FileText, UploadCloud
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import PDFPreview from './PDFPreview'
import toast from 'react-hot-toast'
import axios from 'axios'

const STEPS = ['Upload', 'Configure', 'Download']

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Inline mini dropzone used when no file selected yet
function DropZone({ onFile, accept, maxSize = 100 }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (files) => files[0] && onFile(files[0]),
    accept, multiple: false,
    maxSize: maxSize * 1024 * 1024,
  })
  const formats = accept
    ? Object.values(accept).flat().join(', ').replace(/\./g, '').toUpperCase()
    : 'All files'

  return (
    <div {...getRootProps()}
      className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 select-none
        ${isDragReject  ? 'border-red-300 bg-red-50'
          : isDragActive ? 'border-indigo-400 bg-indigo-50'
          : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors
          ${isDragActive ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
          <UploadCloud size={24} className={isDragActive ? 'text-indigo-600' : 'text-slate-400'} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Drag & drop your file here</p>
          <p className="text-xs text-slate-400 mt-1">or <span className="text-indigo-600 font-medium underline underline-offset-2">browse from your computer</span></p>
        </div>
        <span className="bg-white border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full">
          {formats} · Max {maxSize}MB
        </span>
      </div>
    </div>
  )
}

export default function PreviewToolPage({
  title, description, icon, color = '#6366f1',
  accept, options, onProcess,
  buttonLabel = 'Process File',
  overlay = null,
  previewRef: externalRef,
}) {
  const [file, setFile]                   = useState(null)
  const [loading, setLoading]             = useState(false)
  const [result, setResult]               = useState(null)
  const [progress, setProgress]           = useState(0)
  const [progressLabel, setProgressLabel] = useState('Processing…')
  const internalRef                       = useRef(null)
  const previewRef                        = externalRef ?? internalRef

  // Hidden file input for replace
  const replaceInputRef = useRef(null)

  const currentStep = result ? 2 : file ? 1 : 0

  const handleProcess = async () => {
    if (!file) { toast.error('Please select a file'); return }
    setLoading(true); setProgress(10); setProgressLabel('Uploading file…')
    const interval = setInterval(() => {
      setProgress(p => {
        if (p < 30) { setProgressLabel('Uploading file…');    return p + 8 }
        if (p < 60) { setProgressLabel('Processing…');        return p + 6 }
        if (p < 82) { setProgressLabel('Optimizing output…'); return p + 3 }
        return Math.min(p + 1, 88)
      })
    }, 400)
    try {
      const res = await onProcess([file])
      clearInterval(interval)
      setProgress(100); setResult(res)
    } catch (err) {
      clearInterval(interval)
      setProgress(0); setLoading(false)
      setFile(null)   // reset so user can pick another file
      toast.error(err?.response?.data?.error || err.message || 'Something went wrong.')
      return
    }
    setLoading(false)
  }

  const handleReset = () => { setFile(null); setResult(null); setProgress(0); setProgressLabel('Processing…') }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = result.downloadUrl; link.download = result.filename
    link.target = '_blank'; link.rel = 'noopener noreferrer'
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const handleDeleteNow = async () => {
    if (result?.deleteUrl) { try { await axios.delete(result.deleteUrl) } catch (_) {} }
    handleReset()
    toast.success('File deleted.')
  }

  const handleReplace = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
    e.target.value = ''
  }

  const inputSize  = file?.size
  const outputSize = result?.fileSize
  const savedPct   = (inputSize && outputSize && outputSize < inputSize)
    ? Math.round((1 - outputSize / inputSize) * 100) : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb + Steps */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link to="/" className="hover:text-indigo-600 transition flex items-center gap-1">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">{title}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
                  ${i === currentStep ? 'bg-indigo-600 text-white'
                    : i < currentStep  ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-slate-100 text-slate-400'}`}>
                  {i < currentStep
                    ? <CheckCircle size={11} />
                    : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]"
                        style={{ borderColor: i === currentStep ? 'white' : 'currentColor' }}>{i+1}</span>}
                  {step}
                </div>
                {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < currentStep ? 'bg-indigo-300' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border"
            style={{ background: color + '12', borderColor: color + '25' }}>{icon}</div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-slate-900">{title}</h1>
            <p className="text-slate-500 text-xs mt-0.5">{description}</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* Result panel */}
          {result && (
            <motion.div key="result"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-11 h-11 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle size={22} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Processing complete</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Your file is ready to download.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><FileText size={11} /> Output file</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{result.filename}</p>
                </div>
                {result.pageCount && (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                    <p className="text-xs text-slate-400 mb-1">Pages</p>
                    <p className="text-sm font-semibold text-slate-800">{result.pageCount}</p>
                  </div>
                )}
                {savedPct !== null && (
                  <div className="bg-green-50 rounded-lg border border-green-200 p-3">
                    <p className="text-xs text-green-600 mb-1">Size reduced</p>
                    <p className="text-sm font-bold text-green-700">{savedPct}% smaller</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-3 bg-amber-50 rounded-lg border border-amber-100 p-3 flex items-center gap-2">
                  <Clock size={13} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700">File auto-deleted in <strong>2 hours</strong>. Download now.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleDownload}
                  className="flex-1 btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2">
                  <Download size={16} /> Download {result.filename}
                </button>
                <button onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                  <RefreshCw size={14} /> Process another
                </button>
                <button onClick={handleDeleteNow}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-red-100 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition">
                  <Trash2 size={14} /> Delete now
                </button>
              </div>
            </motion.div>
          )}

          {/* Upload + Configure: split layout */}
          {!result && (
            <motion.div key="configure"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {!file ? (
                /* No file yet — centered dropzone */
                <div className="max-w-2xl">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <DropZone onFile={setFile} accept={accept} />
                  </div>
                </div>
              ) : (
                /* File selected — split layout */
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

                  {/* LEFT: Preview */}
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    {/* Hidden replace input */}
                    <input
                      ref={replaceInputRef}
                      type="file"
                      className="hidden"
                      accept={accept ? Object.values(accept).flat().join(',') : '*'}
                      onChange={handleReplace}
                    />
                    <PDFPreview ref={previewRef} file={file} renderWidth={440} overlay={overlay} />
                    {/* Replace link below preview */}
                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/40 transition"
                    >
                      <RefreshCw size={11} /> Replace with a different file
                    </button>
                  </motion.div>

                  {/* RIGHT: Options + process */}
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4">

                    {/* File info card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                        </div>
                        <button onClick={() => setFile(null)}
                          className="text-xs text-red-400 hover:text-red-600 transition shrink-0 ml-2">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Options panel */}
                    {options && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <p className="section-label mb-4">Options</p>
                        {options}
                      </div>
                    )}

                    {/* Progress */}
                    <AnimatePresence>
                      {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="flex items-center gap-2 text-indigo-700 font-medium">
                              <Loader size={12} className="animate-spin" /> {progressLabel}
                            </span>
                            <span className="font-bold text-indigo-600">{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-indigo-600 rounded-full"
                              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Process button */}
                    {!loading && (
                      <button onClick={handleProcess}
                        className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2">
                        {buttonLabel} <ChevronRight size={15} />
                      </button>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security note */}
        <div className="flex items-center justify-center gap-4 mt-8 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Shield size={11} /> SSL encrypted</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={11} /> Deleted after 2 hours</span>
          <span>·</span>
          <span>No account required</span>
        </div>
      </div>
    </div>
  )
}