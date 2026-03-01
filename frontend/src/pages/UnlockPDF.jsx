import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { unlockPDF } from '../utils/api'
import { Eye, EyeOff } from 'lucide-react'

export default function UnlockPDF() {
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
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
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">PDF Password</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter PDF password" className="input-field pr-10" />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      }
    />
  )
}