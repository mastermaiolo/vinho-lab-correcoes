# Vinho-Lab Correções

Webapp estático para enólogos e técnicos de adega. Diagnóstico de defeitos assistido por IA (Gemini), calculadoras enológicas e referência legal PT/UE + Brasil.

## Funcionalidades

- **Diagnóstico IA** — preenche sintomas analíticos e sensoriais, chama a API Gemini e recebe diagnóstico diferencial com correções específicas por jurisdição
- **Importar boletim** — importa ficheiros `.md` exportados pelo [Vinho-Lab Companheiro](https://github.com/seu-user/vinho-lab-companheiro) para pré-preencher o formulário
- **Calculadoras** — SO₂ (Sudraud-Chauvet), acidificação, desacidificação, enriquecimento — com verificação de limites legais
- **Fichas de Defeito** — enciclopédia de 12 defeitos com compostos marcadores, causas, confirmação analítica e correções
- **Comparação PT ↔ BR** — tabela das diferenças regulatórias mais relevantes

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Gemini API (Google) — apenas para o módulo de Diagnóstico IA
- Deploy: Vercel (SPA estático)

## Desenvolvimento

```bash
pnpm install   # ou npm install
pnpm dev       # servidor de desenvolvimento
pnpm build     # build de produção
```

## Deploy no Vercel

1. Faça fork/clone deste repositório
2. Importe no [Vercel](https://vercel.com) como novo projeto
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

Não são necessárias variáveis de ambiente — a chave API Gemini é inserida pelo utilizador na interface e guardada apenas em `sessionStorage`.

## Chave API Gemini

Obtenha uma chave gratuita em [aistudio.google.com](https://aistudio.google.com/app/apikey). O plano gratuito (60 req/min) é suficiente para uso normal.

## Privacidade

- Nenhum dado do utilizador é guardado permanentemente
- A chave API Gemini é guardada apenas em `sessionStorage` (limpa ao fechar o tab)
- Os parâmetros analíticos são processados localmente; apenas o prompt de diagnóstico é enviado à API Google
- Sem analytics, sem cookies de rastreio

## Base legal

- Portugal / UE: Reg. UE 1308/2013 · Reg. Delegado 2019/934 · Reg. UE 2024/3085 · Reg. CE 606/2009 · Reg. UE 2018/1629
- Brasil: IN MAPA 14/2018 · Portaria MAPA 723/2024 · Lei 7.678/1988

---

*Ferramenta de apoio à decisão. Não substitui o boletim oficial emitido por laboratório autorizado.*
