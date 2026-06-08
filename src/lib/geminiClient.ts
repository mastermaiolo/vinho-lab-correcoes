const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

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
  userPrompt: string,
  retries = 3,
  delay = 1500
): Promise<DiagnosticoResponse> {
  for (let i = 0; i < retries; i++) {
    try {
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

      if (res.status === 429) {
        if (i === retries - 1) {
          throw new Error('Limite de pedidos atingido (429) após várias tentativas. Aguarde um momento e tente novamente. Dica: Configurar uma conta com faturamento (Pay-as-you-go) no Google AI Studio aumenta significativamente seus limites de requisição.')
        }
        // Aguarda com recuo exponencial antes de tentar novamente (1.5s, 3s, 6s...)
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
        continue
      }

      if (res.status === 400) throw new Error('Pedido inválido (400). Verifique a chave API e os dados.')
      if (res.status === 401 || res.status === 403) throw new Error('Chave API inválida ou sem permissão (401/403).')
      if (!res.ok) throw new Error(`Erro da API Gemini: ${res.status} ${res.statusText}`)

      const data = await res.json()
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

      try {
        return JSON.parse(text) as DiagnosticoResponse
      } catch {
        throw new Error('Resposta da IA não é JSON válido. Tente novamente.')
      }
    } catch (error) {
      if (i === retries - 1) throw error
      // Se for um erro de rede ou 429, aguarda e tenta novamente
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('Network') || error.message.includes('fetch'))) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
        continue
      }
      throw error
    }
  }
  throw new Error('Falha ao conectar com a API Gemini.')
}
