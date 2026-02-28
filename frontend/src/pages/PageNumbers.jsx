import ToolPage from '../components/ToolPage'
import { pageNumbersPDF } from '../utils/api'
import { useState } from 'react'

export default function PageNumbers() {
  const [position, setPosition] = useState('bottom-center')
  const [format, setFormat] = useState('1')
  const [startNum, setStartNum] = useState(1)

  return (
    <ToolPage
      title="Page Numbers"
      description="Add page numbers to your PDF document"
      icon="#️⃣"
      color="#16a34a"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Add Page Numbers"
      onProcess={(files) => pageNumbersPDF(files, { position, format, startNum })}
      options={
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Format</label>
            <div className="flex gap-2">
              {[{ v: '1', l: '1, 2, 3' }, { v: 'Page 1', l: 'Page 1' }, { v: '1/10', l: '1/10' }].map(f => (
                <button key={f.v} onClick={() => setFormat(f.v)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm transition ${format === f.v ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
                >{f.l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Position</label>
            <div className="flex flex-wrap gap-2">
              {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(p => (
                <button key={p} onClick={() => setPosition(p)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition ${position === p ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
                >{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Start number</label>
            <input type="number" min={1} value={startNum} onChange={e => setStartNum(e.target.value)}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
          </div>
        </div>
      }
    />
  )
}
