import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { splitPDF } from '../utils/api'

export default function SplitPDF() {
  const [splitMode, setSplitMode] = useState('range')
  const [pageRange, setPageRange] = useState('')
  const [everyN, setEveryN]       = useState(1)

  return (
    <ToolPage
      title="Split PDF"
      description="Separate pages from a PDF into individual files"
      icon="✂️"
      color="#6366f1"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Split PDF"
      onProcess={(files) => splitPDF(files, { splitMode, pageRange, everyN })}
      options={
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Split mode</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ value:'range', label:'By Range' }, { value:'every', label:'Every N Pages' }, { value:'all', label:'All Pages' }].map(opt => (
                <button key={opt.value} onClick={() => setSplitMode(opt.value)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition ${
                    splitMode === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}>{opt.label}</button>
              ))}
            </div>
          </div>
          {splitMode === 'range' && (
            <div>
              <label className="text-sm text-slate-600 block mb-1">Page range (e.g. 1-3, 5, 7-9)</label>
              <input type="text" value={pageRange} onChange={e => setPageRange(e.target.value)}
                placeholder="1-3, 5, 7-9" className="input-field" />
            </div>
          )}
          {splitMode === 'every' && (
            <div>
              <label className="text-sm text-slate-600 block mb-1">Split every N pages</label>
              <input type="number" min={1} value={everyN} onChange={e => setEveryN(e.target.value)}
                className="input-field w-28" />
            </div>
          )}
        </div>
      }
    />
  )
}