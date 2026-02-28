import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { ocrPDF } from '../utils/api'

export default function OCR() {
  const [lang, setLang] = useState('eng')
  const langs = [{ v: 'eng', l: 'English' }, { v: 'fra', l: 'French' }, { v: 'deu', l: 'German' }, { v: 'spa', l: 'Spanish' }, { v: 'chi_sim', l: 'Chinese' }, { v: 'hin', l: 'Hindi' }]

  return (
    <ToolPage
      title="OCR PDF"
      description="Make scanned PDFs searchable and selectable"
      icon="🔍"
      color="#ea580c"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Run OCR"
      onProcess={(files) => ocrPDF(files, { lang })}
      options={
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Document Language</label>
          <div className="flex flex-wrap gap-2">
            {langs.map(l => (
              <button key={l.v} onClick={() => setLang(l.v)}
                className={`px-3 py-1.5 rounded-lg border-2 text-sm transition ${lang === l.v ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
              >{l.l}</button>
            ))}
          </div>
        </div>
      }
    />
  )
}
