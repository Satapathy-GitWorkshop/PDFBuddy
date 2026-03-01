import { useState, useEffect, useRef } from 'react'
import PreviewToolPage from '../components/PreviewtoolPage'
import { watermarkPDF } from '../utils/api'

const POSITIONS = ['top-left','top-center','top-right','center','bottom-left','bottom-center','bottom-right']

function drawWatermark(canvas, baseCanvas, { text, opacity, position, fontSize, color }) {
  if (!canvas || !baseCanvas) return
  const w = baseCanvas.width
  const h = baseCanvas.height
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  if (!text.trim()) return
  const scaled = Math.round(fontSize * (w / 600))
  ctx.font        = `bold ${scaled}px sans-serif`
  ctx.globalAlpha = opacity / 100
  ctx.fillStyle   = color
  const tw  = ctx.measureText(text).width
  const pad = 20
  const pos = {
    'top-left':      { x: pad,           y: scaled + pad },
    'top-center':    { x: (w-tw)/2,      y: scaled + pad },
    'top-right':     { x: w-tw-pad,      y: scaled + pad },
    'center':        { x: (w-tw)/2,      y: (h+scaled)/2 },
    'bottom-left':   { x: pad,           y: h - pad },
    'bottom-center': { x: (w-tw)/2,      y: h - pad },
    'bottom-right':  { x: w-tw-pad,      y: h - pad },
  }
  const { x, y } = pos[position] ?? pos['center']
  ctx.fillText(text, x, y)
}

export default function WatermarkPDF() {
  const [text,     setText]     = useState('CONFIDENTIAL')
  const [opacity,  setOpacity]  = useState(30)
  const [position, setPosition] = useState('center')
  const [fontSize, setFontSize] = useState(48)
  const [color,    setColor]    = useState('#6366f1')
  const previewRef = useRef(null)
  const timerRef   = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!previewRef.current) return
      const ov   = previewRef.current.getOverlayCanvas()
      const base = previewRef.current.getBaseCanvas()
      if (ov && base) drawWatermark(ov, base, { text, opacity, position, fontSize, color })
    }, 500)
    return () => clearTimeout(timerRef.current)
  }, [text, opacity, position, fontSize, color])

  return (
    <PreviewToolPage
      title="Watermark PDF"
      description="Stamp custom text over your PDF pages"
      icon="🏷️"
      color="#7c3aed"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Add Watermark"
      overlay={{ type: 'watermark' }}
      previewRef={previewRef}
      onProcess={(files) => watermarkPDF(files, { text, opacity, position, fontSize, color })}
      options={
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Watermark text</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)}
              className="input-field" placeholder="e.g. CONFIDENTIAL" />
          </div>
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
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="h-9 w-16 rounded-lg cursor-pointer border border-slate-200" />
              <span className="text-sm text-slate-500 font-mono">{color}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-1.5">
              {POSITIONS.map(p => (
                <button key={p} onClick={() => setPosition(p)} title={p}
                  className={`h-10 rounded-lg border text-xs font-medium transition ${
                    position === p ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}>
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