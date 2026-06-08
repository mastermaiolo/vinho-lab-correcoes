import SYSTEM_RAW from './systemPrompt'

export const SYSTEM_PROMPT = SYSTEM_RAW

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

export function buildUserPrompt(form: FormData): string {
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

Forneça diagnóstico diferencial completo com as correções adequadas para a legislação indicada.`
}
