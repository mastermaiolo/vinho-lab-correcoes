const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export interface DiagnosticoItem {
  posicao: number
  defeito: string
  confianca: 'alta' | 'media' | 'baixa'
  compostos_marcadores: string[]
  causa: string
  confirmacao_analitica: {
    metodo_principal: string
    metodo_rapido: string
  }
  correcao: string
  proibicoes: string | null
  referencia_legal: string
  reversivel: boolean
  urgencia: 'imediata' | 'moderada' | 'preventiva'
}

export interface DiagnosticoResponse {
  diagnosticos: (DiagnosticoItem | null)[]
  observacoes: string
  confirmacao_prioritaria: string
}

export async function chamarGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<DiagnosticoResponse> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2048,
        temperature: 0.2,
      },
    }),
  })

  if (res.status === 400) throw new Error('Pedido inválido (400). Verifique a chave API e os dados.')
  if (res.status === 401 || res.status === 403) throw new Error('Chave API inválida ou sem permissão (401/403).')
  if (res.status === 429) throw new Error('Limite de pedidos atingido (429). Aguarde alguns segundos e tente novamente.')
  if (!res.ok) throw new Error(`Erro da API Gemini: ${res.status} ${res.statusText}`)

  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  try {
    return JSON.parse(text) as DiagnosticoResponse
  } catch {
    throw new Error('Resposta da IA não é JSON válido. Tente novamente.')
  }
}
