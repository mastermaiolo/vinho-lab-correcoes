<div align="center">

# VINHO-LAB CORREÇÕES

**Diagnóstico de Defeitos do Vinho Assistido por IA e Calculadora Enológica**

[![Release](https://img.shields.io/badge/release-v1.0.0-AD283B?style=flat-square&labelColor=13161A)](https://github.com/mastermaiolo/vinho-lab-correcoes)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-E9E5DC?style=flat-square&labelColor=13161A)](LICENSE)
[![Produção](https://img.shields.io/badge/produ%C3%A7%C3%A3o-vinholabcor.vercel.app-C86D51?style=flat-square&labelColor=13161A)](https://vinholabcor.vercel.app)
[![Framework](https://img.shields.io/badge/React-18%20%2B%20Vite-B62B32?style=flat-square&labelColor=13161A)](https://vitejs.dev)
[![Conformidade](https://img.shields.io/badge/conformidade-PT%2FUE%20%E2%86%94%20BR%20(OIV)-E9E5DC?style=flat-square&labelColor=13161A)](https://www.oiv.int)

<br/>

[English (UK)](README.md) · [Português (Brasil)](README.pt-br.md) · **Português (Portugal)** · [Español](README.es-es.md) · [简体中文](README.zh-cn.md)

<br/>

<img src="assets/readme/hero.svg" alt="Vinho-Lab Correções Hero Canvas" width="100%"/>

</div>

<br/>

> **Aplicação web para enólogos e técnicos de adega**: diagnóstico de defeitos do vinho assistido por inteligência artificial, calculadoras enológicas e referência legal comparativa entre **Portugal / União Europeia** e **Brasil**.
>
> Aplicação-irmã do [**Vinho-Lab Companheiro**](https://github.com/mastermaiolo/vinho-lab-comp) — *o Companheiro mede e valida em campo e na bancada; o Correções diagnostica e prescreve.*
>
> 🔗 **Produção em Directo:** [vinholabcor.vercel.app](https://vinholabcor.vercel.app)

> [!WARNING]
> **Ferramenta de Apoio à Decisão:** Este software foi concebido como ferramenta de apoio à decisão enológica. Não substitui o boletim oficial emitido por laboratório autorizado nem aconselhamento enológico profissional presencial.

---

## 01 / Índice de Navegação

- [02 / Visão Geral](#02--vis%C3%A3o-geral)
- [03 / Capacidades e Engenharia](#03--capacidades-e-engenharia)
- [04 / Espaços de Trabalho e Atlas de Defeitos](#04--espa%C3%A7os-de-trabalho-e-atlas-de-defeitos)
- [05 / Superfície de Controlo e Interface](#05--superf%C3%ADcie-de-controlo-e-interface)
- [06 / Provedores de IA e Protocolo de Privacidade](#06--provedores-de-ia-e-protocolo-de-privacidade)
- [07 / Calculadoras Enológicas e Matemática de Sudraud-Chauvet](#07--calculadoras-enol%C3%B3gicas-e-matem%C3%A1tica-de-sudraud-chauvet)
- [08 / Instalação e Desenvolvimento](#08--instala%C3%A7%C3%A3o-e-desenvolvimento)
- [09 / Arquitectura do Pipeline e Código-Fonte](#09--arquitectura-do-pipeline-e-c%C3%B3digo-fonte)
- [10 / Resolução de Problemas e Casos Extremos](#10--resolu%C3%A7%C3%A3o-de-problemas-e-casos-extremos)
- [11 / Linhagem e Proveniência](#11--linhagem-e-proveni%C3%AAncia)

---

## 02 / Visão Geral

Perante leituras fora da gama esperada ou anomalias sensoriais na adega, a intervenção tem de ser rápida e fundamentada. O Vinho-Lab Correções correlaciona os parâmetros analíticos de boletim com sintomas visuais e olfactivos para apurar a causa bioquímica, sugerir confirmações laboratoriais e calcular doses exactas de correcção.

<br/>

<div align="center">
  <img src="assets/readme/at-a-glance.svg" alt="Vinho-Lab Correções Visão Geral" width="100%"/>
</div>

<br/>

### Principais Pilares Arquitecturais

| Pilar Arquitectural | Implementação Técnica | Vantagem Prática na Adega |
|---|---|---|
| **Diagnóstico IA Diferencial** | Gateway no browser para 4 motores de IA (OpenRouter, Gemini, Claude, OpenAI) | Identifica causas, ensaios de confirmação e produtos homologados |
| **Importação do Companheiro** | Parser nativo de ficheiros `.md` e sessões `.json` | Zero reescrita; pré-preenchimento imediato a partir de medições de campo |
| **Cálculo de $\text{SO}_2$ Sudraud-Chauvet** | Determinação do $\text{SO}_2$ molecular activo em função do pH e temperatura | Garante protecção biológica ($0,8\text{ ppm}$) respeitando o limite legal de $\text{SO}_2$ total |
| **Atlas de 20 Defeitos** | Catálogo técnico de anomalias químicas, biológicas e físico-químicas | Compostos marcadores, sintomas de alerta e acções de correcção |
| **Zero Backend &amp; Sigilo** | Chamadas directas do navegador à IA; chaves isoladas em `sessionStorage` | Dados da adega, lote e produtor nunca saem do computador |

---

## 03 / Capacidades e Engenharia

<br/>

<div align="center">
  <img src="assets/readme/capabilities.svg" alt="Capacidades do Vinho-Lab Correções" width="100%"/>
</div>

<br/>

### 1. Diagnóstico Diferencial de Defeitos por IA
A ferramenta recebe as medições analíticas da bancada (TAV, pH, $\text{SO}_2$ livre e total, acidez volátil, acidez total, extracto seco) e os sintomas observados (turvação, cheiro a vinagre, verniz/esmalte, maçã oxidada, notas animais a suor de cavalo, redução).

Com recurso a um system prompt enológico gerado a partir dos dados regulatórios (`scripts/gen-system-prompt.js`), o modelo de inteligência artificial devolve um payload JSON estruturado:
- **Diagnóstico Primário e Probabilidade:** Identifica a anomalia (ex.: contaminação por *Brettanomyces*, azedume acético, precipitação tartárica, turvação proteica).
- **Causa Bioquímica:** Explica o mecanismo de alteração do vinho.
- **Protocolo de Confirmação:** Recomenda um ensaio laboratorial oficial e um teste rápido de despiste na adega.
- **Prescrição Corretiva Homologada:** Distingue entre intervenção de emergência imediata e medidas preventivas de higiene.
- **Enquadramento Legal:** Identifica o regulamento aplicável na União Europeia ou no Brasil.

### 2. Formação de $\text{SO}_2$ Molecular por Sudraud-Chauvet
A eficácia antissética do dióxido de enxofre depende exclusivamente da fracção molecular activa ($\text{SO}_2\text{ mol}$), governada pelo pH do vinho:

$$\text{SO}_2\text{ mol} = \frac{\text{SO}_2\text{ livre}}{1 + 10^{\text{pH} - 1,81}} \quad (\text{a } 20^\circ\text{C})$$

O aplicativo calcula a dosagem precisa de metabissulfito de potássio ($\text{K}_2\text{S}_2\text{O}_5$) para atingir a meta de $0,8\text{ mg/L}$ molecular. Se o pH for demasiado elevado (&ge;3,70), emite um aviso formal: aumentar a dose de sulfuroso apenas elevará o $\text{SO}_2$ total acima do limite legal sem proteger o vinho, recomendando acidificação prévia com tartárico ou recurso a quitosano fúngico.

### 3. Ingestão do Companheiro e Protecção RGPD
Permite carregar ficheiros gerados pelo **Vinho-Lab Companheiro** sem digitação manual:
- **Tabelas Markdown (`.md`):** Reconhece parâmetros e dados de ensaios analíticos.
- **Sessões JSON (`.json`):** Lê o objecto `measurements{}` com mapeamento de unidades canónicas.

**Sanitização de Dados:** Nome da adega, lote, data e responsável nunca saem do browser. Apenas valores analíticos e sintomas são enviados à IA, precedidos de consentimento explícito prévio (RGPD Art. 6.º, n.º 1, al. a).

---

## 04 / Espaços de Trabalho e Atlas de Defeitos

<br/>

<div align="center">
  <img src="assets/readme/showcase.svg" alt="Showcase dos Módulos do Vinho-Lab Correções" width="100%"/>
</div>

<br/>

### Descrição dos Separadores da Aplicação

| Separador | Foco Operacional | Recursos e Funcionalidades |
|---|---|---|
| **01 / Correções** | Entrada de parâmetros e ingestão de boletins | Inserção de TAV, pH, $\text{SO}_2$ livre/total, acidez volátil e total; matriz de sintomas; botão de importação do Companheiro |
| **02 / Diagnóstico IA** | Consulta e avaliação do parecer de IA | Envio para provedor seleccionado; cartão estruturado de diagnóstico; grau de urgência e reversibilidade |
| **03 / Calculadoras** | Doses e correções de adega | $\text{SO}_2$ molecular Sudraud-Chauvet; acidificação tartárica; desacidificação com carbonato de cálcio; chaptalização |
| **04 / Comparação** | Comparação de boletins e análise jurídica | Comparativo lado a lado de dois ensaios; matriz de divergências regulamentares entre PT/UE e Brasil |
| **05 / Fichas de Defeito** | Atlas técnico de defeitos | 20 fichas técnicas detalhando causas, marcadores, ensaios de confirmação e acções permitidas |
| **06 / Produtos** | Catálogo de produtos enológicos | 19 produtos enológicos comerciais em 9 categorias autorizadas: sulfuroso, ácidos, colagens, quitosano |

<br/>

<details>
<summary><strong>Lista Completa das 20 Fichas Técnicas de Defeitos Enológicos (Clica para Expandir)</strong></summary>
<br/>

1. **Alterações Químicas (11):** Défice de $\text{SO}_2$ Livre, Excesso de $\text{SO}_2$ Total, Acidez Volátil Elevada (Azedume Acético), pH Elevado / Baixa Acidez, $\text{CO}_2$ Residual em Excesso, Oxidação Química (Aldeído / Pardo), Formação de Acetato de Etilo, Casse Cúprica, Casse Férrica, Gosto de Luz (*Goût de Lumière*), Sobre-extracção Fenólica / Amargor.
2. **Desvios Microbiológicos (5):** Contaminação por *Brettanomyces* / 4-Etilfenol, Refermentação Secundária em Garrafa, Doença Láctica / Degradação de Manitol, Florescência por Leveduras de Véu (*Mycoderma vini*), Gosto a Rato (Tetrahidropiridinas).
3. **Instabilidades Físico-Químicas (3):** Precipitação Tartárica (Bitartarato de Potássio / Tartarato de Cálcio), Casse Proteica por Calor, Turvação Coloidal por Glucanos e Pectinas.
4. **Desvios Mistos (1):** Redução Química e Biológica Combinada ($\text{H}_2\text{S}$ / Mercaptanos).

</details>

---

## 05 / Superfície de Controlo e Interface

<br/>

<div align="center">
  <img src="assets/readme/control-surface.svg" alt="Superfície de Controlo e Interface" width="100%"/>
</div>

<br/>

### Fluxo de Trabalho na Adega

1. **Carregar Boletim:** No separador **Correções**, clica em *Importar boletim* para carregar o ficheiro `.json` ou `.md` gerado no Vinho-Lab Companheiro. Selecciona os sintomas observados na prova.
2. **Definir Chave de IA:** Clica no ícone de chave no cabeçalho para seleccionar o modelo (o OpenRouter já se encontra pré-configurado com chave gratuita).
3. **Solicitar Diagnóstico:** No separador **Diagnóstico IA**, envia a consulta. Aceita os termos de privacidade no primeiro acesso.
4. **Calcular Correcções:** Abre o separador **Calculadoras** para dosear metabissulfito ou ácidos.
5. **Verificar Limites Legais:** Consulta as **Fichas de Defeito** e **Produtos** para assegurar a conformidade legal do tratamento perante o IVV ou o MAPA.

---

## 06 / Provedores de IA e Protocolo de Privacidade

### Motores Suportados

| Provedor | Modelo Padrão | Modalidade | Formato da Resposta |
|---|---|---|---|
| **OpenRouter** (Padrão) | `nvidia/nemotron-3-super-120b-a12b:free` | Chave gratuita pré-configurada | Parsing de JSON do system prompt |
| **Google Gemini** | `gemini-2.5-flash` | Plano gratuito / chave pessoal | Nativo `responseMimeType: application/json` |
| **Anthropic Claude** | `claude-haiku-4-5` | Chave pessoal | Parsing de JSON do system prompt |
| **OpenAI** | `gpt-4o-mini` | Chave pessoal | Nativo `response_format: json_object` |

### Salvaguarda de Sigilo e RGPD

- **Chaves Temporárias em `sessionStorage`:** A chave de API introduzida pelo utilizador fica guardada apenas na sessão temporária da janela e é eliminada ao fechar o browser.
- **Zero Retenção em Servidor:** O Vinho-Lab Correções opera como Single Page Application (SPA) estática. Não possui base de dados nem grava os prompts enviados.
- **Comunicação Directa sem Proxy:** O navegador comunica directamente com o endpoint de IA seleccionado. Cabeçalhos não standard são removidos para impedir bloqueios de CORS.
- **Chaves Pré-configuradas:** A variável `VITE_OPENROUTER_DEFAULT_KEY` fica exposta no bundle client-side. Usa apenas chaves de teste para modelos gratuitos, sem créditos associados.

---

## 07 / Calculadoras Enológicas e Matemática de Sudraud-Chauvet

### Fórmulas de Dosagem

```
1. Cálculo do SO₂ Molecular Activo:
   SO₂ mol = SO₂ livre / (1 + 10^(pH - 1,81))

2. Dosagem de Metabissulfito de Potássio (K₂S₂O₅ liberta ~50% de SO₂ activo):
   Gramas de K₂S₂O₅ = (Delta de SO₂ Livre em mg/L × Volume do Vinho em Litros) / 500

3. Acidificação com Ácido Tartárico (Teto legal: +1,5 a +2,5 g/L consoante a zona vitícola):
   Gramas de Tartárico = Aumento desejado de Acidez Total em g/L × Volume do Vinho em Litros

4. Desacidificação Química com Carbonato de Cálcio (CaCO₃):
   Gramas de CaCO₃ = Redução de Acidez em g/L (em tartárico) × 0,667 × Volume do Vinho em Litros
```

---

## 08 / Instalação e Desenvolvimento

### Pré-requisitos

- **Ambiente:** Node.js 18+ ou Bun 1.1+
- **Gestor de Pacotes:** `npm` (padrão) ou `pnpm`

### Execução Local

```bash
# Clonar o repositório
git clone https://github.com/mastermaiolo/vinho-lab-correcoes.git
cd vinho-lab-correcoes

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Recompilar o system prompt a partir dos ficheiros JSON
npm run gen-prompt

# Executar testes unitários (Vitest)
npm test

# Compilação da versão de produção
npm run build
```

---

## 09 / Arquitectura do Pipeline e Código-Fonte

<br/>

<div align="center">
  <img src="assets/readme/architecture.svg" alt="Arquitectura do Pipeline" width="100%"/>
</div>

<br/>

### Estrutura de Directórios

```
vinho-lab-correcoes/
├── public/                    # Ficheiros estáticos
├── src/
│   ├── main.tsx               # Ponto de entrada que monta <I18nProvider><App />
│   ├── App.tsx                # Gestor de separadores e estado global de IA
│   ├── tabs/                  # Separadores operacionais
│   │   ├── Correcoes.tsx      # Formulário analítico e upload de boletins
│   │   ├── DiagnosticoIA.tsx  # Chamada de IA e exibição do diagnóstico estruturado
│   │   ├── Calculadoras.tsx   # Fórmulas de SO₂ molecular, acidez e chaptalização
│   │   ├── Comparacao.tsx     # Comparador de ensaios e divergências legais
│   │   ├── FichasDefeito.tsx  # Fichas técnicas dos 20 defeitos
│   │   └── Produtos.tsx       # Catálogo dos 19 produtos enológicos autorizados
│   ├── components/            # Modais e elementos de interface
│   │   ├── Header.tsx         # Barra superior e estado da ligação
│   │   ├── ApiKeyModal.tsx    # Modal de selecção de fornecedor de IA e chaves
│   │   ├── PrivacyConsentModal.tsx # Consentimento prévio RGPD
│   │   └── LanguageSwitcher.tsx # Selector de idiomas
│   ├── lib/                   # Motores enológicos e lógica algorítmica
│   │   ├── aiClient.ts        # Clientes HTTP para os 4 fornecedores de IA
│   │   ├── calculadoras.ts    # Lógica matemática das dosagens de adega
│   │   ├── mdParser.ts        # Parsers para ficheiros .md e .json do Companheiro
│   │   ├── promptBuilder.ts   # Construtor do prompt a partir dos parâmetros
│   │   ├── systemPrompt.ts    # Instruções base do enólogo consultor
│   │   └── systemPromptGenerated.ts # Base técnica JSON compilada em TypeScript
│   └── data/                  # Ficheiros JSON de dados oficiais
│       ├── defeitos.json      # 20 defeitos, marcadores e protocolos
│       ├── produtos_correcao.json # 19 produtos em 9 categorias autorizadas
│       ├── limites_pt_ue.json # Limites legais de Portugal e UE (Reg. 2019/934)
│       └── limites_brasil.json# Limites legais do Brasil (MAPA IN 14/2018)
├── scripts/
│   └── gen-system-prompt.js   # Script de compilação dos dados JSON no prompt
└── assets/
    └── readme/                # SVGs modulares do design system
```

---

## 10 / Resolução de Problemas e Casos Extremos

<br/>

<div align="center">
  <img src="assets/readme/failure-modes.svg" alt="Matriz de Resolução de Problemas" width="100%"/>
</div>

<br/>

### Diagnósticos e Casos Críticos

<details>
<summary><strong>1. Erro 429 de Limite de Pedidos (Rate Limit)</strong></summary>
<br/>

Os modelos gratuitos no OpenRouter podem sofrer congestionamento em horas de ponta. O módulo `aiClient.ts` aplica tentativas automáticas com espera exponencial (até 3 vezes). Se a latência persistir, introduz uma chave própria do Gemini, Claude ou OpenAI no menu de chaves.

</details>

<details>
<summary><strong>2. Bloqueio de Preflight CORS no Navegador</strong></summary>
<br/>

Como as chamadas partem do browser do utilizador sem servidor intermédio, cabeçalhos não homologados pelo fornecedor (como `X-Title` ou `Referer`) originam rejeição no pedido OPTIONS. O código sanitiza a chamada, enviando apenas `Content-Type: application/json` e `Authorization`.

</details>

<details>
<summary><strong>3. Armadilha de pH Elevado com Sulfitação Excessiva</strong></summary>
<br/>

Em vinhos com pH acima de 3,70, mais de 98% do $\text{SO}_2$ livre dissocia-se e perde acção antissética. Adicionar mais metabissulfito ultrapassa o limite legal de $\text{SO}_2$ total sem conferir protecção biológica. A aplicação emite um aviso formal a recomendar acidificação prévia ou utilização de quitosano fúngico.

</details>

<details>
<summary><strong>4. Incompatibilidade Regulatória Transatlântica</strong></summary>
<br/>

Determinados produtos autorizados pelo MAPA no Brasil encontram-se interditos pelas normas da União Europeia (ou vice-versa). A base comparativa da ferramenta impede a sugestão de intervenções não autorizadas na jurisdição seleccionada.

</details>

---

## 11 / Linhagem e Proveniência

<br/>

<div align="center">
  <img src="assets/readme/provenance.svg" alt="Linhagem e Proveniência" width="100%"/>
</div>

<br/>

### Legislação e Corpus Jurídico

- **Portugal e União Europeia:** Instituto da Vinha e do Vinho (IVV) — *Regulamento (UE) n.º 1308/2013*, *Regulamento Delegado (UE) 2019/934* e *Regulamento (UE) 2024/3085*.
- **Brasil:** Ministério da Agricultura, Pecuária e Abastecimento (MAPA) — *Instrução Normativa IN n.º 14/2018*, *Portaria MAPA n.º 723/2024* e *Lei n.º 7.678/1988*.
- **Normas Técnicas:** Organização Internacional da Vinha e do Vinho (OIV) — *Código Internacional das Práticas Enológicas*.

### Relação com o Vinho-Lab Companheiro

- **Vinho-Lab Companheiro (`vinho-lab-comp`):** Mede e valida parâmetros em bancada e averigua aptidão para exportação.
- **Vinho-Lab Correções (`vinho-lab-correcoes`):** Diagnostica defeitos detectados, calcula dosagens de intervenção e orienta nas correcções permitidas por lei.
- **Autoria e Engenharia:** Master Maiolo · MAIOLO / SYSTEMS LAB.

### Licença

Distribuído sob a licença **MIT**. Consulta o ficheiro [LICENSE](LICENSE) para obteres os termos na íntegra.

---

<div align="center">
<sub>MAIOLO / SYSTEMS LAB · VINHO-LAB CORREÇÕES · DIAGNÓSTICO ENOLÓGICO ASSISTIDO POR IA</sub>
</div>
