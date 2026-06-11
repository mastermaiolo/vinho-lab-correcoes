import { describe, it, expect } from 'vitest'
import { extractJSON } from './aiClient'

const OBJ = '{"diagnosticos": [], "observacoes": "ok"}'

describe('extractJSON', () => {
  it('devolve JSON puro tal-e-qual', () => {
    expect(extractJSON(OBJ)).toBe(OBJ)
  })

  it('remove fence ```json', () => {
    expect(extractJSON('```json\n' + OBJ + '\n```')).toBe(OBJ)
  })

  it('remove fence ```JSON (maiúsculas)', () => {
    expect(extractJSON('```JSON\n' + OBJ + '\n```')).toBe(OBJ)
  })

  it('remove fence sem linguagem', () => {
    expect(extractJSON('```\n' + OBJ + '\n```')).toBe(OBJ)
  })

  it('extrai objecto rodeado de prosa (modelos de reasoning)', () => {
    const texto = 'Okay, the user wants a diagnosis.\n' + OBJ + '\nHope this helps!'
    expect(extractJSON(texto)).toBe(OBJ)
  })

  it('extrai objecto com prefixo de texto antes do fence', () => {
    const texto = 'Aqui está o diagnóstico:\n```json\n' + OBJ + '\n```'
    expect(extractJSON(texto)).toBe(OBJ)
  })

  it('o resultado de cada variante faz JSON.parse sem erro', () => {
    const variantes = [
      OBJ,
      '```json\n' + OBJ + '\n```',
      '```JSON\n' + OBJ + '\n```',
      'texto antes ' + OBJ,
    ]
    for (const v of variantes) {
      expect(() => JSON.parse(extractJSON(v))).not.toThrow()
    }
  })
})
