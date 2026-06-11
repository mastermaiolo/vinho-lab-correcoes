import SYSTEM_RAW from './systemPrompt'
import { Locale } from './i18n'

export const SYSTEM_PROMPT = SYSTEM_RAW

// O catálogo e os dados permanecem em PT; só o texto da resposta muda de idioma
const IDIOMA_RESPOSTA: Record<Locale, string> = {
  pt: 'português',
  en: 'inglês (English)',
  es: 'espanhol (español)',
  zh: 'chinês simplificado (简体中文)',
}

export interface FormData {
  tipo: string
  fase: string
  tav: string
  ph: string
  so2Livre: string
  av: string
  acidezTotal: string
  so2Total: string
  esr: string
  sintomas: string[]
  sintomaOutro: string
  jurisdicao: 'ptue' | 'br'
}

export function buildUserPrompt(form: FormData, locale: Locale = 'pt'): string {
  const sintomasStr = [
    ...form.sintomas,
    ...(form.sintomaOutro.trim() ? [`Outro: ${form.sintomaOutro.trim()}`] : []),
  ]
    .map((s) => `  - ${s}`)
    .join('\n')

  const params = [
    form.av ? `  - Acidez volátil: ${form.av} mEq/L` : null,
    form.acidezTotal ? `  - Acidez total: ${form.acidezTotal} mEq/L` : null,
    form.so2Total ? `  - SO₂ total: ${form.so2Total} mg/L` : null,
    form.esr ? `  - Extrato seco redutível: ${form.esr} g/L` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return `Analise este vinho com os seguintes dados:

CONTEXTO DO VINHO:
  - Tipo: ${form.tipo}
  - Fase: ${form.fase}
  - TAV: ${form.tav || '—'} % vol
  - pH: ${form.ph || '—'}
  - SO₂ livre: ${form.so2Livre || '—'} mg/L

PARÂMETROS ANALÍTICOS DISPONÍVEIS:
${params || '  (não fornecidos)'}

SINTOMAS SENSORIAIS E FÍSICOS:
${sintomasStr || '  (nenhum selecionado)'}

LEGISLAÇÃO APLICÁVEL: ${form.jurisdicao === 'ptue' ? 'Portugal / União Europeia' : 'Brasil (MAPA)'}

Forneça diagnóstico diferencial completo com as correções adequadas para a legislação indicada.${
    locale !== 'pt'
      ? `\n\nIMPORTANTE: Redija todos os textos da resposta JSON (causa, correção, observações, métodos, proibições) em ${IDIOMA_RESPOSTA[locale]}. Mantenha nomes de compostos químicos e referências legais no formato original.`
      : ''
  }`
}
