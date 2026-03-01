import { useState, useEffect, useRef } from 'react'
import PreviewToolPage from '../components/Previewtoolpage'
import { cropPDF } from '../utils/api'

export default function CropPDF() {
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 })
  const [debouncedMargins, setDebouncedMargins] = useState(margins)
  const timerRef = useRef(null)

  const update = (side, val) => {
    const next = { ...margins, [side]: Math.max(0, Math.min(200, Number(val) || 0)) }
    setMargins(next)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedMargins(next), 500)
  }

  // Convert mm margins to px for the CSS overlay (approximate: 1mm ≈ 3.78px at 96dpi)
  // Since the preview canvas is scaled, we use percentage of container
  const mmToPct = (mm) => `${Math.min(mm * 0.15, 45)}%`

  const overlay = {
    type:   'crop',
    top:    debouncedMargins.top,
    right:  debouncedMargins.right,
    bottom: debouncedMargins.bottom,
    left:   debouncedMargins.left,
  }

  return (
    <PreviewToolPage
      title="Crop PDF"
      description="Crop the margins of PDF pages to remove white space or borders."
      icon="📐"
      color="#6366f1"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Crop PDF"
      overlay={overlay}
      onProcess={(files) => cropPDF(files, margins)}
      options={
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700">Crop margins (mm)</p>

          {/* Visual margin inputs arranged like CSS box model */}
          <div className="space-y-3">
            {/* Top */}
            <div className="flex justify-center">
              <div className="w-32">
                <label className="text-xs text-slate-400 block text-center mb-1">Top</label>
                <input type="number" min={0} max={200} value={margins.top}
                  onChange={e => update('top', e.target.value)}
                  className="input-field text-center" />
              </div>
            </div>

            {/* Left + Right */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block text-center mb-1">Left</label>
                <input type="number" min={0} max={200} value={margins.left}
                  onChange={e => update('left', e.target.value)}
                  className="input-field text-center" />
              </div>

              {/* Center indicator */}
              <div className="w-12 h-10 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <span className="text-indigo-300 text-xs">PDF</span>
              </div>

              <div className="flex-1">
                <label className="text-xs text-slate-400 block text-center mb-1">Right</label>
                <input type="number" min={0} max={200} value={margins.right}
                  onChange={e => update('right', e.target.value)}
                  className="input-field text-center" />
              </div>
            </div>

            {/* Bottom */}
            <div className="flex justify-center">
              <div className="w-32">
                <label className="text-xs text-slate-400 block text-center mb-1">Bottom</label>
                <input type="number" min={0} max={200} value={margins.bottom}
                  onChange={e => update('bottom', e.target.value)}
                  className="input-field text-center" />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Quick presets</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { l: 'Remove all', v: { top: 10, right: 10, bottom: 10, left: 10 } },
                { l: 'Top + Bottom', v: { top: 15, right: 0, bottom: 15, left: 0 } },
                { l: 'Left + Right', v: { top: 0, right: 15, bottom: 0, left: 15 } },
              ].map(preset => (
                <button key={preset.l}
                  onClick={() => {
                    setMargins(preset.v)
                    clearTimeout(timerRef.current)
                    timerRef.current = setTimeout(() => setDebouncedMargins(preset.v), 500)
                  }}
                  className="py-2 px-1 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition"
                >
                  {preset.l}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">Blue borders show crop area in preview</p>
        </div>
      }
    />
  )
}