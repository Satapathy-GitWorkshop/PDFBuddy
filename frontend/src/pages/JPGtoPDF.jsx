import ToolPage from '../components/ToolPage'
import { jpgToPdf } from '../utils/api'
import { useState } from 'react'

export default function JPGtoPDF() {
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  return (
    <ToolPage
      title="JPG to PDF"
      description="Convert JPG images to a PDF document"
      icon="📸"
      color="#7c3aed"
      accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
      multiple
      buttonLabel="Convert to PDF"
      onProcess={(files) => jpgToPdf(files, { pageSize, orientation })}
      options={
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Page Size</p>
            <div className="flex gap-2">
              {['A4','Letter','A3','A5'].map(s => (
                <button key={s} onClick={() => setPageSize(s)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm transition ${pageSize === s ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Orientation</p>
            <div className="flex gap-2">
              {['portrait','landscape'].map(o => (
                <button key={o} onClick={() => setOrientation(o)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm capitalize transition ${orientation === o ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
                >{o}</button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  )
}
