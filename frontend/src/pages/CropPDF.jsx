import { useState, useRef } from 'react'
import PreviewToolPage from '../components/PreviewtoolPage'
import { cropPDF } from '../utils/api'

export default function CropPDF() {
  const [margins, setMargins]           = useState({ top:0, right:0, bottom:0, left:0 })
  const [debounced, setDebounced]       = useState(margins)
  const timerRef = useRef(null)

  const update = (side, val) => {
    const next = { ...margins, [side]: Math.max(0, Math.min(200, Number(val) || 0)) }
    setMargins(next)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebounced(next), 500)
  }

  return (
    <PreviewToolPage
      title="Crop PDF"
      description="Crop margins from PDF pages"
      icon="📐"
      color="#6366f1"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Crop PDF"
      overlay={{ type:'crop', ...debounced }}
      onProcess={(files) => cropPDF(files, margins)}
      options={
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700">Crop margins (mm)</p>
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-32">
                <label className="text-xs text-slate-400 block text-center mb-1">Top</label>
                <input type="number" min={0} max={200} value={margins.top}
                  onChange={e => update('top', e.target.value)} className="input-field text-center" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block text-center mb-1">Left</label>
                <input type="number" min={0} max={200} value={margins.left}
                  onChange={e => update('left', e.target.value)} className="input-field text-center" />
              </div>
              <div className="w-12 h-10 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <span className="text-indigo-300 text-[10px]">PDF</span>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-400 block text-center mb-1">Right</label>
                <input type="number" min={0} max={200} value={margins.right}
                  onChange={e => update('right', e.target.value)} className="input-field text-center" />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32">
                <label className="text-xs text-slate-400 block text-center mb-1">Bottom</label>
                <input type="number" min={0} max={200} value={margins.bottom}
                  onChange={e => update('bottom', e.target.value)} className="input-field text-center" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Quick presets</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { l:'Remove all', v:{ top:10, right:10, bottom:10, left:10 }},
                { l:'Top & Bottom', v:{ top:15, right:0, bottom:15, left:0 }},
                { l:'Left & Right', v:{ top:0, right:15, bottom:0, left:15 }},
              ].map(p => (
                <button key={p.l}
                  onClick={() => { setMargins(p.v); clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setDebounced(p.v), 500) }}
                  className="py-2 px-1 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition"
                >{p.l}</button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">Blue borders show crop area in preview</p>
        </div>
      }
    />
  )
}