import { useState, useEffect, useRef, useCallback } from 'react'
import PreviewToolPage from '../components/Previewtoolpage'
import { watermarkPDF } from '../utils/api'

const POSITIONS = ['top-left','top-center','top-right','center','bottom-left','bottom-center','bottom-right']

// Draw watermark onto the overlay canvas
function drawWatermark(canvas, baseCanvas, { text, opacity, position, fontSize, color }) {
  if (!canvas || !baseCanvas || !text.trim()) {
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    return
  }
  const w   = baseCanvas.width
  const h   = baseCanvas.height
  canvas.width  = w
  canvas.height = h

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)

  const scaledFont = Math.round(fontSize * (w / 600))
  ctx.font         = `bold ${scaledFont}px sans-serif`
  ctx.globalAlpha  = opacity / 100
  ctx.fillStyle    = color

  // Measure text
  const metrics   = ctx.measureText(text)
  const textW     = metrics.width
  const textH     = scaledFont

  // Position map
  const pad = 20
  const positions = {
    'top-left':       { x: pad,           y: textH + pad },
    'top-center':     { x: (w - textW)/2, y: textH + pad },
    'top-right':      { x: w - textW - pad, y: textH + pad },
    'center':         { x: (w - textW)/2,   y: (h + textH)/2 },
    'bottom-left':    { x: pad,             y: h - pad },
    'bottom-center':  { x: (w - textW)/2,   y: h - pad },
    'bottom-right':   { x: w - textW - pad, y: h - pad },
  }
  const { x, y } = positions[position] ?? positions['center']
  ctx.fillText(text, x, y)
}

// Hook: debounced overlay drawing
function useWatermarkOverlay(previewRef, options, delay = 500) {
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!previewRef.current) return
      const overlay = previewRef.current.getOverlayCanvas()
      const base    = previewRef.current.getBaseCanvas()
      if (overlay && base) drawWatermark(overlay, base, options)
    }, delay)
    return () => clearTimeout(timerRef.current)
  }, [options.text, options.opacity, options.position, options.fontSize, options.color])
}

export default function WatermarkPDF() {
  const [text,     setText]     = useState('CONFIDENTIAL')
  const [opacity,  setOpacity]  = useState(30)
  const [position, setPosition] = useState('center')
  const [fontSize, setFontSize] = useState(48)
  const [color,    setColor]    = useState('#6366f1')
  const [files,    setFiles]    = useState([])
  const previewRef              = useRef(null)

  useWatermarkOverlay(previewRef, { text, opacity, position, fontSize, color })

  // Custom wrapper so we can pass ref to PDFPreview inside PreviewToolPage
  // We use overlay={type:'watermark'} as a signal to show the overlay canvas
  const overlay = { type: 'watermark' }

  return (
    <PreviewToolPage
      title="Watermark PDF"
      description="Stamp custom text over your PDF with full control over style and opacity."
      icon="🏷️"
      color="#7c3aed"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Add Watermark"
      overlay={overlay}
      previewRef={previewRef}
      onProcess={(files) => watermarkPDF(files, { text, opacity, position, fontSize, color })}
      options={
        <div className="space-y-4">
          {/* Text */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Watermark text</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="input-field"
              placeholder="e.g. CONFIDENTIAL"
            />
          </div>

          {/* Font size + Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Font size <span className="font-normal text-slate-400">{fontSize}px</span>
              </label>
              <input type="range" min={12} max={120} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Opacity <span className="font-normal text-slate-400">{opacity}%</span>
              </label>
              <input type="range" min={5} max={100} value={opacity}
                onChange={e => setOpacity(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="h-9 w-16 rounded-lg cursor-pointer border border-slate-200" />
              <span className="text-sm text-slate-500 font-mono">{color}</span>
            </div>
          </div>

          {/* Position grid */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {POSITIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  title={p}
                  className={`h-10 rounded-lg border text-xs font-medium transition ${
                    position === p
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {p.split('-').map(w => w[0].toUpperCase()).join('')}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">Preview updates 500ms after changes</p>
        </div>
      }
    />
  )
}