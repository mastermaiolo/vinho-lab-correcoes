import { describe, it, expect } from 'vitest'
import { extractJSON, isValidDiagnostico } from './aiClient'

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

describe('isValidDiagnostico', () => {
  const valido = {
    diagnosticos: [{ defeito: 'Acidez volátil', correcao: 'Arejamento + SO₂' }],
    observacoes: 'ok',
    confirmacao_prioritaria: 'GC',
  }

  it('aceita resposta com estrutura correcta', () => {
    expect(isValidDiagnostico(valido)).toBe(true)
  })

  it('aceita diagnosticos com nulls desde que haja um real', () => {
    expect(isValidDiagnostico({ diagnosticos: [valido.diagnosticos[0], null, null] })).toBe(true)
  })

  it('rejeita array em vez de objecto', () => {
    expect(isValidDiagnostico([])).toBe(false)
  })

  it('rejeita diagnosticos em falta', () => {
    expect(isValidDiagnostico({ observacoes: 'x' })).toBe(false)
  })

  it('rejeita diagnosticos não-array', () => {
    expect(isValidDiagnostico({ diagnosticos: 'texto' })).toBe(false)
  })

  it('rejeita item sem defeito ou correcao', () => {
    expect(isValidDiagnostico({ diagnosticos: [{ defeito: 'X' }] })).toBe(false)
    expect(isValidDiagnostico({ diagnosticos: [{ correcao: 'Y' }] })).toBe(false)
  })

  it('rejeita lista só com nulls', () => {
    expect(isValidDiagnostico({ diagnosticos: [null, null] })).toBe(false)
  })

  it('rejeita null e tipos primitivos', () => {
    expect(isValidDiagnostico(null)).toBe(false)
    expect(isValidDiagnostico('x')).toBe(false)
    expect(isValidDiagnostico(42)).toBe(false)
  })
})
