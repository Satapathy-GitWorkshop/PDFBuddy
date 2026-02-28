import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { htmlToPdf } from '../utils/api'

export default function HTMLtoPDF() {
  const [url, setUrl] = useState('')
  return (
    <ToolPage
      title="HTML to PDF"
      description="Convert any webpage to PDF by entering its URL"
      icon="🌐"
      color="#0891b2"
      accept={{}}
      buttonLabel="Convert to PDF"
      onProcess={() => {
        if (!url) throw new Error('Please enter a URL')
        return htmlToPdf([], { url })
      }}
      options={
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Webpage URL</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <p className="text-xs text-gray-400 mt-1">Enter the full URL including https://</p>
        </div>
      }
    />
  )
}
