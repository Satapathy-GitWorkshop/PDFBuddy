import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { watermarkPDF } from '../utils/api'

export default function WatermarkPDF() {
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(30)
  const [position, setPosition] = useState('center')
  const [fontSize, setFontSize] = useState(48)
  const [color, setColor] = useState('#E8302A')

  const positions = ['top-left', 'top-center', 'top-right', 'center', 'bottom-left', 'bottom-center', 'bottom-right']

  return (
    <ToolPage
      title="Watermark PDF"
      description="Add a text watermark to your PDF pages"
      icon="🏷️"
      color="#7c3aed"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Add Watermark"
      onProcess={(files) => watermarkPDF(files, { text, opacity, position, fontSize, color })}
      options={
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Watermark Text</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Font Size: {fontSize}px</label>
              <input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Opacity: {opacity}%</label>
              <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(e.target.value)} className="w-full" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-20 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-1 w-36">
              {positions.map(p => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={`h-8 rounded text-xs transition ${
                    position === p ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={p}
                >
                  •
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  )
}
