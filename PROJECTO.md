# Vinho-Lab Correções — Documentação do Projecto

> **URL em produção:** https://vinholabcor.vercel.app  
> **Repositório:** https://github.com/mastermaiolo/vinho-lab-correcoes  
> **Stack:** React 18 + TypeScript + Vite + Tailwind CSS — SPA sem backend

---

## O que é

Ferramenta web para enólogos e técnicos de adega diagnosticarem defeitos analíticos em vinho e obterem recomendações de correcção. O utilizador insere as medições do boletim analítico (TAV, pH, SO₂, acidez, etc.), selecciona o tipo de vinho e a jurisdição regulatória (PT/UE ou Brasil), e uma IA devolve um diagnóstico estruturado com causas, métodos de confirmação e correcções regulamentadas.

É a aplicação-irmã do **Vinho-Lab Companheiro** (ferramenta de medições em campo) — os dois projectos partilham o formato de exportação de sessão.

---

## Arquitectura

```
src/
├── main.tsx                  — entrada, monta <I18nProvider><App />
├── App.tsx                   — roteamento entre tabs, estado global da config AI
│
├── tabs/
│   ├── Correcoes.tsx         — formulário principal de medições
│   ├── DiagnosticoIA.tsx     — envio para IA + exibição de resultados
│   ├── Calculadoras.tsx      — calculadoras de dose de SO₂, acidez, álcool
│   ├── Comparacao.tsx        — comparação de dois boletins
│   ├── FichasDefeito.tsx     — fichas técnicas dos 20 defeitos (dados JSON)
│   └── Produtos.tsx          — catálogo dos 19 produtos de correcção
│
├── components/
│   ├── Header.tsx            — barra de topo com selector de tab e botão API
│   ├── ApiKeyModal.tsx       — modal de configuração de provedor/chave/modelo
│   ├── HistoricoModal.tsx    — histórico de diagnósticos (sessionStorage)
│   ├── LanguageSwitcher.tsx  — botões de bandeira pt/en/es/zh
│   ├── I18nProvider.tsx      — contexto de tradução, função t(), componente Rich
│   └── PrivacyConsentModal.tsx — consentimento RGPD antes do primeiro diagnóstico
│
├── lib/
│   ├── aiClient.ts           — chamadas às 4 APIs de IA + extracção de JSON
│   ├── i18n.ts               — dicionário 200+ chaves × 4 línguas
│   ├── calculadoras.ts       — lógica das fórmulas enológicas
│   ├── promptBuilder.ts      — constrói o user prompt a partir do formulário
│   ├── systemPrompt.ts       — system prompt base (expert em enologia)
│   ├── systemPromptGenerated.ts — secção de dados JSON compilada pelo script
│   ├── mdParser.ts           — importa .md e .json do Companheiro
│   └── historico.ts          — leitura/escrita do histórico em sessionStorage
│
└── data/
    ├── defeitos.json         — 20 defeitos, 4 categorias, compostos marcadores
    ├── produtos_correcao.json — 19 produtos em 9 categorias
    ├── limites_pt_ue.json    — limites legais PT/UE (IVV + Reg. 606/2009)
    └── limites_brasil.json   — limites legais Brasil (MAPA)
```

### Decisões de design

- **Zero dependências de UI** — apenas React + Tailwind. Sem bibliotecas de componentes, sem router externo.
- **Zero backend** — todas as chamadas de API são feitas directamente do browser para os provedores de IA. A chave fica em `sessionStorage` (apagada quando o tab fecha).
- **i18n próprio** — sem `i18next` ou similar. `translate(locale, key, vars)` com interpolação `{var}` e markup `**bold**` via componente `<Rich>`.
- **System prompt gerado** — `scripts/gen-system-prompt.js` compila `defeitos.json` + `produtos_correcao.json` + limites legais numa secção TypeScript para que a IA tenha os dados embebidos no prompt.

---

## Provedores de IA

| Provedor | Modelo | Tipo | Formato resposta |
|---|---|---|---|
| **OpenRouter** (padrão) | `nvidia/nemotron-3-super-120b-a12b:free` | free shared | system prompt JSON |
| **Google Gemini** | `gemini-2.5-flash` | pago | `responseMimeType: application/json` |
| **Anthropic Claude** | `claude-haiku-4-5` | pago | system prompt JSON |
| **OpenAI** | `gpt-4o-mini` | pago | `response_format: json_object` |

O OpenRouter é o provedor padrão porque tem uma chave pré-configurada embutida no bundle (variável de ambiente `VITE_OPENROUTER_DEFAULT_KEY`, nunca vai ao git). O utilizador pode usar sem configurar nada, ou substituir pela sua própria chave.

### CORS do browser

Todas as chamadas são feitas directamente do browser (sem proxy). O OpenRouter aceita `Content-Type` + `Authorization` — qualquer header adicional (como `X-Title` ou `HTTP-Referer`) dispara um preflight OPTIONS que o OpenRouter rejeita. A função `callOpenRouter()` envia apenas os dois headers necessários.

### Retry e tratamento de erros

- Backoff exponencial para 429 (rate limit) — até 3 tentativas
- `TypeError` de rede também faz retry (cobre falhas de conectividade transitórias)
- `extractJSON()` remove fenced blocks (` ```json ... ``` `) antes de fazer `JSON.parse` — necessário porque modelos free tendem a embrulhar a resposta em markdown

---

## Importação do Vinho-Lab Companheiro

O Companheiro exporta sessões em dois formatos:

