import { createContext, useContext, useState, ReactNode } from 'react'
import { Locale, DEFAULT_LOCALE, translate } from '../lib/i18n'

interface I18nCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<I18nCtx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('vl_locale') as Locale | null
    return saved ?? DEFAULT_LOCALE
  })

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('vl_locale', l)
  }

  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, vars)

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>
}

export function useI18n() {
  return useContext(Ctx)
}

/** Renders a translation string that may contain **bold** markup */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p
      )}
    </>
  )
}
