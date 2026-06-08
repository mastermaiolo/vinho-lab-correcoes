// Importa boletins .md e sessões .json exportados pelo vinho-lab-companheiro
// e extrai os campos relevantes para pré-preencher o formulário de diagnóstico.

export interface ParsedBoletim {
  tipo?: string
  tav?: string
  ph?: string
  so2Livre?: string
  so2Total?: string
  av?: string
  acidezTotal?: string
  esr?: string
  amostra?: string
  lote?: string
  data?: string
  jurisdicao?: 'ptue' | 'br'
}

function extrairTabela(md: string, campo: string): string | undefined {
  // Procura | campo | valor | em tabelas markdown
  const regex = new RegExp(`\\|\\s*${campo}\\s*\\|\\s*([^|\\n]+)\\s*\\|`, 'i')
  const m = md.match(regex)
  return m?.[1]?.trim()
}

function extrairValorNumerico(texto: string | undefined): string | undefined {
  if (!texto) return undefined
  const m = texto.match(/([\d.,]+)/)
  return m?.[1]?.replace(',', '.')
}

export function parseMdBoletim(conteudo: string): ParsedBoletim {
  const resultado: ParsedBoletim = {}

  // Identificação
  resultado.amostra = extrairTabela(conteudo, 'Amostra') || undefined
  resultado.lote = extrairTabela(conteudo, 'Lote') || undefined
  resultado.data = extrairTabela(conteudo, 'Data') || undefined

  // Tipo de vinho — linha "Tipo de vinho: ..."
  const tipoMatch = conteudo.match(/\*\*Tipo de vinho:\*\*\s*([^\n]+)/i)
  if (tipoMatch) {
    const t = tipoMatch[1].trim().toLowerCase()
    if (t.includes('tinto')) resultado.tipo = 'Tinto seco'
    else if (t.includes('branco')) resultado.tipo = 'Branco seco'
    else if (t.includes('ros')) resultado.tipo = 'Rosé seco'
    else if (t.includes('espumante')) resultado.tipo = 'Espumante'
  }

  // Jurisdição a partir do veredicto — se mencionar BR assume BR, senão PT/UE
  if (conteudo.includes('MAPA') && !conteudo.includes('IVV')) {
    resultado.jurisdicao = 'br'
  } else {
    resultado.jurisdicao = 'ptue'
  }

  // Extrai TAV
  const tavRaw =
    extrairTabela(conteudo, 'Título alcoólico') ||
    extrairTabela(conteudo, 'TAV') ||
    extrairTabela(conteudo, 'Álcool')
  resultado.tav = extrairValorNumerico(tavRaw)

  // pH
  const phRaw = extrairTabela(conteudo, 'pH')
  resultado.ph = extrairValorNumerico(phRaw)

  // SO₂ livre
  const so2LivreRaw =
    extrairTabela(conteudo, 'SO.*livre') ||
    extrairTabela(conteudo, 'Dióxido de enxofre livre')
  resultado.so2Livre = extrairValorNumerico(so2LivreRaw)

  // SO₂ total
  const so2TotalRaw =
    extrairTabela(conteudo, 'SO.*total') ||
    extrairTabela(conteudo, 'Dióxido de enxofre total')
  resultado.so2Total = extrairValorNumerico(so2TotalRaw)

  // Acidez volátil
  const avRaw =
    extrairTabela(conteudo, 'Acidez volátil') ||
    extrairTabela(conteudo, 'AV')
  resultado.av = extrairValorNumerico(avRaw)

  // Acidez total
  const atRaw = extrairTabela(conteudo, 'Acidez total')
  resultado.acidezTotal = extrairValorNumerico(atRaw)

  // ESR
  const esrRaw =
    extrairTabela(conteudo, 'Extrato seco') ||
    extrairTabela(conteudo, 'ESR') ||
    extrairTabela(conteudo, 'Resíduo seco')
  resultado.esr = extrairValorNumerico(esrRaw)

  return resultado
}

// ── Importador de sessão .json do vinho-lab-companheiro ───────────────────────

const SESSION_KIND = 'vinho-lab/session'

type Measurement = { value: number | null; unit: string }

interface SessionCompanheiro {
  kind: string
  tipoId?: string
  brCat?: string
  meta?: { amostra?: string; lote?: string; data?: string }
  measurements?: Record<string, Measurement>
}

// Mapeamento tipoId → tipo de vinho do formulário de diagnóstico
const TIPO_MAP: Record<string, string> = {
  tinto: 'Tinto seco',
  mesa_tinto: 'Tinto seco',
  bio_tinto: 'Tinto seco',
  branco_rose: 'Branco seco',
  mesa_branco_rose: 'Branco seco',
  licoroso_branco: 'Branco doce',
  licoroso_tinto: 'Tinto doce',
  espumante: 'Espumante',
  espumante_nq: 'Espumante',
}

function mval(m: Record<string, Measurement> | undefined, ...ids: string[]): string | undefined {
  if (!m) return undefined
  for (const id of ids) {
    const v = m[id]?.value
    if (v != null) return String(v)
  }
  return undefined
}

export function isSessionCompanheiro(raw: unknown): raw is SessionCompanheiro {
  return typeof raw === 'object' && raw !== null && (raw as Record<string, unknown>).kind === SESSION_KIND
}

export function parseSessionCompanheiro(raw: SessionCompanheiro): ParsedBoletim {
  const m = raw.measurements
  const resultado: ParsedBoletim = {}

  resultado.amostra = raw.meta?.amostra || undefined
  resultado.lote = raw.meta?.lote || undefined
  resultado.data = raw.meta?.data || undefined

  resultado.tipo = TIPO_MAP[raw.tipoId ?? ''] ?? 'Tinto seco'

  // Jurisdição: se brCat contém "mesa" ou "organico" → provavelmente BR
  resultado.jurisdicao = raw.brCat?.includes('mesa') || raw.brCat?.includes('organico') ? 'br' : 'ptue'

  resultado.tav   = mval(m, 'tav', 'alcool', 'titulo_alcoolico')
  resultado.ph    = mval(m, 'ph')
  resultado.so2Livre  = mval(m, 'so2_livre', 'so2livre', 'dioxido_enxofre_livre')
  resultado.so2Total  = mval(m, 'so2_total', 'so2total', 'dioxido_enxofre_total')
  resultado.av    = mval(m, 'acidez_volatil', 'av')
  resultado.acidezTotal = mval(m, 'acidez_total', 'at')
  resultado.esr   = mval(m, 'esr', 'extrato_seco', 'residuo_seco')

  return resultado
}
