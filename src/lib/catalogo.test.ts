import { describe, it, expect } from 'vitest'
import { validarCatalogo } from './catalogo'

describe('validarCatalogo', () => {
  it('aceita um ID válido do catálogo e devolve o nome', () => {
    const r = validarCatalogo('DEF-02')
    expect(r.emCatalogo).toBe(true)
    expect(r.id).toBe('DEF-02')
    expect(r.nome).toBeTruthy()
  })

  it('rejeita ID inexistente (inventado pela IA)', () => {
    expect(validarCatalogo('DEF-99').emCatalogo).toBe(false)
    expect(validarCatalogo('XYZ').emCatalogo).toBe(false)
  })

  it('trata null/undefined como fora do catálogo', () => {
    expect(validarCatalogo(null).emCatalogo).toBe(false)
    expect(validarCatalogo(undefined).emCatalogo).toBe(false)
  })

  it('não faz match parcial nem case-insensitive', () => {
    expect(validarCatalogo('def-02').emCatalogo).toBe(false)
    expect(validarCatalogo('DEF-0').emCatalogo).toBe(false)
  })
})
