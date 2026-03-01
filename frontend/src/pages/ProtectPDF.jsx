import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { protectPDF } from '../utils/api'
import { Eye, EyeOff } from 'lucide-react'

export default function ProtectPDF() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [showConf, setShowConf]   = useState(false)

  return (
    <ToolPage
      title="Protect PDF"
      description="Add a password to your PDF to prevent unauthorized access"
      icon="🔒"
      color="#2563eb"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Protect PDF"
      onProcess={(files) => {
        if (!password)            throw new Error('Please enter a password')
        if (password !== confirm) throw new Error("Passwords don't match")
        return protectPDF(files, { password })
      }}
      options={
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConf ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm password"
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setShowConf(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {password && confirm && password !== confirm && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
      }
    />
  )
}