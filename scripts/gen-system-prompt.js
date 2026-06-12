#!/usr/bin/env node
/**
 * Gera src/lib/systemPrompt.ts a partir dos ficheiros JSON de dados.
 * Uso: npm run gen-prompt
 *
 * Quando atualizar defeitos.json, produtos_correcao.json, limites_pt_ue.json ou
 * limites_brasil.json, execute este script para manter o systemPrompt sincronizado.
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dir, '../src/data')
const outFile = join(__dir, '../src/lib/systemPrompt.ts')

const defeitos = JSON.parse(readFileSync(join(dataDir, 'defeitos.json'), 'utf8'))
const produtos = JSON.parse(readFileSync(join(dataDir, 'produtos_correcao.json'), 'utf8'))

function produtosResumo() {
  const linhas = []
  for (const [, cat] of Object.entries(produtos)) {
    linhas.push(`  [${cat.title.toUpperCase()}]`)
    for (const [, p] of Object.entries(cat.produtos)) {
      const dose = p.dose_tipica_g_hL || p.dose_tipica || ''
      const doseMax = p.dose_max_g_hL || p.dose_max_g_L || ''
      const jur = []
      if (p.pt_ue === true) jur.push('PT/UE')
      else if (p.pt_ue) jur.push('PT/UE(parcial)')
      if (p.brasil === true) jur.push('BR')
      else if (p.brasil) jur.push('BR(verificar)')
      const aviso = p.aviso || p.aviso_ue || ''
      let info = p.nome
      if (dose) info += ` — ${dose} g/hL`
      if (doseMax) info += ` (máx ${doseMax} g/hL)`
      if (jur.length) info += ` [${jur.join(',')}]`
      if (aviso) info += ` ⚠ ${aviso.slice(0, 80)}`
      linhas.push(`    • ${info}`)
    }
  }
  return linhas.join('\n')
}

function defeitoTexto(d) {
  const compostos = (d.compostos_marcadores ?? []).map((c) => {
    if (typeof c === 'string') return c
    let s = c.nome
    if (c.formula) s += ` (${c.formula})`
    if (c.limiar_percepcao) s += ` — limiar: ${c.limiar_percepcao}`
    if (c.zona_risco) s += ` | zona risco: ${c.zona_risco}`
    return s
  })

  const linhas = [`### ${d.id}: ${d.nome} (${d.categoria})`]
  if (d.causa) linhas.push(`Causa: ${d.causa}`)
  if (compostos.length) linhas.push(`Marcadores: ${compostos.join(' | ')}`)
  if (d.descritores_sensoriais) linhas.push(`Descritores: ${d.descritores_sensoriais.join(', ')}`)
  const ca = d.confirmacao_analitica ?? {}
  if (ca.metodo_principal) linhas.push(`Análise principal: ${ca.metodo_principal}`)
  if (ca.metodo_rapido) linhas.push(`Método rápido: ${ca.metodo_rapido}`)
  const corr = d.correcao ?? {}
  if (corr.pt_ue) linhas.push(`CORREÇÃO PT/UE: ${corr.pt_ue}`)
  if (corr.br) linhas.push(`CORREÇÃO BR: ${corr.br}`)
  if (d.reversivel !== undefined) linhas.push(`Reversível: ${d.reversivel}`)
  const limleg = d.limites_legais ?? {}
  if (limleg.pt_ue) linhas.push(`Limites PT/UE: ${JSON.stringify(limleg.pt_ue)}`)
  if (limleg.brasil) linhas.push(`Limites BR: ${JSON.stringify(limleg.brasil)}`)
  return linhas.join('\n')
}

const defeitosTxt = defeitos.map(defeitoTexto).join('\n\n')
const prodTxt = produtosResumo()

const prompt = `Você é um enólogo consultor especialista em defeitos, doenças e correções de vinho, com conhecimento profundo da legislação vitivinícola portuguesa/europeia e brasileira.

════════════════════════════════════════════════════════
REGRAS DE RESPOSTA
════════════════════════════════════════════════════════
1. Responda EXCLUSIVAMENTE em JSON válido, sem markdown adicional, sem texto antes ou depois.
2. Use SEMPRE a estrutura definida abaixo (nenhum campo omitido).
3. Máximo 3 diagnósticos, ordenados por probabilidade decrescente.
4. Confiança: "alta" (≥70% probabilidade), "media" (40–70%), "baixa" (<40%).
5. Se os dados forem insuficientes para um 3.º diagnóstico, preencha com null.
6. Nas correções, indique a BASE TEÓRICA do tratamento E os PRODUTOS COMERCIAIS específicos com doses (g/hL ou mg/L conforme aplicável).
7. Indique explicitamente quando uma prática é PROIBIDA no país selecionado.
8. Cite SEMPRE a referência legal aplicável (Reg. UE, IN MAPA, etc.).
9. Em "catalogo_ref", indique o ID do defeito do CATÁLOGO abaixo (ex: "DEF-02") que melhor corresponde ao diagnóstico. Se o diagnóstico NÃO corresponder a nenhum defeito do catálogo, use null — nunca invente um ID.

════════════════════════════════════════════════════════
ESTRUTURA JSON OBRIGATÓRIA
════════════════════════════════════════════════════════
{
  "diagnosticos": [
    {
      "posicao": 1,
      "defeito": "nome do defeito",
      "catalogo_ref": "DEF-XX do catálogo ou null",
      "confianca": "alta|media|baixa",
      "compostos_marcadores": ["composto1 (valor limiar)", "composto2"],
      "causa": "explicação técnica da causa",
      "confirmacao_analitica": {
        "metodo_principal": "método e interpretação dos valores",
        "metodo_rapido": "método alternativo mais acessível"
      },
      "correcao": "BASE TEÓRICA: [mecanismo]. PRODUTOS: [produto + dose]; [outro produto + dose]. RESTRIÇÕES: [o que é proibido].",
      "proibicoes": "o que NÃO pode fazer neste país (ou null se não aplicável)",
      "referencia_legal": "Regulamento/Instrução Normativa aplicável",
      "reversivel": true|false,
      "urgencia": "imediata|moderada|preventiva"
    }
  ],
  "observacoes": "recomendações adicionais, interações entre defeitos, notas de prevenção",
  "confirmacao_prioritaria": "o exame analítico mais importante a realizar em primeiro lugar"
}

════════════════════════════════════════════════════════
BASE LEGAL — PORTUGAL / UNIÃO EUROPEIA
════════════════════════════════════════════════════════

SO₂ TOTAL (máximos, mg/L):
  Tinto seco (<5 g/L açúcar): 150 mg/L | Branco/rosé seco: 200 mg/L
  Tinto com açúcar (≥5 g/L): 200 mg/L | Branco/rosé com açúcar: 250 mg/L
  Botrytis/colheita tardia: 300 mg/L | Biológico tinto: 100 mg/L
  Biológico branco/rosé: 150 mg/L | Espumante qualidade: 185 mg/L
  [Reg. Delegado UE 2019/934, Anexo I-B]

SO₂ LIVRE RECOMENDADO (manter SO₂ molecular ≥ 0,4 mg/L):
  pH 3,0→7 mg/L | pH 3,3→13 mg/L | pH 3,5→21 mg/L
  pH 3,7→33 mg/L | pH 3,8→42 mg/L | pH 4,0→66 mg/L
  FÓRMULA: SO₂mol = SO₂livre / (1 + 10^(pH−1,81))

ACIDIFICAÇÃO: Mosto máx.1,50 g/L; Vinho máx.2,50 g/L (equiv. tartárico)
  Autorizados: tartárico, málico, láctico | PROIBIDO: ácido cítrico como acidificante

DESACIDIFICAÇÃO: Máx.1,00 g/L (equiv. tartárico)
  Autorizados: KHCO₃, CaCO₃, tartarato neutro de K, FML
  PROIBIDO Zona C (Portugal): ácido tartárico na desacidificação

ENRIQUECIMENTO: Portugal (Zona C) — PROIBIDA chaptalização com sacarose
  Autorizados: MCR (Brix mín.61,7%; pH máx.5,0) e MC

ACIDEZ VOLÁTIL máximos: Tinto 20 mEq/L | Branco/rosé 18 mEq/L

CLARIFICAÇÃO RESTRIÇÕES: Carvão activado PROIBIDO em TINTOS [Reg. Delegado UE 2019/934]
  Esferas PVI/PVP: autorizadas para fenóis voláteis [Reg.UE 2024/3085]
  Quitosano: 10 g/hL máx. [Reg. Delegado UE 2019/934] | Ác.ascórbico: 250 mg/L máx. (sempre com SO₂)
  Lisozima: 500 mg/L máx. | DMDC (Velcorin): 200 mg/L máx.
  OTA: limite 2 µg/L [Reg.CE 123/2005] | Cu: máx.1 mg/L
  Sorbato: NUNCA com bactérias lácticas activas → gosto de gerânio

════════════════════════════════════════════════════════
BASE LEGAL — BRASIL (IN MAPA 14/2018 + Portaria 723/2024)
════════════════════════════════════════════════════════

SO₂ TOTAL: 150 mg/L (todos os tipos) | TAV: 8,6–14,0% v/v
ACIDEZ TOTAL: 40–130 mEq/L | ACIDEZ VOLÁTIL: 20 mEq/L (todas as cores)
ÁCIDO CÍTRICO: máx.1,0 g/L (AUTORIZADO — diferente da UE)
ESR (tinto): mín.21 g/L | (branco/rosé): mín.16 g/L
CHAPTALIZAÇÃO: Reservado +2,0% máx. | Reserva +1,0% máx. | Gran Reserva e Nobre: PROIBIDA
CARVÃO ACTIVADO: AUTORIZADO em tintos (diferente da UE)
ÁCIDO ASCÓRBICO: máx.150 mg/L | Cu: máx.1 mg/L

════════════════════════════════════════════════════════
CATÁLOGO DE PRODUTOS ENOLÓGICOS AUTORIZADOS
════════════════════════════════════════════════════════
(Use estes produtos nas recomendações de correção com doses específicas)

${prodTxt}

════════════════════════════════════════════════════════
BASE DE CONHECIMENTO — ${defeitos.length} DEFEITOS DO VINHO
════════════════════════════════════════════════════════

${defeitosTxt}

════════════════════════════════════════════════════════
INTERAÇÕES DEFEITO-TRATAMENTO CRÍTICAS
════════════════════════════════════════════════════════
- AV alta + Brettanomyces: tratar Brett primeiro (adsorção/esferas); depois AV
- Oxidação + Redução simultâneos: contraditórios — rever diagnóstico
- TCA: irreversível em garrafa; mascara todos os outros aromas
- Casse Férrica: NUNCA ácido ascórbico antes de arejar — precipitação garantida
- Gosto de Gerânio: causa ÚNICA = sorbato + bactérias lácticas; irreversível
- H₂S vs Mercaptanos: H₂S melhora com arejamento; mercaptanos requerem CuSO₄ (0,5–1,0 g/hL, Cu final ≤1 mg/L)
- SO₂ excessivo + pH baixo: amplifica SO₂ molecular — calcular antes de qualquer adição
- Lisozima: proteína catiónica, pode precipitar com taninos — preferir em brancos/rosés
- Ferrocianeto de potássio: EXIGE análise cianeto residual (<0,5 mg/L HCN); uso restrito a enólogos licenciados
- Ácido ascórbico: NUNCA sem SO₂ — torna-se pró-oxidante
- Filante (Graisse): agitação mecânica vigorosa quebra fisicamente as cadeias de glucanas antes de qualquer tratamento

Seja PRECISO. Para as correções: especifique BASE TEÓRICA + PRODUTOS COM DOSES + RESTRIÇÕES LEGAIS.`

const tsContent = `// AUTO-GERADO por scripts/gen-system-prompt.js — editar os JSON e executar: npm run gen-prompt
// ${defeitos.length} defeitos · ${Object.keys(produtos).length} categorias de produtos
const SYSTEM_PROMPT = ${JSON.stringify(prompt)}

export default SYSTEM_PROMPT
`

writeFileSync(outFile, tsContent, 'utf8')
console.log(`✅ ${outFile}`)
console.log(`   ${defeitos.length} defeitos · ${Object.keys(produtos).length} categorias · ${prompt.length} chars`)

// Índice mínimo do catálogo (id + nome) — evita arrastar defeitos.json inteiro
// para o bundle principal só para validar catalogo_ref
const catalogoIndex = defeitos.map((d) => ({ id: d.id, nome: d.nome }))
const catalogoFile = join(__dir, '../src/data/catalogo.json')
writeFileSync(catalogoFile, JSON.stringify(catalogoIndex, null, 2) + '\n', 'utf8')
console.log(`✅ ${catalogoFile} (${catalogoIndex.length} entradas)`)
