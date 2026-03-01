import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { FileText, Loader } from 'lucide-react'

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Load pdfjs once — but do NOT cache the lib until workerSrc is confirmed set
let _pdfjsPromise = null
function loadPdfjs() {
  if (_pdfjsPromise) return _pdfjsPromise
  _pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.js').then(mod => {
    const lib = mod.default ?? mod
    lib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/legacy/build/pdf.worker.js',
      import.meta.url
    ).toString()
    return lib
  })
  return _pdfjsPromise
}

async function renderPDFToCanvas(file, canvas, renderWidth) {
  const lib        = await loadPdfjs()
  const buffer     = await file.arrayBuffer()
  const typedArray = new Uint8Array(buffer)

  const pdf  = await lib.getDocument({
    data: typedArray, isEvalSupported: false, useSystemFonts: true,
  }).promise

  const page = await pdf.getPage(1)

  // page.rotate is the PDF's stored rotation (0 / 90 / 180 / 270).
  // Must be passed to getViewport — pdfjs does NOT apply it automatically.
  // This is why the first render looked wrong: viewport was calculated
  // without rotation, so width/height were swapped or flipped.
  const rotation = page.rotate   // e.g. 180 for your PDF

  // Get viewport WITH rotation so dimensions are already corrected
  const baseViewport = page.getViewport({ scale: 1, rotation })
  const scale        = renderWidth / baseViewport.width
  const viewport     = page.getViewport({ scale, rotation })

  canvas.width  = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Render — must also use the rotated viewport here
  await page.render({ canvasContext: ctx, viewport }).promise

  return pdf.numPages
}

const PDFPreview = forwardRef(function PDFPreview(
  { file, renderWidth = 340, overlay = null },
  ref
) {
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

    // Reset to loading BEFORE the async work starts —
    // this clears any stale canvas content from a previous file
    setStatus('loading')
    setPageCount(null)

    // Clear the canvas immediately so old content doesn't flash
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    renderPDFToCanvas(file, canvas, renderWidth)
      .then(count => { setPageCount(count); setStatus('done') })
      .catch(err  => { console.error('[PDFPreview]', err.message); setStatus('error') })
  }, [file, renderWidth])

  // Sync overlay canvas size whenever base canvas renders
  useEffect(() => {
    const base = baseCanvasRef.current
    const ov   = overlayCanvasRef.current
    if (status !== 'done' || !base || !ov) return
    ov.width  = base.width
    ov.height = base.height
  }, [status])

  const rotateDeg   = overlay?.type === 'rotate' ? overlay.deg : 0
  const showOverlay = overlay && overlay.type !== 'rotate' && overlay.type !== 'crop'
  const cropBorder  = overlay?.type === 'crop' ? {
    borderTop:    `${Math.round((overlay.top    || 0) * 1.5)}px solid rgba(99,102,241,0.55)`,
    borderRight:  `${Math.round((overlay.right  || 0) * 1.5)}px solid rgba(99,102,241,0.55)`,
    borderBottom: `${Math.round((overlay.bottom || 0) * 1.5)}px solid rgba(99,102,241,0.55)`,
    borderLeft:   `${Math.round((overlay.left   || 0) * 1.5)}px solid rgba(99,102,241,0.55)`,
  } : {}

  return (
    <div className="w-full">
      <div style={{
        transform: `rotate(${rotateDeg}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transformOrigin: 'center center',
      }}>
        <div className="relative w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-3 bg-slate-50 py-20">
              <Loader size={22} className="text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400">Generating preview…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center gap-3 bg-slate-50 py-20">
              <FileText size={28} className="text-slate-300" />
              <p className="text-xs text-slate-400">Preview unavailable</p>
            </div>
          )}

          {/* Canvas — natural size, no CSS height forcing */}
          <canvas
            ref={baseCanvasRef}
            style={{
              display: status === 'done' ? 'block' : 'none',
              width: '100%',
              height: 'auto',
            }}
          />

          {status === 'done' && showOverlay && (
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
          )}

          {status === 'done' && overlay?.type === 'crop' && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={cropBorder}
            />
          )}
        </div>
      </div>

      {status === 'done' && (
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center">
              <FileText size={11} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">{file.name}</p>
              <p className="text-[10px] text-slate-400">
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