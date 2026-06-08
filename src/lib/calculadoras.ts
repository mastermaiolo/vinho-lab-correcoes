// Fórmula Sudraud-Chauvet
export function so2Molecular(so2Livre: number, ph: number): number {
  return so2Livre / (1 + Math.pow(10, ph - 1.81))
}

// SO₂ livre necessário para atingir alvo molecular a dado pH
export function so2LivreParaMolecular(molecular: number, ph: number): number {
  return molecular * (1 + Math.pow(10, ph - 1.81))
}

export type ProdutoSO2 = 'kms' | 'khso3' | 'gas' | 'sol6'

const FATORES_SO2: Record<ProdutoSO2, number> = {
  kms: 0.572,
  khso3: 0.538,
  gas: 1.0,
  sol6: 0.06,
}

export const NOMES_PRODUTO_SO2: Record<ProdutoSO2, string> = {
  kms: 'Metabissulfito de K (KMS)',
  khso3: 'Bissulfito de K (KHSO₃)',
  gas: 'SO₂ gasoso',
  sol6: 'Solução aquosa 6%',
}

export const UNIDADE_PRODUTO_SO2: Record<ProdutoSO2, string> = {
  kms: 'g',
  khso3: 'g',
  gas: 'g',
  sol6: 'mL',
}

export function calcSO2(
  volumeHL: number,
  so2Atual: number,
  so2Desejado: number,
  produto: ProdutoSO2
): { gAtivo: number; doseProduto: number } {
  const deltaGL = (so2Desejado - so2Atual) / 1000 // mg/L → g/L
  const gAtivo = deltaGL * volumeHL * 100
  const fator = FATORES_SO2[produto]
  return { gAtivo, doseProduto: gAtivo / fator }
}

export type AcidoAcidificacao = 'tartarico' | 'malico' | 'lactico' | 'citrico'

// Fatores g/L de ácido por 1 g/L de subida em ác. tartárico equiv.
const FATOR_ACIDO: Record<AcidoAcidificacao, number> = {
  tartarico: 1.0,
  malico: 1.12,
  lactico: 1.24,
  citrico: 1.43,
}

export const NOMES_ACIDO: Record<AcidoAcidificacao, string> = {
  tartarico: 'Ác. tartárico',
  malico: 'Ác. málico',
  lactico: 'Ác. láctico',
  citrico: 'Ác. cítrico',
}

export function calcAcidificacao(
  volumeHL: number,
  atAtual: number, // g/L em tartárico
  atDesejado: number,
  acido: AcidoAcidificacao
): { doseGHL: number; doseTotalG: number; deltaAT: number } {
  const deltaAT = atDesejado - atAtual
  const doseGHL = deltaAT * FATOR_ACIDO[acido] * 100 // por hL
  return { doseGHL, doseTotalG: doseGHL * volumeHL, deltaAT }
}

export type AgenteDesacid = 'khco3' | 'caco3' | 'tartarato_k'

const FATOR_DESACID: Record<AgenteDesacid, number> = {
  khco3: 0.67,
  caco3: 0.50,
  tartarato_k: 0.85,
}

export const NOMES_DESACID: Record<AgenteDesacid, string> = {
  khco3: 'Bicarbonato de K (KHCO₃)',
  caco3: 'Carbonato de Ca (CaCO₃)',
  tartarato_k: 'Tartarato neutro de K',
}

export function calcDesacidificacao(
  volumeHL: number,
  atAtual: number,
  atDesejado: number,
  agente: AgenteDesacid
): { doseGHL: number; doseTotalG: number; deltaAT: number } {
  const deltaAT = atAtual - atDesejado
  const doseGHL = deltaAT * FATOR_DESACID[agente] * 100
  return { doseGHL, doseTotalG: doseGHL * volumeHL, deltaAT }
}

export type MetodoEnriquecimento = 'sacarose' | 'mcr'

export function calcEnriquecimento(
  volumeHL: number,
  tavAtual: number,
  tavDesejado: number,
  metodo: MetodoEnriquecimento
): { dose: number; unidade: string } {
  const deltaTAV = tavDesejado - tavAtual
  const volumeL = volumeHL * 100
  if (metodo === 'sacarose') {
    // ~17 g/L por +1% vol
    return { dose: deltaTAV * 17 * volumeL / 1000, unidade: 'kg' }
  } else {
    // MCR 700 g/L: ~24 mL/L por +1% vol
    return { dose: deltaTAV * 24 * volumeL / 1000, unidade: 'L' }
  }
}
