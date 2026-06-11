import { AIProvider, PROVIDER_LABELS } from '../lib/aiClient'
import { useI18n, Rich } from './I18nProvider'

interface Props {
  provider: AIProvider
  onAccept: () => void
  onCancel: () => void
}

const PROVIDER_POLICY: Record<AIProvider, { label: string; url: string }> = {
  gemini:     { label: 'Google Privacy Policy',     url: 'https://policies.google.com/privacy' },
  claude:     { label: 'Anthropic Privacy Policy',  url: 'https://www.anthropic.com/legal/privacy' },
  openai:     { label: 'OpenAI Privacy Policy',     url: 'https://openai.com/policies/privacy-policy' },
  openrouter: { label: 'OpenRouter Privacy Policy', url: 'https://openrouter.ai/privacy' },
}

export default function PrivacyConsentModal({ provider, onAccept, onCancel }: Props) {
  const { t } = useI18n()
  const providerName = PROVIDER_LABELS[provider]
  const policy = PROVIDER_POLICY[provider]

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-base font-semibold text-stone-100">{t('privacy.modal.title')}</h2>
          <p className="text-sm text-stone-400 mt-1">{t('privacy.modal.subtitle', { provider: providerName })}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* O que é enviado */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              {t('privacy.modal.sent.title', { provider: providerName })}
            </p>
            <ul className="space-y-1.5">
              {['1', '2', '3', '4'].map((n) => (
                <li key={n} className="flex gap-2.5 text-sm text-stone-300">
                  <span className="text-amber-400 shrink-0 mt-0.5">→</span>
                  {t(`privacy.modal.sent.${n}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* O que NÃO é enviado */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              {t('privacy.modal.never.title')}
            </p>
            <ul className="space-y-1.5">
              {['1', '2', '3'].map((n) => (
                <li key={n} className="flex gap-2.5 text-sm text-stone-300">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  {t(`privacy.modal.never.${n}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Nota legal */}
          <div className="bg-stone-800 rounded-lg p-3 text-xs text-stone-400 leading-relaxed">
            <p><Rich text={t('privacy.modal.legal.1', { provider: providerName })} /></p>
            <p className="mt-2">
              <a
                href={policy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine-400 underline"
              >
                {policy.label}
              </a>
            </p>
            <p className="mt-2"><Rich text={t('privacy.modal.legal.2')} /></p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="btn-ghost">
            {t('privacy.modal.cancel')}
          </button>
          <button type="button" onClick={onAccept} className="btn-primary">
            {t('privacy.modal.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
