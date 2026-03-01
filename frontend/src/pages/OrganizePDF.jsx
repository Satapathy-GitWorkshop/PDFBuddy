import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { organizePDF } from '../utils/api'

const ROTATIONS  = [{ v: 'none', l: 'No rotation' }, { v: '90', l: '90° clockwise' }, { v: '180', l: '180°' }, { v: '270', l: '270° (90° CCW)' }]
const PAGE_APPLY = [{ v: 'all', l: 'All pages' }, { v: 'odd', l: 'Odd pages' }, { v: 'even', l: 'Even pages' }]
const BLANK_POS  = [{ v: 'none', l: 'None' }, { v: 'start', l: 'At the start' }, { v: 'end', l: 'At the end' }, { v: 'both', l: 'Both start & end' }]

export default function OrganizePDF() {
  const [rotation,      setRotation]      = useState('none')
  const [applyTo,       setApplyTo]       = useState('all')
  const [blankPage,     setBlankPage]     = useState('none')
  const [blankCount,    setBlankCount]    = useState(1)

  return (
    <ToolPage
      title="Organize PDF"
      description="Rotate pages and add blank pages to your PDF"
      icon="🗂️"
      color="#6366f1"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Apply Changes"
      onProcess={(files) => organizePDF(files, { rotation, applyTo, blankPage, blankCount })}
      options={
        <div className="space-y-6">

          {/* Rotation section */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Page Rotation</p>
            <div className="grid grid-cols-2 gap-2">
              {ROTATIONS.map(r => (
                <button key={r.v} onClick={() => setRotation(r.v)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition text-left ${
                    rotation === r.v
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}>
                  {rotation === r.v ? '✓ ' : ''}{r.l}
                </button>
              ))}
            </div>
          </div>

          {/* Apply rotation to which pages */}
          {rotation !== 'none' && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Apply rotation to</p>
              <div className="flex flex-col gap-2">
                {PAGE_APPLY.map(p => (
                  <button key={p.v} onClick={() => setApplyTo(p.v)}
                    className={`py-2.5 px-4 rounded-lg border text-sm text-left transition ${
                      applyTo === p.v
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}>
                    {p.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Blank pages section */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Add Blank Pages</p>
            <p className="text-xs text-slate-400 mb-3">Insert blank pages at the start or end of your PDF</p>
            <div className="grid grid-cols-2 gap-2">
              {BLANK_POS.map(b => (
                <button key={b.v} onClick={() => setBlankPage(b.v)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition text-left ${
                    blankPage === b.v
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}>
                  {blankPage === b.v ? '✓ ' : ''}{b.l}
                </button>
              ))}
            </div>
          </div>

          {/* How many blank pages */}
          {blankPage !== 'none' && (
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Number of blank pages to add
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBlankCount(c => Math.max(1, c - 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 flex items-center justify-center text-lg font-medium transition"
                >−</button>
                <span className="text-lg font-bold text-slate-800 w-8 text-center">{blankCount}</span>
                <button
                  onClick={() => setBlankCount(c => Math.min(10, c + 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 flex items-center justify-center text-lg font-medium transition"
                >+</button>
                <span className="text-xs text-slate-400">page{blankCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}

          {/* Summary of what will happen */}
          {(rotation !== 'none' || blankPage !== 'none') && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-700 mb-1.5">Summary of changes</p>
              <ul className="space-y-1">
                {rotation !== 'none' && (
                  <li className="text-xs text-indigo-600">
                    • Rotate {applyTo} pages by {rotation}°
                  </li>
                )}
                {blankPage !== 'none' && (
                  <li className="text-xs text-indigo-600">
                    • Add {blankCount} blank page{blankCount !== 1 ? 's' : ''} {
                      blankPage === 'both' ? 'at start and end'
                      : blankPage === 'start' ? 'at the start'
                      : 'at the end'
                    }
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      }
    />
  )
}