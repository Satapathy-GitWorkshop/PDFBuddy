import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Cloud, Gift } from 'lucide-react'

const tools = [
  { title: 'Merge PDF',         desc: 'Combine multiple PDFs into one document in your chosen order.',         icon: '🔀', bg: '#eef2ff', accent: '#6366f1', path: '/merge-pdf' },
  { title: 'Split PDF',         desc: 'Separate pages into individual files by range or every N pages.',       icon: '✂️', bg: '#eef2ff', accent: '#6366f1', path: '/split-pdf' },
  { title: 'Compress PDF',      desc: 'Reduce file size while keeping quality as high as possible.',           icon: '🗜️', bg: '#f0fdf4', accent: '#16a34a', path: '/compress-pdf' },
  { title: 'PDF to Word',       desc: 'Convert PDF files into easy-to-edit Word documents.',                  icon: '📝', bg: '#eff6ff', accent: '#2563eb', path: '/pdf-to-word' },
  { title: 'PDF to PowerPoint', desc: 'Turn PDF files into editable PPT and PPTX slideshows.',                icon: '📊', bg: '#fff7ed', accent: '#ea580c', path: '/pdf-to-ppt' },
  { title: 'PDF to Excel',      desc: 'Pull data straight from PDFs into Excel spreadsheets.',                icon: '📈', bg: '#f0fdf4', accent: '#16a34a', path: '/pdf-to-excel' },
  { title: 'Word to PDF',       desc: 'Make DOC and DOCX files easy to share by converting to PDF.',          icon: '📄', bg: '#eff6ff', accent: '#2563eb', path: '/word-to-pdf' },
  { title: 'PowerPoint to PDF', desc: 'Convert PPT and PPTX presentations to universally viewable PDF.',      icon: '📋', bg: '#fff7ed', accent: '#ea580c', path: '/ppt-to-pdf' },
  { title: 'Excel to PDF',      desc: 'Convert Excel spreadsheets to PDF for easy sharing.',                  icon: '📉', bg: '#f0fdf4', accent: '#16a34a', path: '/excel-to-pdf' },
  { title: 'PDF to JPG',        desc: 'Convert each PDF page to a JPG image or extract all images.',          icon: '🖼️', bg: '#faf5ff', accent: '#7c3aed', path: '/pdf-to-jpg' },
  { title: 'JPG to PDF',        desc: 'Convert images to PDF. Set page size, orientation and margins.',       icon: '📸', bg: '#faf5ff', accent: '#7c3aed', path: '/jpg-to-pdf' },
  { title: 'HTML to PDF',       desc: 'Convert any webpage to PDF by entering its URL.',                      icon: '🌐', bg: '#ecfeff', accent: '#0891b2', path: '/html-to-pdf' },
  { title: 'Rotate PDF',        desc: 'Rotate all or specific pages to the correct orientation.',             icon: '🔄', bg: '#ecfeff', accent: '#0891b2', path: '/rotate-pdf' },
  { title: 'Watermark',         desc: 'Stamp text or image over your PDF with custom opacity and position.',  icon: '🏷️', bg: '#faf5ff', accent: '#7c3aed', path: '/watermark-pdf' },
  { title: 'Unlock PDF',        desc: 'Remove PDF password security so you can use your files freely.',       icon: '🔓', bg: '#eff6ff', accent: '#2563eb', path: '/unlock-pdf' },
  { title: 'Protect PDF',       desc: 'Password protect your PDF to prevent unauthorized access.',            icon: '🔒', bg: '#eff6ff', accent: '#2563eb', path: '/protect-pdf' },
  { title: 'Organize PDF',      desc: 'Reorder, delete, or rotate individual pages in your PDF.',             icon: '🗂️', bg: '#eef2ff', accent: '#6366f1', path: '/organize-pdf' },
  { title: 'Sign PDF',          desc: 'Draw or type your signature and embed it into any PDF.',               icon: '✍️', bg: '#ecfeff', accent: '#0891b2', path: '/sign-pdf' },
  { title: 'OCR PDF',           desc: 'Make scanned PDFs searchable and selectable with OCR.',                icon: '🔍', bg: '#fff7ed', accent: '#ea580c', path: '/ocr-pdf' },
  { title: 'Page Numbers',      desc: 'Add page numbers to your PDF with full control over style and position.', icon: '#️⃣', bg: '#f0fdf4', accent: '#16a34a', path: '/page-numbers' },
  { title: 'Crop PDF',          desc: 'Crop the margins of PDF pages to remove white space or borders.',      icon: '✂️', bg: '#eef2ff', accent: '#6366f1', path: '/crop-pdf' },
  { title: 'Repair PDF',        desc: 'Recover and fix damaged or corrupted PDF files.',                      icon: '🔧', bg: '#faf5ff', accent: '#7c3aed', path: '/repair-pdf' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } }
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } }
}

const features = [
  { icon: ShieldCheck, label: 'Secure & Private',  desc: 'Files deleted after 2 hours' },
  { icon: Zap,         label: 'Fast Processing',   desc: 'Results in seconds' },
  { icon: Cloud,       label: 'Cloud Storage',     desc: 'Access from anywhere' },
  { icon: Gift,        label: '100% Free',         desc: 'No sign-up required' },
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
              22 Free PDF Tools
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight mb-4">
              Your PDF toolkit,<br />
              <span className="text-indigo-600">completely free</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Merge, split, compress, convert, sign, and more — all in your browser.
              No account required. Files deleted automatically after 2 hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Tools Grid ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {tools.map((tool) => (
            <motion.div key={tool.path} variants={item}>
              <Link to={tool.path} className="block h-full">
                <div className="tool-card bg-white rounded-2xl p-5 border border-slate-100 h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                    style={{ background: tool.bg }}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">{tool.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Features Strip ──────────────────────── */}
      <div className="bg-slate-900 py-12 mt-4">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label}>
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-indigo-400" />
              </div>
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
