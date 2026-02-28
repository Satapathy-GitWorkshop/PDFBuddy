import { useState, useRef, useEffect } from 'react'
import ToolPage from '../components/ToolPage'
import { signPDF } from '../utils/api'

export default function SignPDF() {
  const [signMode, setSignMode] = useState('draw')
  const [typedSig, setTypedSig] = useState('')
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  useEffect(() => {
    if (signMode !== 'draw') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'

    const start = (e) => { drawing.current = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY) }
    const draw = (e) => { if (!drawing.current) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke() }
    const stop = () => { drawing.current = false }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stop)
    canvas.addEventListener('mouseleave', stop)
    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stop)
      canvas.removeEventListener('mouseleave', stop)
    }
  }, [signMode])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const getSignatureData = () => {
    if (signMode === 'draw') return canvasRef.current?.toDataURL()
    return typedSig
  }

  return (
    <ToolPage
      title="Sign PDF"
      description="Add your signature to a PDF document"
      icon="✍️"
      color="#0891b2"
      accept={{ 'application/pdf': ['.pdf'] }}
      buttonLabel="Sign PDF"
      onProcess={(files) => signPDF(files, { signMode, signature: getSignatureData() })}
      options={
        <div className="space-y-4">
          <div className="flex gap-2">
            {[{ v: 'draw', l: 'Draw' }, { v: 'type', l: 'Type' }].map(m => (
              <button key={m.v} onClick={() => setSignMode(m.v)}
                className={`px-5 py-2 rounded-lg border-2 text-sm font-medium transition ${signMode === m.v ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-600'}`}
              >{m.l}</button>
            ))}
          </div>
          {signMode === 'draw' && (
            <div>
              <canvas ref={canvasRef} width={460} height={120}
                className="border-2 border-gray-200 rounded-xl bg-white w-full cursor-crosshair" />
              <button onClick={clearCanvas} className="text-xs text-gray-400 mt-1 hover:text-red-500">Clear</button>
            </div>
          )}
          {signMode === 'type' && (
            <input type="text" value={typedSig} onChange={e => setTypedSig(e.target.value)}
              placeholder="Type your signature"
              style={{ fontFamily: 'cursive', fontSize: '22px' }}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red" />
          )}
        </div>
      }
    />
  )
}
