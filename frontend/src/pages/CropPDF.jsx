import ToolPage from '../components/ToolPage'
import { cropPDF } from '../utils/api'
import { useState } from 'react'

export default function CropPDF() {
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 })
  const update = (side, val) => setMargins(m => ({ ...m, [side]: val }))

  return (
    <ToolPage
      title="Crop PDF"
      description="Crop margins from PDF pages"
      icon="✂️"
      color="#E8302A"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Crop PDF"
      onProcess={(files) => cropPDF(files, margins)}
      options={
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Crop margins (mm):</p>
          <div className="grid grid-cols-2 gap-3">
            {['top','right','bottom','left'].map(side => (
              <div key={side}>
                <label className="text-xs text-gray-500 capitalize block mb-1">{side}</label>
                <input type="number" min={0} max={100} value={margins[side]}
                  onChange={e => update(side, Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
