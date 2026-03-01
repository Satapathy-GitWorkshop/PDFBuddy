import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, FileImage, FileSpreadsheet, X, AlertCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PDFPreview from './PDFPreview'

const FileIcon = ({ name }) => {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return <FileImage size={16} className="text-violet-500" />
  if (['xls','xlsx','csv'].includes(ext))              return <FileSpreadsheet size={16} className="text-green-600" />
  return <FileText size={16} className="text-indigo-500" />
}

const formatSize = (bytes) => {
  if (bytes < 1024)        return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const isPDF = (file) => file?.type === 'application/pdf' || file?.name?.endsWith('.pdf')

export default function FileUploader({ files, setFiles, accept, multiple = false, maxSize = 100 }) {
  const onDrop = useCallback((accepted) => {
    if (multiple) setFiles(prev => [...prev, ...accepted])
    else          setFiles(accepted.slice(0, 1))
  }, [multiple, setFiles])

  // noClick:false always — replace button uses open() explicitly
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop, accept, multiple,
    maxSize: maxSize * 1024 * 1024,
    noClick: false,
  })

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const acceptedFormats = accept
    ? Object.values(accept).flat().join(', ').replace(/\./g, '').toUpperCase()
    : 'All files'

  const showLargePreview = !multiple && files.length === 1 && isPDF(files[0])

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">

        {/* ── Large PDF preview (single PDF mode) ── */}
        {showLargePreview ? (
          <motion.div key="preview"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            {/* Hidden input so replace still works */}
            <input {...getInputProps()} />

            <div className="relative">
              {/* X to remove */}
              <button
                onClick={() => removeFile(0)}
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
              >
                <X size={13} />
              </button>

              <PDFPreview file={files[0]} renderWidth={340} />

              {/* Replace button */}
              <button
                type="button"
                onClick={open}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/40 transition"
              >
                <RefreshCw size={11} /> Replace with a different file
              </button>
            </div>
          </motion.div>

        ) : (
          /* ── Drop zone ── */
          <motion.div key="dropzone"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer
                transition-all duration-200 select-none
                ${isDragReject  ? 'border-red-300 bg-red-50'
                  : isDragActive ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                  ${isDragActive ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
                  {isDragReject
                    ? <AlertCircle size={22} className="text-red-400" />
                    : <UploadCloud size={22} className={isDragActive ? 'text-indigo-600' : 'text-slate-400'} />}
                </div>
                <div>
                  {isDragReject ? (
                    <p className="text-sm font-semibold text-red-500">File type not supported</p>
                  ) : isDragActive ? (
                    <p className="text-sm font-semibold text-indigo-600">Release to upload</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-700">
                        Drag & drop your file{multiple ? 's' : ''} here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        or <span className="text-indigo-600 font-medium underline underline-offset-2">browse from your computer</span>
                      </p>
                    </>
                  )}
                </div>
                <span className="inline-block bg-white border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full">
                  {acceptedFormats} · Max {maxSize}MB
                </span>
              </div>
            </div>

            {/* Non-PDF / multiple file list */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 space-y-2"
                >
                  {files.map((file, i) => (
                    <motion.div key={`${file.name}-${i}`}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-slate-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                          <FileIcon name={file.name} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate max-w-[220px]">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                        className="ml-3 w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition shrink-0">
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                  {multiple && (
                    <p className="text-xs text-slate-400 text-center pt-1">
                      {files.length} file{files.length > 1 ? 's' : ''} selected · Drop more above to add
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}