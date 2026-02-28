import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { compressPDF } from '../utils/api'

export default function CompressPDF() {
  const [quality, setQuality] = useState('medium')

  const levels = [
    { value: 'low', label: 'Extreme', desc: 'Smallest size', color: '#E8302A' },
    { value: 'medium', label: 'Recommended', desc: 'Good balance', color: '#16a34a' },
    { value: 'high', label: 'Less compression', desc: 'Better quality', color: '#2563eb' },
  ]

  return (
    <ToolPage
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      icon="🗜️"
      color="#16a34a"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Compress PDF"
      onProcess={(files) => compressPDF(files, { quality })}
      options={
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Compression level:</p>
          <div className="grid grid-cols-3 gap-3">
            {levels.map(l => (
              <button
                key={l.value}
                onClick={() => setQuality(l.value)}
                className={`p-3 rounded-xl border-2 text-left transition ${
                  quality === l.value ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm text-gray-900">{l.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>
      }
    />
  )
}
