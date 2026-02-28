import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { rotatePDF } from '../utils/api'

export default function RotatePDF() {
  const [rotation, setRotation] = useState('90')
  const [pages, setPages] = useState('all')

  return (
    <ToolPage
      title="Rotate PDF"
      description="Rotate PDF pages to the correct orientation"
      icon="🔄"
      color="#0891b2"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Rotate PDF"
      onProcess={(files) => rotatePDF(files, { rotation, pages })}
      options={
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Rotation:</p>
            <div className="flex gap-2">
              {['90', '180', '270'].map(r => (
                <button
                  key={r}
                  onClick={() => setRotation(r)}
                  className={`px-5 py-2 rounded-lg border-2 font-semibold text-sm transition ${
                    rotation === r ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {r}°
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Apply to:</p>
            <div className="flex gap-2">
              {[{ v: 'all', l: 'All Pages' }, { v: 'odd', l: 'Odd Pages' }, { v: 'even', l: 'Even Pages' }].map(p => (
                <button
                  key={p.v}
                  onClick={() => setPages(p.v)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm transition ${
                    pages === p.v ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  )
}
