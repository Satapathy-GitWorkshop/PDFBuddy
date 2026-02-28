import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, FileText, Grid } from 'lucide-react'

// ── Tool list grouped by category ────────────────────────────────────────────
const categories = [
  {
    label: 'Organize',
    color: '#6366f1',
    bg: '#eef2ff',
    tools: [
      { label: 'Merge PDF',    path: '/merge-pdf',    icon: '🔀' },
      { label: 'Split PDF',    path: '/split-pdf',    icon: '✂️' },
      { label: 'Compress PDF', path: '/compress-pdf', icon: '🗜️' },
      { label: 'Rotate PDF',   path: '/rotate-pdf',   icon: '🔄' },
      { label: 'Organize PDF', path: '/organize-pdf', icon: '🗂️' },
      { label: 'Crop PDF',     path: '/crop-pdf',     icon: '📐' },
      { label: 'Repair PDF',   path: '/repair-pdf',   icon: '🔧' },
    ]
  },
  {
    label: 'Convert to PDF',
    color: '#16a34a',
    bg: '#f0fdf4',
    tools: [
      { label: 'Word to PDF',  path: '/word-to-pdf',  icon: '📄' },
      { label: 'Excel to PDF', path: '/excel-to-pdf', icon: '📊' },
      { label: 'PPT to PDF',   path: '/ppt-to-pdf',   icon: '📋' },
      { label: 'JPG to PDF',   path: '/jpg-to-pdf',   icon: '📸' },
      { label: 'HTML to PDF',  path: '/html-to-pdf',  icon: '🌐' },
    ]
  },
  {
    label: 'Convert from PDF',
    color: '#2563eb',
    bg: '#eff6ff',
    tools: [
      { label: 'PDF to Word',  path: '/pdf-to-word',  icon: '📝' },
      { label: 'PDF to Excel', path: '/pdf-to-excel', icon: '📈' },
      { label: 'PDF to PPT',   path: '/pdf-to-ppt',   icon: '🖥️' },
      { label: 'PDF to JPG',   path: '/pdf-to-jpg',   icon: '🖼️' },
    ]
  },
  {
    label: 'Edit & Security',
    color: '#7c3aed',
    bg: '#faf5ff',
    tools: [
      { label: 'Watermark',   path: '/watermark-pdf', icon: '🏷️' },
      { label: 'Page Numbers',path: '/page-numbers',  icon: '#️⃣' },
      { label: 'Sign PDF',    path: '/sign-pdf',      icon: '✍️' },
      { label: 'Protect PDF', path: '/protect-pdf',   icon: '🔒' },
      { label: 'Unlock PDF',  path: '/unlock-pdf',    icon: '🔓' },
      { label: 'OCR PDF',     path: '/ocr-pdf',       icon: '🔍' },
    ]
  }
]

// Quick links shown in top nav bar
const quickLinks = [
  { label: 'Merge PDF',    path: '/merge-pdf' },
  { label: 'Compress PDF', path: '/compress-pdf' },
  { label: 'PDF to Word',  path: '/pdf-to-word' },
  { label: 'Sign PDF',     path: '/sign-pdf' },
]

export default function Navbar() {
  const [dropOpen, setDropOpen]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [mobileTab, setMobileTab] = useState(0)
  const { pathname }              = useLocation()
  const dropRef                   = useRef(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDropOpen(false)
    setMobileOpen(false)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-md border-b border-slate-100' : 'border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText size={15} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
              PDF<span className="text-indigo-600">Buddy</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {/* Quick links */}
            {quickLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* All Tools dropdown trigger */}
            <div ref={dropRef} className="relative ml-1">
              <button
                onClick={() => setDropOpen(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  dropOpen ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Grid size={13} />
                All Tools
                <ChevronDown size={13} className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* ── Mega Dropdown ── */}
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-11 left-0 bg-white border border-slate-200 rounded-xl shadow-2xl w-[700px] p-5 grid grid-cols-4 gap-5"
                  >
                    {categories.map(cat => (
                      <div key={cat.label}>
                        {/* Category header */}
                        <p
                          className="text-xs font-bold uppercase tracking-wider mb-2 pb-1.5 border-b"
                          style={{ color: cat.color, borderColor: cat.color + '30' }}
                        >
                          {cat.label}
                        </p>
                        <ul className="space-y-0.5">
                          {cat.tools.map(tool => (
                            <li key={tool.path}>
                              <Link
                                to={tool.path}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                                  pathname === tool.path
                                    ? 'font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                                style={pathname === tool.path ? { background: cat.bg, color: cat.color } : {}}
                              >
                                <span className="text-sm">{tool.icon}</span>
                                {tool.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                <span className="font-display font-extrabold text-lg text-slate-900">
                  PDF<span className="text-indigo-600">Buddy</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex overflow-x-auto border-b border-slate-100 shrink-0 px-3 pt-3 gap-1 pb-0">
                {categories.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => setMobileTab(i)}
                    className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                      mobileTab === i
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tool list for active tab */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.15 }}
                  >
                    {categories[mobileTab].tools.map(tool => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                          pathname === tool.path
                            ? 'bg-indigo-50 text-indigo-600 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{tool.icon}</span>
                        {tool.label}
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-slate-100 shrink-0">
                <Link
                  to="/"
                  className="flex items-center justify-center w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  View All Tools
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}