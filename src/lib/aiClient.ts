export type AIProvider = 'gemini' | 'claude' | 'openai' | 'openrouter'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model?: string  // custom model — usado pelo OpenRouter; outros providers ignoram
}

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

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Google Gemini',
  claude: 'Anthropic Claude',
  openai: 'OpenAI',
  openrouter: 'OpenRouter',
}

export const PROVIDER_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.5-flash',
  claude: 'claude-haiku-4-5-20251001',
  openai: 'gpt-4o-mini',
  openrouter: 'google/gemma-4-26b-a4b-it:free',
}

export const PROVIDER_KEY_HINTS: Record<AIProvider, string> = {
  gemini: 'AIzaSy...',
  claude: 'sk-ant-...',
  openai: 'sk-...',
  openrouter: 'sk-or-v1-...',
}

// Modelos sugeridos no selector do OpenRouter (free + custo baixo)
export const OPENROUTER_MODELS: { id: string; label: string; free: boolean }[] = [
  { id: 'google/gemma-4-26b-a4b-it:free',              label: 'Gemma 4 26B (Google) — free',          free: true },
  { id: 'google/gemini-2.0-flash-exp:free',             label: 'Gemini 2.0 Flash Exp (Google) — free', free: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free',       label: 'Llama 3.3 70B (Meta) — free',          free: true },
  { id: 'deepseek/deepseek-chat-v3-0324:free',          label: 'DeepSeek Chat V3 — free',              free: true },
  { id: 'mistralai/mistral-7b-instruct:free',           label: 'Mistral 7B — free',                    free: true },
  { id: 'google/gemini-2.5-flash',                      label: 'Gemini 2.5 Flash (Google) — pago',     free: false },
  { id: 'anthropic/claude-haiku-4-5',                   label: 'Claude Haiku 4.5 — pago',              free: false },
  { id: 'openai/gpt-4o-mini',                           label: 'GPT-4o Mini (OpenAI) — pago',          free: false },
]

// Chave embutida (compilada no bundle a partir de .env.local — não vai ao git)
export const OPENROUTER_DEFAULT_KEY: string =
  (import.meta as { env?: Record<string, string> }).env?.VITE_OPENROUTER_DEFAULT_KEY ?? ''

// Strip markdown code blocks and extract raw JSON
function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const obj = text.match(/\{[\s\S]*\}/)
  if (obj) return obj[0]
  return text.trim()
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function callGemini(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2048, temperature: 0.2 },
      }),
    }
  )
  if (res.status === 429) throw Object.assign(new Error('rate_limit'), { is429: true })
  if (res.status === 400) throw new Error('Pedido inválido (400). Verifique a chave API Gemini e os dados.')
  if (res.status === 401 || res.status === 403) throw new Error('Chave API Gemini inválida ou sem permissão.')
  if (!res.ok) throw new Error(`Erro Gemini: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callClaude(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: PROVIDER_MODELS.claude,
      max_tokens: 2048,
      temperature: 0.2,
      system: system + '\n\nResponda EXCLUSIVAMENTE em JSON válido, sem markdown.',
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (res.status === 429) throw Object.assign(new Error('rate_limit'), { is429: true })
  if (res.status === 401) throw new Error('Chave API Anthropic inválida (401).')
  if (!res.ok) throw new Error(`Erro Anthropic: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data?.content?.[0]?.text ?? ''
}

async function callOpenAI(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: PROVIDER_MODELS.openai,
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (res.status === 429) throw Object.assign(new Error('rate_limit'), { is429: true })
  if (res.status === 401) throw new Error('Chave API OpenAI inválida (401).')
  if (!res.ok) throw new Error(`Erro OpenAI: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

async function callOpenRouter(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      // X-Title é o único header extra permitido pelo CORS do OpenRouter a partir do browser.
      // HTTP-Referer como header custom dispara preflight que o OpenRouter rejeita;
      // o browser já envia o Referer real automaticamente.
      'X-Title': 'Vinho-Lab Correcoes',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: system + '\n\nResponda EXCLUSIVAMENTE em JSON válido, sem markdown.' },
        { role: 'user', content: user },
      ],
    }),
  })
  if (res.status === 429) throw Object.assign(new Error('rate_limit'), { is429: true })
  if (res.status === 401 || res.status === 403) throw new Error('Chave OpenRouter inválida ou sem permissão.')
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(`Erro OpenRouter: ${res.status} — ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  // OpenRouter pode devolver erro em JSON mesmo com status 200
  if (data.error) throw new Error(`OpenRouter: ${data.error.message ?? JSON.stringify(data.error)}`)
  return data?.choices?.[0]?.message?.content ?? ''
}

export async function chamarIA(
  config: AIConfig,
  systemPrompt: string,
  userPrompt: string,
  retries = 3,
  delay = 1500
): Promise<DiagnosticoResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      let text: string
      if (config.provider === 'gemini') {
        text = await callGemini(config.apiKey, systemPrompt, userPrompt)
      } else if (config.provider === 'claude') {
        text = await callClaude(config.apiKey, systemPrompt, userPrompt)
      } else if (config.provider === 'openrouter') {
        const model = config.model ?? PROVIDER_MODELS.openrouter
        text = await callOpenRouter(config.apiKey, model, systemPrompt, userPrompt)
      } else {
        text = await callOpenAI(config.apiKey, systemPrompt, userPrompt)
      }

      try {
        return JSON.parse(extractJSON(text)) as DiagnosticoResponse
      } catch {
        console.error('[aiClient] JSON parse failed. Raw text:', text.slice(0, 300))
        throw new Error('Resposta da IA não é JSON válido. Tente novamente.')
      }
    } catch (err) {
      const is429 = (err as { is429?: boolean }).is429 === true
      if (is429 && i < retries - 1) {
        await sleep(delay * Math.pow(2, i))
        continue
      }
      if (i < retries - 1 && err instanceof TypeError) {
        await sleep(delay * Math.pow(2, i))
        continue
      }
      throw err
    }
  }
  throw new Error('Falha ao conectar com a API de IA.')
}

export function loadAIConfig(): AIConfig {
  const stored = sessionStorage.getItem('vl_ai_config')
  if (stored) {
    try {
      return JSON.parse(stored) as AIConfig
    } catch { /* fall through */ }
  }
  // backward compat
  const oldKey = sessionStorage.getItem('gemini_api_key')
  if (oldKey) return { provider: 'gemini', apiKey: oldKey }
  // Default: OpenRouter com chave embutida se disponível
  if (OPENROUTER_DEFAULT_KEY) {
    return { provider: 'openrouter', apiKey: OPENROUTER_DEFAULT_KEY, model: PROVIDER_MODELS.openrouter }
  }
  return { provider: 'gemini', apiKey: '' }
}

export function saveAIConfig(config: AIConfig) {
  sessionStorage.setItem('vl_ai_config', JSON.stringify(config))
  if (config.provider === 'gemini') sessionStorage.setItem('gemini_api_key', config.apiKey)
}
