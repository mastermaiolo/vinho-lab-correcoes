import { useState } from 'react'

interface Props {
  onSave: (key: string) => void
  onClose: () => void
}

export default function ApiKeyModal({ onSave, onClose }: Props) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)

  const handleSave = () => {
    const trimmed = key.trim()
    if (!trimmed) return
    sessionStorage.setItem('gemini_api_key', trimmed)
    onSave(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-1">Chave API Gemini</h2>
        <p className="text-sm text-stone-400 mb-5">
          Guardada apenas nesta sessão do browser (sessionStorage). Nunca enviada para outros servidores que não o Google.
        </p>

        <label className="label">Chave API (AIza...)</label>
        <div className="flex gap-2 mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="AIzaSy..."
            className="font-mono text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="btn-ghost px-3 py-2 shrink-0"
            title={show ? 'Ocultar' : 'Mostrar'}
          >
            {show ? '🙈' : '👁'}
          </button>
        </div>

        <div className="text-xs text-stone-500 bg-stone-800 rounded-lg p-3 mb-5">
          Obtenha uma chave em{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wine-400 underline"
          >
            aistudio.google.com
          </a>
          . O plano gratuito é suficiente para uso normal.
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!key.trim()}
            className="btn-primary"
          >
            Guardar para esta sessão
          </button>
        </div>
      </div>
    </div>
  )
}
