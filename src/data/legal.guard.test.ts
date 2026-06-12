import { describe, it, expect } from 'vitest'
import ptue from './limites_pt_ue.json'
import br from './limites_brasil.json'

// Guarda anti-regressão: regulamentos revogados ou simplesmente errados que
// JÁ apareceram nos dados e não podem voltar (ver auditoria legal de 2026-06).
const REGS_PROIBIDOS: { padrao: RegExp; motivo: string }[] = [
  { padrao: /606\/2009/, motivo: 'Reg. CE 606/2009 foi REVOGADO pelo Reg. Delegado UE 2019/934' },
  { padrao: /2018\/1629/, motivo: 'Reg. UE 2018/1629 é sobre doenças animais — não tem relação com vinho' },
]

function todosOsTextos(obj: unknown): string {
  return JSON.stringify(obj)
}

describe('guarda de referências legais', () => {
  const corpus = todosOsTextos(ptue) + todosOsTextos(br)

  for (const { padrao, motivo } of REGS_PROIBIDOS) {
    it(`não cita ${padrao.source} — ${motivo}`, () => {
      expect(corpus).not.toMatch(padrao)
    })
  }

  it('os dados são gerados a partir da fonte canónica (têm _meta._generated)', () => {
    expect((ptue as { _meta?: { _generated?: boolean } })._meta?._generated).toBe(true)
    expect((br as { _meta?: { _generated?: boolean } })._meta?._generated).toBe(true)
  })
})
