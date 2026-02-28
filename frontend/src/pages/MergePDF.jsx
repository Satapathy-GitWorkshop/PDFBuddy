import { useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Download, CheckCircle, RefreshCw, Loader } from 'lucide-react'
import FileUploader from '../components/FileUploader'
import { mergePDF } from '../utils/api'
import toast from 'react-hot-toast'

export default function MergePDF() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)

  const moveFile = (from, to) => {
    const arr = [...files]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    setFiles(arr)
  }

  const handleMerge = async () => {
    if (files.length < 2) { toast.error('Please add at least 2 PDF files'); return }
    setLoading(true)
    setProgress(10)
    const interval = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 500)
    try {
      const res = await mergePDF(files)
      setProgress(100)
      setResult(res)
      toast.success('PDFs merged successfully!')
    } catch (e) {
      toast.error('Merge failed. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const reset = () => { setFiles([]); setResult(null); setProgress(0) }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔀</div>
          <h1 className="text-3xl font-display font-extrabold text-gray-900">Merge PDF</h1>
          <p className="text-gray-500 mt-2">Combine multiple PDF files into one document</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {!result ? (
            <>
              <FileUploader files={files} setFiles={setFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple />
              
              {files.length > 1 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-3">Drag to reorder files:</p>
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <GripVertical size={16} className="text-gray-400 cursor-grab" />
                        <span className="w-6 h-6 bg-red-100 text-red-600 text-xs rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                        <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
                        {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="text-xs text-gray-400 hover:text-gray-600">↑</button>}
                        {i < files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="text-xs text-gray-400 hover:text-gray-600">↓</button>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Merging PDFs...</span><span>{progress}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                </div>
              )}

              {files.length >= 2 && !loading && (
                <button onClick={handleMerge} className="mt-6 w-full btn-primary py-4">Merge PDFs</button>
              )}
              {loading && (
                <div className="mt-6 w-full bg-indigo-50 text-indigo-600 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold">
                  <Loader size={18} className="animate-spin" /> Merging your files...
                </div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Merge Complete!</h3>
              <p className="text-gray-500 text-sm mb-6">Your {files.length} PDFs have been merged into one file.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = result.downloadUrl
                    a.download = 'merged.pdf'
                    a.target = '_blank'
                    a.rel = 'noopener noreferrer'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }}
                  className="btn-primary flex items-center gap-2 py-3 px-8"
                >
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={reset} className="flex items-center gap-2 py-3 px-6 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                  <RefreshCw size={14} /> Merge again
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">🔒 Files deleted automatically after 2 hours</p>
      </div>
    </div>
  )
}
