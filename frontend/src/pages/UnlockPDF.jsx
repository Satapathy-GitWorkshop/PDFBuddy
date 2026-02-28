import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { unlockPDF } from '../utils/api'

export default function UnlockPDF() {
  const [password, setPassword] = useState('')
  return (
    <ToolPage
      title="Unlock PDF"
      description="Remove password protection from your PDF"
      icon="🔓"
      color="#2563eb"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Unlock PDF"
      onProcess={(files) => unlockPDF(files, { password })}
      options={
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">PDF Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter PDF password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
        </div>
      }
    />
  )
}
