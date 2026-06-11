import { useState } from 'react'
import {
  AIConfig, AIProvider, PROVIDER_LABELS, PROVIDER_MODELS, PROVIDER_KEY_HINTS,
  OPENROUTER_MODELS, OPENROUTER_DEFAULT_KEY,
  saveAIConfig,
} from '../lib/aiClient'
import { useI18n } from './I18nProvider'

interface Props {
  current: AIConfig
  onSave: (config: AIConfig) => void
  onClose: () => void
}

const PROVIDER_LINKS: Record<AIProvider, { label: string; url: string }> = {
  gemini:      { label: 'aistudio.google.com',    url: 'https://aistudio.google.com/app/apikey' },
  claude:      { label: 'console.anthropic.com',  url: 'https://console.anthropic.com/settings/keys' },
  openai:      { label: 'platform.openai.com',    url: 'https://platform.openai.com/api-keys' },
  openrouter:  { label: 'openrouter.ai/keys',     url: 'https://openrouter.ai/keys' },
}

export default function ApiKeyModal({ current, onSave, onClose }: Props) {
  const { t } = useI18n()
  const [provider, setProvider] = useState<AIProvider>(current.provider)
  const [key, setKey] = useState(current.provider === provider ? current.apiKey : '')
  const [model, setModel] = useState(
    current.provider === 'openrouter'
      ? (current.model ?? PROVIDER_MODELS.openrouter)
      : PROVIDER_MODELS.openrouter
  )
  const [customModel, setCustomModel] = useState(
    current.provider === 'openrouter' && current.model
      ? (OPENROUTER_MODELS.find(m => m.id === current.model) ? '' : current.model)
      : ''
  )
  const [show, setShow] = useState(false)

  const handleProviderChange = (p: AIProvider) => {
    setProvider(p)
    // Pré-preenche com chave embutida se for OpenRouter
    if (p === 'openrouter' && OPENROUTER_DEFAULT_KEY && !key) {
      setKey(OPENROUTER_DEFAULT_KEY)
    } else if (p !== provider) {
      setKey('')
    }
  }

  const effectiveModel = customModel.trim() || model

  const handleSave = () => {
    const trimmed = key.trim()
    if (!trimmed) return
    const config: AIConfig = {
      provider,
      apiKey: trimmed,
      ...(provider === 'openrouter' ? { model: effectiveModel } : {}),
    }
    saveAIConfig(config)
    onSave(config)
    onClose()
  }

  const link = PROVIDER_LINKS[provider]
  const isOpenRouter = provider === 'openrouter'
  const usingDefault = isOpenRouter && key === OPENROUTER_DEFAULT_KEY && !!OPENROUTER_DEFAULT_KEY

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-1">{t('api.title')}</h2>
          <p className="text-sm text-stone-400">{t('api.subtitle')}</p>
        </div>

        {/* Provider selector */}
        <div>
          <label className="label">{t('api.provider.label')}</label>
          <div className="grid grid-cols-2 gap-2">
            {(['gemini', 'claude', 'openai', 'openrouter'] as AIProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={`text-sm py-2 px-3 rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                  provider === p
                    ? 'border-wine-500 bg-wine-900/30 text-wine-300'
                    : 'border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                {PROVIDER_LABELS[p]}
                {p === 'openrouter' && <span className="text-[10px] text-green-400 font-medium">FREE</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-1.5">
            {t('api.model.label')}{' '}
            <span className="font-mono text-stone-400">
              {isOpenRouter ? effectiveModel : PROVIDER_MODELS[provider]}
            </span>
          </p>
        </div>

        {/* Model selector — só para OpenRouter */}
        {isOpenRouter && (
          <div className="space-y-2">
            <label className="label">{t('api.model.select')}</label>
            <select
              value={customModel ? '__custom__' : model}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  setCustomModel(model)
                } else {
                  setModel(e.target.value)
                  setCustomModel('')
                }
              }}
              className="text-sm"
            >
              {OPENROUTER_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
              <option value="__custom__">{t('api.model.custom')}</option>
            </select>
            {(customModel || !OPENROUTER_MODELS.find(m => m.id === model)) && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="ex: mistralai/mixtral-8x7b-instruct:free"
                className="font-mono text-xs"
              />
            )}
            <p className="text-[10px] text-stone-600">
              {t('api.model.full_list')}{' '}
              <a href="https://openrouter.ai/models?q=free" target="_blank" rel="noopener noreferrer" className="text-wine-500 underline">
                openrouter.ai/models?q=free
              </a>
            </p>
          </div>
        )}

        {/* API key input */}
        <div>
          <label className="label">{t('api.key.label')}</label>
          {usingDefault && (
            <p className="text-xs text-green-500 mb-1.5">
              {t('api.default_key.note')}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder={usingDefault ? t('api.default_key.placeholder') : PROVIDER_KEY_HINTS[provider]}
              className="font-mono text-sm"
              autoFocus={!usingDefault}
            />
            <button type="button" onClick={() => setShow(!show)} className="btn-ghost px-3 py-2 shrink-0">
              {show ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className="text-xs text-stone-500 bg-stone-800 rounded-lg p-3 space-y-2">
          {!usingDefault && (
            <p>
              {t('api.get_key')}{' '}
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-wine-400 underline">
                {link.label}
              </a>
              . {t(`api.link.${provider}`)}
            </p>
          )}
          {provider === 'gemini' && (
            <a
              href="/tutorial-gemini/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-wine-300 hover:text-wine-200 transition-colors font-medium"
            >
              {t('api.tutorial')}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          )}
          {isOpenRouter && (
            <p className="text-stone-500">{t('api.openrouter.free_note')}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">{t('api.cancel')}</button>
          <button type="button" onClick={handleSave} disabled={!key.trim()} className="btn-primary">
            {t('api.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
