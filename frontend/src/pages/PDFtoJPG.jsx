import ToolPage from '../components/ToolPage'
import { pdfToJpg } from '../utils/api'
import { useState } from 'react'

export default function PDFtoJPG() {
  const [quality, setQuality] = useState('high')
  return (
    <ToolPage
      title="PDF to JPG"
      description="Convert each PDF page to a JPG image"
      icon="🖼️"
      color="#7c3aed"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Convert to JPG"
      onProcess={(files) => pdfToJpg(files, { quality })}
      options={
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Image Quality</p>
          <div className="flex gap-2">
            {['low','medium','high'].map(q => (
              <button key={q} onClick={() => setQuality(q)}
                className={`px-4 py-2 rounded-lg border-2 text-sm capitalize transition ${quality === q ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
              >{q}</button>
            ))}
          </div>
        </div>
      }
    />
  )
}
