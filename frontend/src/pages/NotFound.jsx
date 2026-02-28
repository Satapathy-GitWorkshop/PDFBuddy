import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight, FileText } from 'lucide-react'

const suggestions = [
  { label: 'Merge PDF',    path: '/merge-pdf' },
  { label: 'Compress PDF', path: '/compress-pdf' },
  { label: 'PDF to Word',  path: '/pdf-to-word' },
  { label: 'Sign PDF',     path: '/sign-pdf' },
]

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md"
      >
        {/* Icon */}
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText size={28} className="text-indigo-400" />
        </div>

        {/* 404 */}
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">404 — Page not found</p>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 mb-3">
          This page doesn't exist
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          The page you're looking for may have been moved or deleted.
          Here are some tools you might be looking for:
        </p>

        {/* Quick suggestions */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {suggestions.map(s => (
            <Link
              key={s.path}
              to={s.path}
              className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors group"
            >
              {s.label}
              <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Back home */}
        <Link to="/" className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2">
          <Home size={15} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}