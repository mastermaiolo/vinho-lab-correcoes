# Vinho-Lab Correções

Webapp para enólogos e técnicos de adega: diagnóstico de defeitos do vinho assistido por IA, calculadoras enológicas e referência legal PT/UE + Brasil. Aplicação-irmã do [Vinho-Lab Companheiro](https://github.com/mastermaiolo/vinho-lab-companheiro) — o Companheiro mede e valida em campo, o Correções diagnostica e recomenda.

🔗 **Produção:** [vinholabcor.vercel.app](https://vinholabcor.vercel.app)

## Funcionalidades

- **Diagnóstico IA** — preenche os parâmetros analíticos e sintomas; a IA devolve um diagnóstico diferencial com causa, métodos de confirmação, correção regulamentada e referência legal por jurisdição
- **4 provedores de IA** — OpenRouter (padrão, com chave grátis pré-configurada), Google Gemini, Anthropic Claude e OpenAI; chave guardada apenas em `sessionStorage`
- **Importar boletim** — lê ficheiros `.md` **e** sessões `.json` exportados pelo Vinho-Lab Companheiro para pré-preencher o formulário
- **Calculadoras** — SO₂ (Sudraud-Chauvet, com alvo molecular automático), acidificação, desacidificação e enriquecimento, com verificação de limites legais
- **Fichas de Defeito** — 20 defeitos em 4 categorias, com compostos marcadores, causas, confirmação analítica e correções
- **Produtos** — catálogo de 19 produtos de correção em 9 categorias
- **Comparação PT ↔ BR** — diferenças regulatórias mais relevantes entre jurisdições
- **Multilíngue** — interface em Português, English, Español e 中文; a resposta da IA acompanha o idioma escolhido

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (tema escuro vinho/pedra)
- i18n próprio (sem biblioteca externa) — 4 línguas
- 4 APIs de IA chamadas diretamente do browser (sem backend)
- Deploy: Vercel (SPA estático)

## Desenvolvimento

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção (tsc + vite)
npm test           # suite de testes (vitest)
npm run gen-prompt # regenera o system prompt a partir dos JSON de dados
```

## Deploy no Vercel

1. Faça fork/clone deste repositório
2. Importe no [Vercel](https://vercel.com) como novo projeto
3. Framework preset: **Vite** · Build: `npm run build` · Output: `dist`

### Variável de ambiente (opcional)

Para disponibilizar uma chave OpenRouter partilhada que funcione sem o utilizador configurar nada:

```bash
# .env.local (local) — nunca vai ao git
VITE_OPENROUTER_DEFAULT_KEY=sk-or-v1-...
```

Em produção, configurar a mesma variável no painel da Vercel (ou `npx vercel env add VITE_OPENROUTER_DEFAULT_KEY`). Se a variável não estiver definida, o utilizador insere a sua própria chave na interface — a app funciona em ambos os casos.

> ⚠️ **Nota de segurança:** qualquer variável `VITE_*` é embutida no bundle JavaScript em build time. A chave pré-configurada é, portanto, **pública** — extraível por qualquer pessoa via DevTools. Use apenas uma chave descartável, restrita a modelos gratuitos e sem créditos pagos. **Nunca** coloque ali uma chave com saldo.

## Chaves de API

| Provedor | Onde obter | Notas |
|---|---|---|
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | Modelos `:free` sem custo; partilham rate limits |
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com/app/apikey) | Plano gratuito disponível |
| **Anthropic Claude** | [console.anthropic.com](https://console.anthropic.com/settings/keys) | Pago |
| **OpenAI** | [platform.openai.com](https://platform.openai.com/api-keys) | Pago |

## Privacidade

- **A chave API** é guardada apenas em `sessionStorage` — eliminada ao fechar o tab. Sem analytics, sem cookies de rastreio.
- **Nome da amostra, lote, data e responsável** (de um boletim importado) **nunca saem do browser**.
- **Os parâmetros analíticos e sintomas SÃO enviados** ao provedor de IA selecionado para gerar o diagnóstico — esses dados podem identificar um produtor ou lote e constituem informação empresarial sensível. São processados ao abrigo da política de privacidade do provedor escolhido.
- Em **modelos gratuitos** (OpenRouter `:free`), os prompts podem ser registados e usados para treino pelos fornecedores upstream. Para dados confidenciais, use a sua própria chave e um modelo pago.
- O consentimento é pedido explicitamente antes do primeiro diagnóstico (RGPD Art. 6.º, n.º 1, al. a), nomeando o provedor em uso.

## Base legal

- **Portugal / UE:** Reg. UE 1308/2013 · Reg. Delegado UE 2019/934 · Reg. UE 2024/3085
- **Brasil:** IN MAPA 14/2018 · Portaria MAPA 723/2024 · Lei 7.678/1988

Documentação técnica completa do projeto em [PROJECTO.md](PROJECTO.md).

---

*Ferramenta de apoio à decisão. Não substitui o boletim oficial emitido por laboratório autorizado nem aconselhamento enológico profissional.*
