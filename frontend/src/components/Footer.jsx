import { Link } from 'react-router-dom'
import { FileText, Heart, Shield, Clock, Zap } from 'lucide-react'

const columns = [
  {
    heading: 'Organize',
    links: [
      { l: 'Merge PDF',    p: '/merge-pdf' },
      { l: 'Split PDF',    p: '/split-pdf' },
      { l: 'Compress PDF', p: '/compress-pdf' },
      { l: 'Rotate PDF',   p: '/rotate-pdf' },
      { l: 'Organize PDF', p: '/organize-pdf' },
      { l: 'Repair PDF',   p: '/repair-pdf' },
    ]
  },
  {
    heading: 'Convert to PDF',
    links: [
      { l: 'Word to PDF',  p: '/word-to-pdf' },
      { l: 'Excel to PDF', p: '/excel-to-pdf' },
      { l: 'PPT to PDF',   p: '/ppt-to-pdf' },
      { l: 'JPG to PDF',   p: '/jpg-to-pdf' },
      { l: 'HTML to PDF',  p: '/html-to-pdf' },
    ]
  },
  {
    heading: 'Convert from PDF',
    links: [
      { l: 'PDF to Word',  p: '/pdf-to-word' },
      { l: 'PDF to Excel', p: '/pdf-to-excel' },
      { l: 'PDF to PPT',   p: '/pdf-to-ppt' },
      { l: 'PDF to JPG',   p: '/pdf-to-jpg' },
    ]
  },
  {
    heading: 'Edit & Security',
    links: [
      { l: 'Watermark PDF', p: '/watermark-pdf' },
      { l: 'Sign PDF',      p: '/sign-pdf' },
      { l: 'Protect PDF',   p: '/protect-pdf' },
      { l: 'Unlock PDF',    p: '/unlock-pdf' },
      { l: 'Page Numbers',  p: '/page-numbers' },
      { l: 'Crop PDF',      p: '/crop-pdf' },
    ]
  }
]

const trustItems = [
  { icon: Shield, text: 'SSL encrypted transfers' },
  { icon: Clock,  text: 'Files deleted after 2 hours' },
  { icon: Zap,    text: 'No account required' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* ── Trust bar ── */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
          {trustItems.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 text-xs text-slate-500">
              <Icon size={13} className="text-indigo-500" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-white text-lg">
                PDF<span className="text-indigo-400">Buddy</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
              Professional PDF tools for everyone. Free, fast, and secure.
            </p>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.heading}>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.p}>
                    <Link
                      to={link.p}
                      className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

          <p className="text-slate-600">
            © {new Date().getFullYear()} PDFBuddy. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-slate-600">
            Designed &amp; built with
            <Heart size={11} className="text-indigo-500 fill-indigo-500 mx-0.5" />
            by{' '}
            <a
              href="https://github.com/satpathy98"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1"
            >
              Saurav Satpathy
            </a>
          </p>

        </div>
      </div>
    </footer>
  )
}