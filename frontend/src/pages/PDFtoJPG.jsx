import ToolPage from '../components/ToolPage'
import { pdfToJpg } from '../utils/api'
import { useState } from 'react'

export default function PDFtoJPG() {
  const [quality, setQuality] = useState('high')
  return (
    <ToolPage
      title="PDF to JPG"
      description="Convert each PDF page to a high-quality JPG image"
      icon="🖼️"
      color="#7c3aed"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Convert to JPG"
      onProcess={(files) => pdfToJpg(files, { quality })}
      options={
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Image Quality</p>
          <div className="flex gap-2">
            {['low','medium','high'].map(q => (
              <button key={q} onClick={() => setQuality(q)}
                className={`px-4 py-2 rounded-lg border text-sm capitalize transition ${
                  quality === q ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}>{q}</button>
            ))}
          </div>
        </div>
      }
    />
  )
}