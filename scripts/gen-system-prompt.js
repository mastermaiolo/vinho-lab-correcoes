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
const outFile = join(__dir, '../src/lib/systemPromptGenerated.ts')

const defeitos = JSON.parse(readFileSync(join(dataDir, 'defeitos.json'), 'utf8'))
const produtos = JSON.parse(readFileSync(join(dataDir, 'produtos_correcao.json'), 'utf8'))
const limitesPtUe = JSON.parse(readFileSync(join(dataDir, 'limites_pt_ue.json'), 'utf8'))
const limitesBr = JSON.parse(readFileSync(join(dataDir, 'limites_brasil.json'), 'utf8'))

function defeitoParaTexto(d) {
  const compostos = (d.compostos_marcadores ?? [])
    .map((c) => (typeof c === 'string' ? c : `${c.nome}${c.formula ? ` (${c.formula})` : ''}${c.limiar_percepcao ? ` — limiar: ${c.limiar_percepcao}` : ''}`))
    .join('; ')

  const linhas = [
    `### ${d.id}: ${d.nome} (${d.categoria})`,
    d.causa ? `Causa: ${d.causa}` : '',
    compostos ? `Compostos marcadores: ${compostos}` : '',
    d.descritores_sensoriais ? `Descritores: ${d.descritores_sensoriais.join(', ')}` : '',
    d.confirmacao_analitica?.metodo_principal ? `Análise: ${d.confirmacao_analitica.metodo_principal}` : '',
    d.correcao?.pt_ue ? `Correção PT/UE: ${d.correcao.pt_ue}` : '',
    d.correcao?.br ? `Correção BR: ${d.correcao.br}` : '',
    d.reversivel !== undefined ? `Reversível: ${d.reversivel}` : '',
  ]
  return linhas.filter(Boolean).join('\n')
}

function limitesParaTexto(obj, jurisdicao) {
  const linhas = [`## Limites legais ${jurisdicao}`]
  for (const [cat, dados] of Object.entries(obj)) {
    if (typeof dados === 'object' && dados !== null) {
      linhas.push(`\n### ${cat}`)
      for (const [k, v] of Object.entries(dados)) {
        if (typeof v !== 'object') linhas.push(`  ${k}: ${v}`)
        else linhas.push(`  ${k}: ${JSON.stringify(v)}`)
      }
    }
  }
  return linhas.join('\n')
}

const defeitosTexto = defeitos.map(defeitoParaTexto).join('\n\n')
const limitesPtUeTexto = limitesParaTexto(limitesPtUe, 'PT/UE')
const limitesBrTexto = limitesParaTexto(limitesBr, 'Brasil')

const saida = `// AUTO-GERADO por scripts/gen-system-prompt.js — não editar manualmente
// Execute: npm run gen-prompt

export const SYSTEM_PROMPT_GENERATED = \`
════════════════════════════════════════════════════════
BASE DE CONHECIMENTO — DEFEITOS DO VINHO (${defeitos.length} defeitos)
════════════════════════════════════════════════════════

${defeitosTexto}

════════════════════════════════════════════════════════
${limitesPtUeTexto}

════════════════════════════════════════════════════════
${limitesBrTexto}
\`
`

writeFileSync(outFile, saida, 'utf8')
console.log(`✅ Gerado: ${outFile}`)
console.log(`   ${defeitos.length} defeitos · PT/UE limits · BR limits`)
console.log(`   Integre SYSTEM_PROMPT_GENERATED no systemPrompt.ts se necessário.`)
