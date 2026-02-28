import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, Zap, Clock, Search,
  ArrowRight, FileText, Users, Star
} from 'lucide-react'

// ── Tool definitions ─────────────────────────────────────────────────────────
const tools = [
  // Organize
  { title: 'Merge PDF',         desc: 'Combine multiple PDFs into one document in your chosen order.',             icon: '🔀', category: 'Organize', path: '/merge-pdf' },
  { title: 'Split PDF',         desc: 'Separate PDF pages into individual files by range or every N pages.',       icon: '✂️', category: 'Organize', path: '/split-pdf' },
  { title: 'Compress PDF',      desc: 'Reduce file size while optimizing for maximum PDF quality.',                icon: '🗜️', category: 'Organize', path: '/compress-pdf' },
  { title: 'Rotate PDF',        desc: 'Rotate all or specific pages to the correct orientation.',                  icon: '🔄', category: 'Organize', path: '/rotate-pdf' },
  { title: 'Organize PDF',      desc: 'Reorder, delete, or rotate individual pages inside your PDF.',              icon: '🗂️', category: 'Organize', path: '/organize-pdf' },
  { title: 'Crop PDF',          desc: 'Crop page margins to remove white space or unwanted borders.',              icon: '📐', category: 'Organize', path: '/crop-pdf' },
  { title: 'Repair PDF',        desc: 'Recover and restore damaged or corrupted PDF files.',                       icon: '🔧', category: 'Organize', path: '/repair-pdf' },
  // Convert to PDF
  { title: 'Word to PDF',       desc: 'Convert DOC and DOCX files into universally shareable PDFs.',              icon: '📄', category: 'Convert to PDF', path: '/word-to-pdf' },
  { title: 'Excel to PDF',      desc: 'Turn Excel spreadsheets into clean, printable PDF documents.',             icon: '📊', category: 'Convert to PDF', path: '/excel-to-pdf' },
  { title: 'PowerPoint to PDF', desc: 'Convert PPT and PPTX presentations into viewable PDF files.',              icon: '📋', category: 'Convert to PDF', path: '/ppt-to-pdf' },
  { title: 'JPG to PDF',        desc: 'Combine images into a PDF with custom page size and orientation.',         icon: '📸', category: 'Convert to PDF', path: '/jpg-to-pdf' },
  { title: 'HTML to PDF',       desc: 'Convert any webpage to PDF by entering its URL.',                          icon: '🌐', category: 'Convert to PDF', path: '/html-to-pdf' },
  // Convert from PDF
  { title: 'PDF to Word',       desc: 'Convert PDF files into fully editable Word documents.',                    icon: '📝', category: 'Convert from PDF', path: '/pdf-to-word' },
  { title: 'PDF to Excel',      desc: 'Pull tables and data from PDFs directly into Excel spreadsheets.',         icon: '📈', category: 'Convert from PDF', path: '/pdf-to-excel' },
  { title: 'PDF to PowerPoint', desc: 'Transform PDF pages into editable PowerPoint slides.',                     icon: '🖥️', category: 'Convert from PDF', path: '/pdf-to-ppt' },
  { title: 'PDF to JPG',        desc: 'Convert each PDF page into a high-quality JPG image.',                     icon: '🖼️', category: 'Convert from PDF', path: '/pdf-to-jpg' },
  // Edit & Security
  { title: 'Watermark',         desc: 'Stamp custom text over your PDF with full control over style and opacity.', icon: '🏷️', category: 'Edit & Security', path: '/watermark-pdf' },
  { title: 'Page Numbers',      desc: 'Add formatted page numbers to any PDF with position and style control.',   icon: '#️⃣', category: 'Edit & Security', path: '/page-numbers' },
  { title: 'Sign PDF',          desc: 'Draw, type or upload your signature and embed it into any PDF.',           icon: '✍️', category: 'Edit & Security', path: '/sign-pdf' },
  { title: 'Protect PDF',       desc: 'Add password encryption to prevent unauthorized access.',                  icon: '🔒', category: 'Edit & Security', path: '/protect-pdf' },
  { title: 'Unlock PDF',        desc: 'Remove password protection from any PDF you have access to.',              icon: '🔓', category: 'Edit & Security', path: '/unlock-pdf' },
  { title: 'OCR PDF',           desc: 'Make scanned PDFs fully searchable and selectable using OCR.',             icon: '🔍', category: 'Edit & Security', path: '/ocr-pdf' },
]

const categories = ['All', 'Organize', 'Convert to PDF', 'Convert from PDF', 'Edit & Security']

// Category accent colors
const categoryColors = {
  'Organize':         { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' },
  'Convert to PDF':   { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  'Convert from PDF': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  'Edit & Security':  { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
}

const stats = [
  { icon: FileText, value: '22',    label: 'PDF Tools'       },
  { icon: Users,    value: '100%',  label: 'Free Forever'    },
  { icon: Clock,    value: '2hrs',  label: 'Auto File Delete' },
  { icon: Star,     value: '0',     label: 'Sign-up Required' },
]

const trustFeatures = [
  { icon: ShieldCheck, title: 'Bank-level Security',   desc: 'All files are encrypted in transit and at rest. Automatically deleted after 2 hours.' },
  { icon: Zap,         title: 'Fast Processing',       desc: 'Powered by optimized server infrastructure. Most PDFs processed in under 5 seconds.' },
  { icon: Clock,       title: 'Auto File Deletion',    desc: 'Your files are permanently deleted from our servers after 2 hours. No exceptions.' },
]

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } }
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } }
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory
      const matchesSearch   = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-md mb-6 tracking-wide uppercase">
                <FileText size={11} />
                Professional PDF Suite
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight mb-5"
            >
              Every PDF tool your<br />
              business needs —{' '}
              <span className="text-indigo-600">free.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-slate-500 text-lg leading-relaxed mb-8 max-w-xl"
            >
              Merge, split, compress, convert and secure your PDF documents.
              No account required. No software to install. Files deleted automatically.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={fadeUp} className="relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tools — e.g. compress, sign, convert..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition shadow-sm"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats Bar ─────────────────────────────────────────────────── */}
        <div className="border-t border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-wrap gap-6 md:gap-10">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-800">{value}</span>
                  <span className="text-sm text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tools Section ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearchQuery('') }}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {tools.filter(t => t.category === cat).length}
                </span>
              )}
            </button>
          ))}

          {/* Result count */}
          <span className="ml-auto text-xs text-slate-400 hidden md:block">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Tools Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredTools.length > 0 ? filteredTools.map(tool => {
              const colors = categoryColors[tool.category] || categoryColors['Organize']
              return (
                <motion.div key={tool.path} variants={fadeUp}>
                  <Link to={tool.path} className="block h-full group">
                    <div className="tool-card bg-white rounded-xl p-5 border border-slate-200 h-full flex flex-col">

                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-4 shrink-0"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                      >
                        {tool.icon}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-semibold text-slate-900 mb-1.5 text-sm group-hover:text-indigo-600 transition-colors"
                      >
                        {tool.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed flex-1">
                        {tool.desc}
                      </p>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: colors.text }}
                      >
                        Use tool <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            }) : (
              <motion.div
                variants={fadeUp}
                className="col-span-4 text-center py-16 text-slate-400"
              >
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No tools found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-indigo-500 text-sm hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Trust Section ─────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-2">
              Built for professionals
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Enterprise-grade security and performance — at zero cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-200 transition-colors"
              >
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={17} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}