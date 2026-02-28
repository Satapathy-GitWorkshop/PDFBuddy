import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { splitPDF } from '../utils/api'

export default function SplitPDF() {
  const [splitMode, setSplitMode] = useState('range')
  const [pageRange, setPageRange] = useState('')
  const [everyN, setEveryN] = useState(1)

  return (
    <ToolPage
      title="Split PDF"
      description="Separate pages from a PDF into individual files"
      icon="✂️"
      color="#E8302A"
      accept={{ 'application/pdf': ['.pdf'] }}
      multiple={false}
      buttonLabel="Split PDF"
      onProcess={(files) => splitPDF(files, { splitMode, pageRange, everyN })}
      options={
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Split options:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'range', label: 'By Range' },
              { value: 'every', label: 'Every N Pages' },
              { value: 'all', label: 'All Pages' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSplitMode(opt.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                  splitMode === opt.value
                    ? 'bg-brand-red text-white border-brand-red'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {splitMode === 'range' && (
            <div>
              <label className="text-sm text-gray-600 block mb-1">Page range (e.g. 1-3, 5, 7-9)</label>
              <input
                type="text"
                value={pageRange}
                onChange={e => setPageRange(e.target.value)}
                placeholder="1-3, 5, 7-9"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
              />
            </div>
          )}
          {splitMode === 'every' && (
            <div>
              <label className="text-sm text-gray-600 block mb-1">Split every N pages</label>
              <input
                type="number"
                min={1}
                value={everyN}
                onChange={e => setEveryN(e.target.value)}
                className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
              />
            </div>
          )}
        </div>
      }
    />
  )
}
