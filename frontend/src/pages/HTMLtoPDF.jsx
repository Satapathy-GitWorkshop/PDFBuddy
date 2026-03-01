import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { htmlToPdf } from '../utils/api'

export default function HTMLtoPDF() {
  const [url, setUrl] = useState('')
  return (
    <ToolPage
      title="HTML to PDF" description="Convert any webpage to PDF by entering its URL"
      icon="🌐" color="#0891b2" accept={{}}
      buttonLabel="Convert to PDF"
      onProcess={() => {
        if (!url.trim()) throw new Error('Please enter a URL')
        if (!url.startsWith('http')) throw new Error('URL must start with http:// or https://')
        return htmlToPdf([], { url })
      }}
      options={
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Webpage URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com" className="input-field" />
          <p className="text-xs text-slate-400 mt-1.5">Enter the full URL including https://</p>
        </div>
      }
    />
  )
}