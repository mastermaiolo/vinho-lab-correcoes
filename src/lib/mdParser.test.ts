import { describe, it, expect } from 'vitest'
import { parseMdBoletim, isSessionCompanheiro, parseSessionCompanheiro } from './mdParser'

// Fixture representativa de um boletim .md exportado pelo vinho-lab-companheiro
const BOLETIM_MD = `# Boletim Analítico — Vinho-Lab

| Campo | Valor |
|---|---|
| Amostra | Tinto Reserva 2023 |
| Lote | L-042 |
| Data | 2026-05-10 |

**Tipo de vinho:** Tinto

| Parâmetro | Valor | Limite |
|---|---|---|
| Título alcoólico | 13,5 % vol | — |
| pH | 3,72 | — |
| SO₂ livre | 22 mg/L | — |
| SO₂ total | 95 mg/L | — |
| Acidez volátil | 14,2 mEq/L | 20 |
| Acidez total | 72 mEq/L | — |
| Extrato seco | 28,4 g/L | — |

Veredicto: conforme IVV.
`

describe('parseMdBoletim', () => {
  const r = parseMdBoletim(BOLETIM_MD)

  it('extrai identificação', () => {
    expect(r.amostra).toBe('Tinto Reserva 2023')
    expect(r.lote).toBe('L-042')
  })

  it('extrai tipo de vinho', () => {
    expect(r.tipo).toBe('Tinto seco')
  })

  it('extrai parâmetros numéricos com vírgula decimal', () => {
    expect(r.tav).toBe('13.5')
    expect(r.ph).toBe('3.72')
    expect(r.av).toBe('14.2')
    expect(r.esr).toBe('28.4')
  })

  it('extrai SO₂ livre e total', () => {
    expect(r.so2Livre).toBe('22')
    expect(r.so2Total).toBe('95')
  })

  it('detecta jurisdição PT/UE quando menciona IVV', () => {
    expect(r.jurisdicao).toBe('ptue')
  })

  it('detecta BR quando só menciona MAPA', () => {
    const br = parseMdBoletim('| Amostra | X |\nConforme MAPA.')
    expect(br.jurisdicao).toBe('br')
  })

  it('devolve campos undefined em texto vazio sem lançar erro', () => {
    const vazio = parseMdBoletim('')
    expect(vazio.tav).toBeUndefined()
    expect(vazio.ph).toBeUndefined()
  })
})

// Fixture representativa de uma sessão .json do companheiro
const SESSION = {
  kind: 'vinho-lab/session',
  tipoId: 'tinto',
  brCat: undefined,
  meta: { amostra: 'Amostra A', lote: 'L-1', data: '2026-05-10' },
  measurements: {
    tav: { value: 12.8, unit: '% vol' },
    ph: { value: 3.55, unit: '' },
    so2_livre: { value: 30, unit: 'mg/L' },
    so2_total: { value: 110, unit: 'mg/L' },
    acidez_volatil: { value: 11, unit: 'mEq/L' },
    acidez_total: { value: 68, unit: 'mEq/L' },
    esr: { value: null, unit: 'g/L' },
  },
}

describe('isSessionCompanheiro', () => {
  it('aceita kind correcto', () => {
    expect(isSessionCompanheiro(SESSION)).toBe(true)
  })

  it('rejeita objectos sem kind ou com kind errado', () => {
    expect(isSessionCompanheiro({})).toBe(false)
    expect(isSessionCompanheiro({ kind: 'outro' })).toBe(false)
    expect(isSessionCompanheiro(null)).toBe(false)
    expect(isSessionCompanheiro('string')).toBe(false)
  })
})

describe('parseSessionCompanheiro', () => {
  const r = parseSessionCompanheiro(SESSION)

  it('extrai meta', () => {
    expect(r.amostra).toBe('Amostra A')
    expect(r.lote).toBe('L-1')
  })

  it('mapeia tipoId para tipo do formulário', () => {
    expect(r.tipo).toBe('Tinto seco')
  })

  it('extrai medições como strings', () => {
    expect(r.tav).toBe('12.8')
    expect(r.ph).toBe('3.55')
    expect(r.so2Livre).toBe('30')
    expect(r.so2Total).toBe('110')
    expect(r.av).toBe('11')
    expect(r.acidezTotal).toBe('68')
  })

  it('ignora medições com value null', () => {
    expect(r.esr).toBeUndefined()
  })

  it('tipoId desconhecido cai no default sem lançar erro', () => {
    const x = parseSessionCompanheiro({ kind: 'vinho-lab/session', tipoId: 'inexistente' })
    expect(x.tipo).toBe('Tinto seco')
  })
})
