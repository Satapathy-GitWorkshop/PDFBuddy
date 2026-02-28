import { useState } from 'react'
import ToolPage from '../components/ToolPage'
import { protectPDF } from '../utils/api'

export default function ProtectPDF() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <ToolPage
      title="Protect PDF"
      description="Add a password to your PDF to prevent unauthorized access"
      icon="🔒"
      color="#2563eb"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Protect PDF"
      onProcess={(files) => {
        if (password !== confirm) throw new Error("Passwords don't match")
        if (!password) throw new Error("Please enter a password")
        return protectPDF(files, { password })
      }}
      options={
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>
      }
    />
  )
}
