import { describe, it, expect } from 'vitest'
import {
  so2Molecular,
  so2LivreParaMolecular,
  calcSO2,
  calcAcidificacao,
  calcDesacidificacao,
  calcEnriquecimento,
} from './calculadoras'

describe('so2Molecular (Sudraud-Chauvet)', () => {
  it('retorna ~0,4 mg/L para 26,3 mg/L livre a pH 3,6', () => {
    expect(so2Molecular(26.3, 3.6)).toBeCloseTo(0.4, 1)
  })

  it('aumenta com a diminuição do pH', () => {
    expect(so2Molecular(20, 3.0)).toBeGreaterThan(so2Molecular(20, 3.5))
  })

  it('é zero quando so2Livre é zero', () => {
    expect(so2Molecular(0, 3.5)).toBe(0)
  })
})

describe('so2LivreParaMolecular', () => {
  it('inverso de so2Molecular', () => {
    const ph = 3.6
    const livre = so2LivreParaMolecular(0.4, ph)
    expect(so2Molecular(livre, ph)).toBeCloseTo(0.4, 5)
  })
})

describe('calcSO2', () => {
  it('calcula gAtivo corretamente para 10 hL, subida de 18→35 mg/L', () => {
    const r = calcSO2(10, 18, 35, 'gas')
    // delta = 17 mg/L = 0,017 g/L; volume = 1000 L; gAtivo = 17 g
    expect(r.gAtivo).toBeCloseTo(17, 5)
    expect(r.doseProduto).toBeCloseTo(17, 5) // gas: fator 1,0
  })

  it('dose KMS = gAtivo / 0,572', () => {
    const r = calcSO2(10, 18, 35, 'kms')
    expect(r.doseProduto).toBeCloseTo(r.gAtivo / 0.572, 5)
  })

  it('dose solução 6% em mL = gAtivo / 0,06', () => {
    const r = calcSO2(10, 18, 35, 'sol6')
    expect(r.doseProduto).toBeCloseTo(r.gAtivo / 0.06, 5)
  })
})

describe('calcAcidificacao', () => {
  it('subida de 1 g/L AT com ácido tartárico: 100 g/hL', () => {
    const r = calcAcidificacao(1, 5.0, 6.0, 'tartarico')
    expect(r.doseGHL).toBeCloseTo(100, 5)
    expect(r.deltaAT).toBeCloseTo(1.0, 5)
  })

  it('dose total = doseGHL × volume (hL)', () => {
    const r = calcAcidificacao(10, 5.0, 6.0, 'tartarico')
    expect(r.doseTotalG).toBeCloseTo(r.doseGHL * 10, 5)
  })

  it('ácido málico tem fator 0,89', () => {
    const tart = calcAcidificacao(1, 5.0, 6.0, 'tartarico')
    const mal = calcAcidificacao(1, 5.0, 6.0, 'malico')
    expect(mal.doseGHL).toBeCloseTo(tart.doseGHL * 0.89, 5)
  })

  it('ácido láctico tem fator 1,36', () => {
    const tart = calcAcidificacao(1, 5.0, 6.0, 'tartarico')
    const lac = calcAcidificacao(1, 5.0, 6.0, 'lactico')
    expect(lac.doseGHL).toBeCloseTo(tart.doseGHL * 1.36, 5)
  })

  it('ácido cítrico tem fator 0,93', () => {
    const tart = calcAcidificacao(1, 5.0, 6.0, 'tartarico')
    const cit = calcAcidificacao(1, 5.0, 6.0, 'citrico')
    expect(cit.doseGHL).toBeCloseTo(tart.doseGHL * 0.93, 5)
  })
})

describe('calcDesacidificacao', () => {
  it('descida de 1 g/L AT com KHCO₃: 67 g/hL', () => {
    const r = calcDesacidificacao(1, 7.0, 6.0, 'khco3')
    expect(r.doseGHL).toBeCloseTo(67, 5)
    expect(r.deltaAT).toBeCloseTo(1.0, 5)
  })

  it('CaCO₃ tem fator menor (0,5)', () => {
    const khco3 = calcDesacidificacao(1, 7.0, 6.0, 'khco3')
    const caco3 = calcDesacidificacao(1, 7.0, 6.0, 'caco3')
    expect(caco3.doseGHL).toBeLessThan(khco3.doseGHL)
  })
})

describe('calcEnriquecimento', () => {
  it('sacarose: volume em kg proporcional ao delta TAV e volume', () => {
    const r = calcEnriquecimento(10, 11.5, 13.0, 'sacarose')
    // delta = 1,5; volume = 1000 L; dose = 1,5 × 17 × 1000 / 1000 = 25,5 kg
    expect(r.dose).toBeCloseTo(25.5, 5)
    expect(r.unidade).toBe('kg')
  })

  it('MCR retorna unidade em L', () => {
    const r = calcEnriquecimento(10, 11.5, 13.0, 'mcr')
    expect(r.unidade).toBe('L')
    expect(r.dose).toBeGreaterThan(0)
  })
})
