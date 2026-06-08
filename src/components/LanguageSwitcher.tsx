import { LOCALES } from '../lib/i18n'
import { useI18n } from './I18nProvider'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          title={l.label}
          className={`text-sm px-1.5 py-1 rounded transition-colors ${
            locale === l.code
              ? 'text-wine-300 bg-wine-900/30'
              : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
