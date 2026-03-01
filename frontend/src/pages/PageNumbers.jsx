import { useState, useEffect, useRef } from 'react'
import PreviewToolPage from '../components/PreviewtoolPage'
import { pageNumbersPDF } from '../utils/api'

const POSITIONS = ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right']

function drawPageNumber(canvas, baseCanvas, { position, format, startNum }) {
  if (!canvas || !baseCanvas) return
  const w = baseCanvas.width; const h = baseCanvas.height
  canvas.width = w; canvas.height = h
  const ctx  = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  const fs   = Math.round(14 * (w / 600))
  const text = format === '1/N' ? `${startNum} / ?` : format.replace('1', String(startNum))
  const pad  = 16
  ctx.font   = `600 ${fs}px sans-serif`
  const tw   = ctx.measureText(text).width
  const bx   = position.includes('left') ? pad : position.includes('right') ? w - tw - pad * 2 : (w - tw) / 2 - pad
  const by   = position.includes('top')  ? pad : h - fs - pad * 2
  ctx.globalAlpha = 0.1; ctx.fillStyle = '#000'
  ctx.beginPath(); ctx.roundRect(bx - 4, by - 2, tw + pad, fs + 8, 4); ctx.fill()
  ctx.globalAlpha = 0.85; ctx.fillStyle = '#1e293b'
  ctx.fillText(text, bx + pad / 2, by + fs)
}

export default function PageNumbers() {
  const [position, setPosition] = useState('bottom-center')
  const [format,   setFormat]   = useState('1')
  const [startNum, setStartNum] = useState(1)
  const previewRef = useRef(null)
  const timerRef   = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!previewRef.current) return
      const ov   = previewRef.current.getOverlayCanvas()
      const base = previewRef.current.getBaseCanvas()
      if (ov && base) drawPageNumber(ov, base, { position, format, startNum })
    }, 500)
    return () => clearTimeout(timerRef.current)
  }, [position, format, startNum])

  return (
    <PreviewToolPage
      title="Page Numbers"
      description="Add page numbers to your PDF document"
      icon="#️⃣"
      color="#16a34a"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Add Page Numbers"
      overlay={{ type: 'pagenum' }}
      previewRef={previewRef}
      onProcess={(files) => pageNumbersPDF(files, { position, format, startNum })}
      options={
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Number format</p>
            <div className="flex flex-col gap-2">
              {[{ v:'1', l:'1, 2, 3' }, { v:'Page 1', l:'Page 1, Page 2…' }, { v:'1/N', l:'1 / 10, 2 / 10…' }].map(f => (
                <button key={f.v} onClick={() => setFormat(f.v)}
                  className={`px-4 py-2.5 rounded-lg border text-sm text-left transition ${
                    format === f.v ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>{f.l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Start number</label>
            <input type="number" min={1} value={startNum}
              onChange={e => setStartNum(Number(e.target.value))} className="input-field w-28" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Position</p>
            <div className="grid grid-cols-3 gap-1.5">
              {POSITIONS.map(p => (
                <button key={p} onClick={() => setPosition(p)}
                  className={`py-2 px-1 rounded-lg border text-xs font-medium transition ${
                    position === p ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>{p.replace('-', ' ')}</button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">Preview updates 500ms after changes</p>
        </div>
      }
    />
  )
}