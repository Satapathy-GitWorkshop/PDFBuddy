import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">📄</div>
      <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary px-8 py-3 text-sm">Back to PDFBuddy</Link>
    </div>
  )
}
