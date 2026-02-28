import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'

export default function FileUploader({ files, setFiles, accept, multiple = false, maxSize = 100 }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (multiple) {
      setFiles(prev => [...prev, ...acceptedFiles])
    } else {
      setFiles(acceptedFiles.slice(0, 1))
    }
  }, [multiple, setFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: maxSize * 1024 * 1024
  })

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`upload-zone rounded-2xl p-12 text-center cursor-pointer bg-white ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
            <Upload size={28} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {isDragActive ? 'Drop files here...' : 'Click or drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Max file size: {maxSize}MB</p>
          </div>
          <button
            type="button"
            className="btn-primary px-8 py-3 text-sm"
          >
            Select Files
          </button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <File size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
