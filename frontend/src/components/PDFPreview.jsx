import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { FileText, Loader } from 'lucide-react'

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

let _pdfjs = null
async function loadPdfjs() {
  if (_pdfjs) return _pdfjs
  const mod = await import('pdfjs-dist/legacy/build/pdf.js')
  const lib = mod.default ?? mod
  lib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.js',
    import.meta.url
  ).toString()
  _pdfjs = lib
  return lib
}

async function renderPDFToCanvas(file, canvas, renderWidth) {
  const lib        = await loadPdfjs()
  const buffer     = await file.arrayBuffer()
  const typedArray = new Uint8Array(buffer)
  const pdf        = await lib.getDocument({
    data: typedArray, isEvalSupported: false, useSystemFonts: true,
  }).promise
  const page     = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 1 })
  const scale    = renderWidth / viewport.width
  const scaled   = page.getViewport({ scale })
  canvas.width  = Math.floor(scaled.width)
  canvas.height = Math.floor(scaled.height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvasContext: ctx, viewport: scaled }).promise
  return pdf.numPages
}

const PDFPreview = forwardRef(function PDFPreview({ file, renderWidth = 400, overlay = null }, ref) {
  const baseCanvasRef    = useRef(null)
  const overlayCanvasRef = useRef(null)
  const [status, setStatus]       = useState('idle')
  const [pageCount, setPageCount] = useState(null)

  useImperativeHandle(ref, () => ({
    getOverlayCanvas: () => overlayCanvasRef.current,
    getBaseCanvas:    () => baseCanvasRef.current,
    getPageCount:     () => pageCount,
  }))

  useEffect(() => {
    const canvas = baseCanvasRef.current
    if (!file || !canvas) return
    setStatus('loading')
    setPageCount(null)
    renderPDFToCanvas(file, canvas, renderWidth)
      .then(count => { setPageCount(count); setStatus('done') })
      .catch(err  => { console.error('[PDFPreview]', err.message); setStatus('error') })
  }, [file, renderWidth])

  useEffect(() => {
    const base = baseCanvasRef.current
    const ov   = overlayCanvasRef.current
    if (status !== 'done' || !base || !ov) return
    ov.width  = base.width
    ov.height = base.height
  }, [status])

  const minHeight  = Math.round(renderWidth * 1.414)
  const rotateDeg  = overlay?.type === 'rotate' ? overlay.deg : 0
  const showOverlay = overlay && overlay.type !== 'rotate' && overlay.type !== 'crop'

  // For crop: derive px values from mm (approximate for display)
  const cropStyle = overlay?.type === 'crop' ? {
    borderTop:    `${Math.round(overlay.top    * 1.5)}px solid rgba(99,102,241,0.5)`,
    borderRight:  `${Math.round(overlay.right  * 1.5)}px solid rgba(99,102,241,0.5)`,
    borderBottom: `${Math.round(overlay.bottom * 1.5)}px solid rgba(99,102,241,0.5)`,
    borderLeft:   `${Math.round(overlay.left   * 1.5)}px solid rgba(99,102,241,0.5)`,
  } : {}

  return (
    <div className="w-full">
      {/* Rotation wrapper */}
      <div
        style={{
          transform:       `rotate(${rotateDeg}deg)`,
          transition:      'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'center center',
        }}
      >
        <div
          className="relative w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md"
          style={{ minHeight }}
        >
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50">
              <Loader size={24} className="text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Generating preview…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50">
              <FileText size={32} className="text-slate-300" />
              <p className="text-xs text-slate-400">Preview unavailable</p>
            </div>
          )}

          {/* Base PDF canvas */}
          <canvas
            ref={baseCanvasRef}
            className="w-full h-auto block"
            style={{ display: status === 'done' ? 'block' : 'none' }}
          />

          {/* Canvas overlay — watermark / page numbers */}
          {status === 'done' && showOverlay && (
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}

          {/* Crop overlay — CSS borders */}
          {status === 'done' && overlay?.type === 'crop' && (
            <div className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={cropStyle} />
          )}
        </div>
      </div>

      {/* File info */}
      {status === 'done' && (
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center">
              <FileText size={13} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-400">
                {pageCount} page{pageCount !== 1 ? 's' : ''} · {formatSize(file.size)}
              </p>
            </div>
          </div>
          <span className="badge badge-indigo text-[10px]">PDF</span>
        </div>
      )}
    </div>
  )
})

export default PDFPreview