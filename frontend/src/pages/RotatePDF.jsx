import { useState } from 'react'
import PreviewToolPage from '../components/PreviewtoolPage'
import { rotatePDF } from '../utils/api'

export default function RotatePDF() {
  const [rotation, setRotation] = useState('90')
  const [pages,    setPages]    = useState('all')

  return (
    <PreviewToolPage
      title="Rotate PDF"
      description="Rotate all or specific pages to the correct orientation"
      icon="🔄"
      color="#0891b2"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Rotate PDF"
      overlay={{ type: 'rotate', deg: Number(rotation) }}
      onProcess={(files) => rotatePDF(files, { rotation, pages })}
      options={
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Rotation angle</p>
            <div className="flex gap-2">
              {['90','180','270'].map(r => (
                <button key={r} onClick={() => setRotation(r)}
                  className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-sm transition ${
                    rotation === r ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>{r}°</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Apply to</p>
            <div className="flex flex-col gap-2">
              {[{ v:'all', l:'All Pages' }, { v:'odd', l:'Odd Pages' }, { v:'even', l:'Even Pages' }].map(p => (
                <button key={p.v} onClick={() => setPages(p.v)}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-left transition ${
                    pages === p.v ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>{p.l}</button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">Preview rotates live as you change angle</p>
        </div>
      }
    />
  )
}