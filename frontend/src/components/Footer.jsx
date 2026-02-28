import { Link } from 'react-router-dom'
import { FileText, Heart, Github, Twitter } from 'lucide-react'

const footerLinks = {
  'PDF Tools': [
    { l: 'Merge PDF',    p: '/merge-pdf' },
    { l: 'Split PDF',    p: '/split-pdf' },
    { l: 'Compress PDF', p: '/compress-pdf' },
    { l: 'Rotate PDF',   p: '/rotate-pdf' },
    { l: 'Organize PDF', p: '/organize-pdf' },
    { l: 'Repair PDF',   p: '/repair-pdf' },
  ],
  'Convert to PDF': [
    { l: 'Word to PDF',  p: '/word-to-pdf' },
    { l: 'JPG to PDF',   p: '/jpg-to-pdf' },
    { l: 'Excel to PDF', p: '/excel-to-pdf' },
    { l: 'PPT to PDF',   p: '/ppt-to-pdf' },
    { l: 'HTML to PDF',  p: '/html-to-pdf' },
  ],
  'Convert from PDF': [
    { l: 'PDF to Word',  p: '/pdf-to-word' },
    { l: 'PDF to JPG',   p: '/pdf-to-jpg' },
    { l: 'PDF to Excel', p: '/pdf-to-excel' },
    { l: 'PDF to PPT',   p: '/pdf-to-ppt' },
  ],
  'Edit & Secure': [
    { l: 'Watermark',    p: '/watermark-pdf' },
    { l: 'Protect PDF',  p: '/protect-pdf' },
    { l: 'Unlock PDF',   p: '/unlock-pdf' },
    { l: 'Sign PDF',     p: '/sign-pdf' },
    { l: 'OCR PDF',      p: '/ocr-pdf' },
    { l: 'Crop PDF',     p: '/crop-pdf' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-8">

        {/* Top row: Logo + tagline */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 mb-12">
          <div className="md:w-56 shrink-0">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                PDF<span className="text-indigo-400">Buddy</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every PDF tool you need, completely free. Files deleted automatically after 2 hours.
            </p>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white text-sm font-semibold mb-3">{category}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link.p}>
                      <Link
                        to={link.p}
                        className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                      >
                        {link.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

          {/* Made by */}
          <p className="flex items-center gap-1.5 text-slate-500">
            Designed &amp; built with
            <Heart size={13} className="text-indigo-400 fill-indigo-400" />
            by{' '}
            <a
              href="https://github.com/satpathy98"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
            >
              Saurav Satpathy
            </a>
          </p>

          {/* Privacy note */}
          <p className="text-slate-600 text-xs">
            🔒 Files are encrypted and auto-deleted after 2 hours. Your privacy is protected.
          </p>
        </div>

      </div>
    </footer>
  )
}
