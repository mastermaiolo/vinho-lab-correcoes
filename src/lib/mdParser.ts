// Importa boletins .md exportados pelo vinho-lab-companheiro
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
