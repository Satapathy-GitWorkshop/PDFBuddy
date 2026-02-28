import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, FileText } from 'lucide-react'

const tools = [
  { label: 'Merge PDF',       path: '/merge-pdf' },
  { label: 'Split PDF',       path: '/split-pdf' },
  { label: 'Compress PDF',    path: '/compress-pdf' },
  { label: 'PDF to Word',     path: '/pdf-to-word' },
  { label: 'PDF to JPG',      path: '/pdf-to-jpg' },
  { label: 'JPG to PDF',      path: '/jpg-to-pdf' },
  { label: 'Word to PDF',     path: '/word-to-pdf' },
  { label: 'Rotate PDF',      path: '/rotate-pdf' },
  { label: 'Watermark PDF',   path: '/watermark-pdf' },
  { label: 'Protect PDF',     path: '/protect-pdf' },
  { label: 'Unlock PDF',      path: '/unlock-pdf' },
  { label: 'Sign PDF',        path: '/sign-pdf' },
  { label: 'OCR PDF',         path: '/ocr-pdf' },
  { label: 'Organize PDF',    path: '/organize-pdf' },
  { label: 'Page Numbers',    path: '/page-numbers' },
  { label: 'Crop PDF',        path: '/crop-pdf' },
  { label: 'Repair PDF',      path: '/repair-pdf' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { pathname } = useLocation()

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
        pathname === path ? 'text-indigo-600' : 'text-slate-600'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-xl text-slate-900">
            PDF<span className="text-indigo-600">Buddy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLink('/merge-pdf', 'Merge PDF')}
          {navLink('/split-pdf', 'Split PDF')}
          {navLink('/compress-pdf', 'Compress PDF')}

          {/* All Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              All Tools <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />
                <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-white shadow-xl border border-slate-100 rounded-2xl p-3 w-64 grid grid-cols-1 gap-0.5 z-50">
                  {tools.map(t => (
                    <Link
                      key={t.path}
                      to={t.path}
                      onClick={() => setDropOpen(false)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${
                        pathname === t.path ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 grid grid-cols-2 gap-1">
          {tools.map(t => (
            <Link
              key={t.path}
              to={t.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${
                pathname === t.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
