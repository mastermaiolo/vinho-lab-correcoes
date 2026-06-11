import { DiagnosticoResponse } from './aiClient'
import { FormData } from './promptBuilder'

export interface EntradaHistorico {
  id: string
  ts: number
  jurisdicao: 'ptue' | 'br'
  tipo: string
  fase: string
  sintomas: string[]
  resultado: DiagnosticoResponse
  formSnapshot: Partial<FormData>
}

const KEY = 'vl_historico'
const MAX = 10

export function carregarHistorico(): EntradaHistorico[] {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function guardarHistorico(entrada: Omit<EntradaHistorico, 'id' | 'ts'>): EntradaHistorico {
  const lista = carregarHistorico()
  const nova: EntradaHistorico = {
    ...entrada,
    id: Math.random().toString(36).slice(2, 9),
    ts: Date.now(),
  }
  lista.unshift(nova)
  if (lista.length > MAX) lista.splice(MAX)
  sessionStorage.setItem(KEY, JSON.stringify(lista))
  return nova
}

export function limparHistorico() {
  sessionStorage.removeItem(KEY)
}