| Formato | Detecção | Parser |
|---|---|---|
| `.md` | extensão do ficheiro | `parseMdBoletim()` — regex sobre tabelas markdown |
| `.json` | campo `kind === "vinho-lab/session"` | `parseSessionCompanheiro()` — lê `measurements{}` com shape `{value, unit}` |

Os campos extraídos (TAV, pH, SO₂ livre/total, acidez volátil, acidez total, ESR, tipo de vinho, jurisdição) pré-preenchem o formulário de diagnóstico automaticamente.

---

## Internacionalização

4 línguas: **Português** (padrão), **English**, **Español**, **中文**

- Dicionário em `src/lib/i18n.ts` — ~200 chaves, ~750 linhas
- Preferência guardada em `localStorage` com chave `vl_locale`
- Interpolação de variáveis: `t('key', { valor: 42 })` → `{valor}` substituído
- Negrito inline: `**texto**` renderizado como `<strong>` pelo componente `<Rich>`
- Fallback: língua seleccionada → português → chave literal

---

## Dados técnicos

### Defeitos (20 entradas)

| Categoria | Exemplos |
|---|---|
| Químico (11) | Excesso/défice de SO₂, acidez volátil elevada, pH fora de gama, CO₂ residual, oxidação, acetificação |
| Microbiológico (5) | Brettanomyces, refermentação, doenças bacterianas, leveduras de deterioração |
| Físico-químico (3) | Precipitações tartáricas, casse proteica, casse metálica |
| Misto (1) | Defeitos combinados microbiológico/físico |

Cada defeito inclui: compostos marcadores, causa provável, métodos de confirmação analítica (principal + rápido), correcção, proibições regulamentares, referência legal, grau de urgência (imediata / moderada / preventiva), reversibilidade.

### Produtos de correcção (19 entradas, 9 categorias)

SO₂ · Acidificação · Desacidificação · Enriquecimento · Clarificação · Antimicrobianos · Colagem · Tratamento de metais · Estabilização

### Calculadoras

- Dose de SO₂ com cálculo de fracção molecular activa (função do pH)
- Target automático de SO₂ molecular (0.8 ppm = referência de protecção)
- Acidificação/desacidificação com tartárico e carbonato de cálcio
- Chaptalização (enriquecimento alcoólico)

---

## Histórico de desenvolvimento

| Commit | O que foi feito |
|---|---|
| `46bf9fd` | Versão inicial — formulário, diagnóstico Gemini, dados base |
| `0b1b518` | Consentimento RGPD antes do primeiro diagnóstico IA |
| `243949f` | +10 melhorias: histórico de sessão, exportação PDF, SO₂ mol em live, validação de formulário, suporte PWA, mais defeitos |
| `577ba56` | 20 defeitos completos, 9 categorias de produtos, system prompt gerado a partir dos JSON |
| `7179a5c` | **i18n** (pt/en/es/zh), multi-provedor (Gemini/Claude/OpenAI), exportação PDF, importação .md/.json do Companheiro |
| `6b31f54` | **OpenRouter** como 4º provedor com selector de modelos e chave pré-configurada |
| `04817bf` | Fix CORS — removido `HTTP-Referer` que causava preflight failure |
| `f647701` | Audit de integração: Gemini URL via constante, OpenAI `max_completion_tokens`, regex extractJSON case-insensitive |
| `1501baf` | Fix CORS final — removido `X-Title` (também dispara preflight) |
| `ef0688f` | Modelos OpenRouter actualizados — 3 removidos (inexistentes), novo default `nemotron-3-super-120b` |

---

## Estado actual

### Funcional
- [x] Formulário de medições com validação
- [x] Diagnóstico IA com 4 provedores
- [x] Chave OpenRouter pré-configurada (uso imediato sem registo)
- [x] Selector de modelo OpenRouter (8 opções + campo manual)
- [x] Fichas técnicas dos 20 defeitos
- [x] Catálogo de 19 produtos de correcção
- [x] 4 calculadoras enológicas
- [x] Comparação de dois boletins
- [x] Importação .md e .json do Vinho-Lab Companheiro
- [x] Histórico de diagnósticos (sessão)
- [x] Exportação PDF
- [x] Consentimento RGPD
- [x] Interface em 4 línguas (pt/en/es/zh)

### Limitações conhecidas
- A chave OpenRouter pré-configurada é **partilhada** — rate limits esgotam-se em pico de uso. Utilizadores com uso intenso devem usar a sua própria chave (grátis em openrouter.ai/keys).
- Modelos free do OpenRouter têm disponibilidade variável — podem entrar em rate limit sem aviso. Se um modelo falhar, mudar para outro na lista.
- Histórico guardado em `sessionStorage` — perdido quando o tab fecha. Exportar para PDF antes de fechar.
- Sem sincronização entre dispositivos (não há backend/conta de utilizador).

### Próximos passos possíveis
- Persistência do histórico em `localStorage` (opcional, com aviso de privacidade)
- Suporte a mais línguas (fr, de, it)
- Actualização automática da lista de modelos OpenRouter via API
- Modo offline com service worker completo
- Integração directa com o Companheiro via partilha nativa do browser

---

## Configuração de desenvolvimento

```bash
# Instalar dependências
npm install

# Arrancar em desenvolvimento
npm run dev

# Build de produção (TypeScript + Vite)
npm run build

# Testes unitários (calculadoras)
npm run test

# Regenerar system prompt a partir dos JSON
npm run gen-prompt
```

### Variáveis de ambiente

```env
# .env.local — nunca vai ao git
VITE_OPENROUTER_DEFAULT_KEY=sk-or-v1-...
```

Em produção (Vercel), configurar via:
```bash
npx vercel env add VITE_OPENROUTER_DEFAULT_KEY
```
