<div align="center">

# VINHO-LAB CORREÇÕES

**AI-Assisted Enological Defect Diagnostician &amp; Remedy Calculator**

[![Release](https://img.shields.io/badge/release-v1.0.0-AD283B?style=flat-square&labelColor=13161A)](https://github.com/mastermaiolo/vinho-lab-correcoes)
[![Licence](https://img.shields.io/badge/licence-MIT-E9E5DC?style=flat-square&labelColor=13161A)](LICENSE)
[![Production](https://img.shields.io/badge/production-vinholabcor.vercel.app-C86D51?style=flat-square&labelColor=13161A)](https://vinholabcor.vercel.app)
[![Framework](https://img.shields.io/badge/React-18%20%2B%20Vite-B62B32?style=flat-square&labelColor=13161A)](https://vitejs.dev)
[![Compliance](https://img.shields.io/badge/compliance-PT%2FEU%20%E2%86%94%20BR%20(OIV)-E9E5DC?style=flat-square&labelColor=13161A)](https://www.oiv.int)

<br/>

**English (UK)** · [Português (Brasil)](README.pt-br.md) · [Português (Portugal)](README.pt-pt.md) · [Español](README.es-es.md) · [简体中文](README.zh-cn.md)

<br/>

<img src="assets/readme/hero.svg" alt="Vinho-Lab Correções Hero Canvas" width="100%"/>

</div>

<br/>

> **Web application for enologists, winemakers, and cellar technicians**: provides AI-assisted differential diagnosis of wine defects, precise oenological dosage calculators, and comparative legal references across **Portugal / European Union** and **Brazil**.
>
> Sister application to [**Vinho-Lab Companheiro**](https://github.com/mastermaiolo/vinho-lab-comp) — *Companheiro measures and validates physicochemical metrics on the bench; Correções diagnoses defects and prescribes regulated interventions.*
>
> 🔗 **Live Production Deployment:** [vinholabcor.vercel.app](https://vinholabcor.vercel.app)

> [!WARNING]
> **Decision-Support Instrument:** This application serves as a decision-support and technical consulting tool. It does not replace official analysis bulletins issued by accredited laboratories, nor does it substitute for certified professional enological oversight.

---

## 01 / Navigation Index

- [02 / At a Glance](#02--at-a-glance)
- [03 / Capabilities &amp; Engineering](#03--capabilities--engineering)
- [04 / Workspaces &amp; Defect Atlas](#04--workspaces--defect-atlas)
- [05 / Control Surface &amp; User Interface](#05--control-surface--user-interface)
- [06 / AI Providers &amp; Privacy Protocol](#06--ai-providers--privacy-protocol)
- [07 / Oenological Calculators &amp; Sudraud-Chauvet Math](#07--oenological-calculators--sudraud-chauvet-math)
- [08 / Installation &amp; Development](#08--installation--development)
- [09 / Architecture &amp; Codebase Layout](#09--architecture--codebase-layout)
- [10 / Troubleshooting &amp; Edge Cases](#10--troubleshooting--edge-cases)
- [11 / Lineage &amp; Provenance](#11--lineage--provenance)

---

## 02 / At a Glance

When an anomalous reading or organoleptic fault appears during vinification, cellar masters must act decisively. Vinho-Lab Correções couples physicochemical analytical parameters with sensory symptoms to determine the biochemical root cause, recommend laboratory confirmation assays, and calculate exact authorized remedy dosages.

<br/>

<div align="center">
  <img src="assets/readme/at-a-glance.svg" alt="Vinho-Lab Correções At a Glance" width="100%"/>
</div>

<br/>

### Key Architectural Strengths

| Architectural Pillar | Technical Implementation | Practical Cellar Advantage |
|---|---|---|
| **AI Differential Diagnosis** | Multi-provider client-side gateway (OpenRouter, Gemini, Claude, OpenAI) | Identifies root causes, confirmation testing, and authorized remedies |
| **Companheiro Seamless Ingestion** | Native dual-parser importing `.md` tables and `.json` session files | Zero re-typing; instant pre-population of analytical parameters |
| **Sudraud-Chauvet $\text{SO}_2$ Engine** | Active molecular $\text{SO}_2$ calculation as a function of wine pH and temperature | Guarantees microbial protection ($0.8\text{ ppm}$) while respecting legal ceilings |
| **Comprehensive Defect Atlas** | 20 oenological defects across Chemical, Microbial, and Physical categories | Marker compounds, olfactory indicators, and legal remedies |
| **Zero-Backend Privacy** | API calls executed directly from the browser; keys in `sessionStorage` | Winery name, lot numbers, and producer identity never leave the browser |

---

## 03 / Capabilities &amp; Engineering

<br/>

<div align="center">
  <img src="assets/readme/capabilities.svg" alt="Vinho-Lab Correções Capabilities" width="100%"/>
</div>

<br/>

### 1. AI-Assisted Differential Diagnosis
The application combines laboratory parameters (alcohol % vol, pH, free &amp; total $\text{SO}_2$, volatile acidity, total acidity, dry extract) with cellar observations (turbidity, acetic/nail-polish odour, bruised apple oxidation, barnyard/sweat, reduction).

Using an enological system prompt compiled directly from structured knowledge bases (`scripts/gen-system-prompt.js`), the AI returns a structured JSON payload detailing:
- **Primary Diagnosis &amp; Estimated Probability:** Identifies the precise alteration (e.g. *Brettanomyces bruxellensis* bloom, acetic souring, tartaric precipitation, protein haze).
- **Biochemical Root Cause:** Explains the biological or physical pathway responsible for the fault.
- **Confirmation Testing Protocol:** Recommends both a formal laboratory assay and an immediate cellar rapid test.
- **Regulated Corrective Action:** Distinguishes between immediate emergency stabilization and preventive cellar hygiene.
- **Jurisdictional Legal Citation:** Grounds every treatment in the applicable European Union or Brazilian regulation.

### 2. Sudraud-Chauvet Molecular $\text{SO}_2$ Formulation
Sulfiting efficacy depends strictly on the fraction of active molecular sulfur dioxide ($\text{SO}_2\text{ mol}$), which is governed by wine pH:

$$\text{SO}_2\text{ mol} = \frac{\text{Free }\text{SO}_2}{1 + 10^{\text{pH} - 1.81}} \quad (\text{at } 20^\circ\text{C})$$

Vinho-Lab Correções computes the exact dosage of potassium metabisulfite ($\text{K}_2\text{S}_2\text{O}_5$) or liquid aqueous sulfur dioxide needed to achieve the target $0.8\text{ mg/L}$ molecular protection. If wine pH is excessively high (&ge;3.70), the calculator emits an enological warning: adding sulfur alone will exceed legal total $\text{SO}_2$ ceilings before providing antiseptic security, advising pre-acidification or fungal chitosan fining instead.

### 3. Sister Application Ingestion &amp; GDPR Privacy Guard
The application ingests reports exported from **Vinho-Lab Companheiro** without manual transcription:
- **Markdown Tables (`.md`):** Regex parser extracts tabular readings and wine profiles.
- **JSON Sessions (`.json`):** Reads the canonical `measurements{}` map with full unit awareness.

**Privacy Sanitation:** Cellar names, lot references, harvest dates, and technician signatures are stripped locally. Only anonymized numerical values and selected symptoms are dispatched to the selected AI provider, preceded by an explicit GDPR Article 6(1)(a) consent dialogue.

---

## 04 / Workspaces &amp; Defect Atlas

<br/>

<div align="center">
  <img src="assets/readme/showcase.svg" alt="Vinho-Lab Correções Showcase" width="100%"/>
</div>

<br/>

### Overview of Application Tabs

| Workspace Tab | Operational Focus | Key Capabilities |
|---|---|---|
| **01 / Correções** | Analytical input form &amp; bulletin ingestion | Entry of TAV, pH, free/total $\text{SO}_2$, volatile/total acidity, dry extract; symptom matrix; one-click import from Companheiro |
| **02 / Diagnóstico IA** | AI consultation &amp; prescription review | Dispatch to AI provider; structured diagnosis card; severity level (immediate, moderate, preventive); reversibility index |
| **03 / Calculadoras** | Dosage &amp; enrichment calculations | Sudraud-Chauvet molecular $\text{SO}_2$; tartaric acidification; calcium carbonate deacidification; chaptalisation |
| **04 / Comparação** | Cross-bulletin &amp; jurisdictional comparison | Side-by-side analytical delta comparison; legal divergence matrix between PT/EU and Brazil |
| **05 / Fichas de Defeito** | Reference defect encyclopaedia | 20 detailed defect sheets: marker compounds, biochemical causes, diagnostic tests, permitted corrections |
| **06 / Produtos** | Oenological treatment directory | 19 commercial correction products in 9 categories: sulfur, acids, fining, adsorbents, antimicrobials |

<br/>

<details>
<summary><strong>Explore the 20 Catalogued Oenological Defect Sheets (Click to Expand)</strong></summary>
<br/>

1. **Chemical Alterations (11):** Free $\text{SO}_2$ Deficiency, Excessive Total $\text{SO}_2$, Elevated Volatile Acidity (Acetic Souring), High pH / Low Total Acidity, Residual Carbon Dioxide, Chemical Oxidation (Aldehyde Haze), Ethyl Acetate Formation, Copper Casse, Iron (Ferric) Casse, Light-Struck Flavour (*Goût de Lumière*), Over-Extraction / Phenolic Bitterness.
2. **Microbiological Disorders (5):** *Brettanomyces* / 4-Ethylphenol Contamination, Secondary Re-Fermentation in Bottle, Lactic Disease / Mannitol Degradation, Film-Forming Yeast Bloom (*Mycoderma vini*), Mousey Taint (Tetrahydropyridines).
3. **Physicochemical Instabilities (3):** Potassium Bitartrate / Calcium Tartrate Precipitation, Heat-Induced Protein Casse, Glucan / Pectin Colloid Haze.
4. **Mixed Disorders (1):** Combined Reduction Flavour (Hydrogen Sulfide / Mercaptans).

</details>

---

## 05 / Control Surface &amp; User Interface

<br/>

<div align="center">
  <img src="assets/readme/control-surface.svg" alt="Vinho-Lab Correções Control Surface" width="100%"/>
</div>

<br/>

### Interactive Controls &amp; Workflow

1. **Import or Input Data:** In the **Correções** tab, click *Importar boletim* to load a `.json` or `.md` file from Vinho-Lab Companheiro, or manually key in bench metrics. Select observed symptoms (e.g. volatile odour, animal notes, cloudy aspect).
2. **Configure AI Provider:** Click the key icon in the header to select your provider (OpenRouter is pre-configured with a free shared key).
3. **Trigger Diagnosis:** Navigate to **Diagnóstico IA** and submit. Confirm the GDPR privacy modal on the first consultation.
4. **Calculate Corrective Dosages:** Open **Calculadoras** to determine the precise addition of metabisulfite, tartaric acid, or deacidifier.
5. **Inspect Legal Constraints:** Consult **Fichas de Defeito** and **Produtos** to verify whether the intervention conforms to Regulation (EU) 2019/934 or Brazilian MAPA IN 14/2018.

---

## 06 / AI Providers &amp; Privacy Protocol

### Supported Inference Gateways

| Provider | Model Default | Pricing Model | Format Mechanism |
|---|---|---|---|
| **OpenRouter** (Default) | `nvidia/nemotron-3-super-120b-a12b:free` | Free shared key included | System prompt JSON parsing |
| **Google Gemini** | `gemini-2.5-flash` | Free tier / Paid API key | Native `responseMimeType: application/json` |
| **Anthropic Claude** | `claude-haiku-4-5` | User-supplied paid key | System prompt JSON parsing |
| **OpenAI** | `gpt-4o-mini` | User-supplied paid key | Native `response_format: json_object` |

### Security &amp; Data Privacy Policy

- **SessionStorage Ephemerality:** User-provided API keys are kept strictly in browser `sessionStorage`. Keys are purged instantly when the tab is closed.
- **Zero Server Retention:** Vinho-Lab Correções operates as a serverless Single Page Application (SPA). The application server never handles keys, analytical data, or prompts.
- **CORS Direct Browser Transport:** Requests travel directly from the user's browser to the AI vendor's endpoint without intermediate reverse proxies. Non-standard headers are stripped to prevent OPTIONS preflight rejections.
- **Commercial Data Discretion:** Free-tier providers (such as OpenRouter `:free`) may log prompts upstream for training. For sensitive proprietary cellar blends, users should provide their own private API key on paid tiers.

---

## 07 / Oenological Calculators &amp; Sudraud-Chauvet Math

### Mathematical Formulations

```
1. Active Molecular SO₂:
   SO₂ mol = Free SO₂ / (1 + 10^(pH - 1.81))

2. Potassium Metabisulfite Dose (K₂S₂O₅ yields ~50% active SO₂):
   Grams K₂S₂O₅ = (Target Free SO₂ Delta in mg/L × Wine Volume in Litres) / 500

3. Tartaric Acidification (Legal maximums: +1.5 g/L in EU Zone C, +2.5 g/L in EU Zone A/B):
   Grams Tartaric Acid = Desired Total Acidity Increase in g/L × Wine Volume in Litres

4. Deacidification via Calcium Carbonate (CaCO₃):
   Grams CaCO₃ = Acidity Reduction in g/L (as tartaric) × 0.667 × Wine Volume in Litres
```

---

## 08 / Installation &amp; Development

### Prerequisites

- **Environment:** Node.js 18+ or Bun 1.1+
- **Package Manager:** `npm` (default) or `pnpm`

### Local Setup

```bash
# Clone repository
git clone https://github.com/mastermaiolo/vinho-lab-correcoes.git
cd vinho-lab-correcoes

# Install dependencies
npm install

# Start local development server
npm run dev

# Regenerate embedded TypeScript system prompt from JSON databases
npm run gen-prompt

# Execute automated tests (Vitest)
npm test

# Production build compilation
npm run build
```

---

## 09 / Architecture &amp; Codebase Layout

<br/>

<div align="center">
  <img src="assets/readme/architecture.svg" alt="Vinho-Lab Correções Pipeline Architecture" width="100%"/>
</div>

<br/>

### Directory Structure

```
vinho-lab-correcoes/
├── public/                    # Static web assets
├── src/
│   ├── main.tsx               # Application root mounting <I18nProvider><App />
│   ├── App.tsx                # Tab router & global AI state
│   ├── tabs/                  # Main enological workspaces
│   │   ├── Correcoes.tsx      # Analytical metric inputs & bulletin file upload
│   │   ├── DiagnosticoIA.tsx  # AI dispatch & structured results rendering
│   │   ├── Calculadoras.tsx   # Molecular SO₂, acidification & chaptalisation math
│   │   ├── Comparacao.tsx     # Dual bulletin and legal jurisdiction comparison
│   │   ├── FichasDefeito.tsx  # Technical reference sheets for 20 wine flaws
│   │   └── Produtos.tsx       # Authorised oenological products catalogue
│   ├── components/            # UI chrome & dialogue modals
│   │   ├── Header.tsx         # Navigation bar & API status button
│   │   ├── ApiKeyModal.tsx    # Modal for AI provider & key selection
│   │   ├── PrivacyConsentModal.tsx # GDPR Article 6 compliance dialogue
│   │   └── LanguageSwitcher.tsx # Multilingual locale selector
│   ├── lib/                   # Enological & algorithmic engines
│   │   ├── aiClient.ts        # Direct browser HTTP clients for 4 AI models
│   │   ├── calculadoras.ts    # Enological dosage equations
│   │   ├── mdParser.ts        # Parser for Companheiro .md and .json files
│   │   ├── promptBuilder.ts   # Formulates structured prompts with lab metrics
│   │   ├── systemPrompt.ts    # Base expert enologist system instructions
│   │   └── systemPromptGenerated.ts # Compiled static JSON enological knowledgebase
│   └── data/                  # Single source of truth databases
│       ├── defeitos.json      # 20 defects, marker molecules & confirmation assays
│       ├── produtos_correcao.json # 19 correction products across 9 categories
│       ├── limites_pt_ue.json # EU & Portugal limits (IVV, Reg. 2019/934)
│       └── limites_brasil.json# Brazil limits (MAPA IN 14/2018)
├── scripts/
│   └── gen-system-prompt.js   # Build tool compiling JSON data into TS prompts
└── assets/
    └── readme/                # Modular SVG visual system assets
```

---

## 10 / Troubleshooting &amp; Edge Cases

<br/>

<div align="center">
  <img src="assets/readme/failure-modes.svg" alt="Vinho-Lab Correções Failure Modes" width="100%"/>
</div>

<br/>

### Edge Cases &amp; Remedial Strategies

<details>
<summary><strong>1. HTTP 429 Rate Limiting on Free AI Tiers</strong></summary>
<br/>

Public models on OpenRouter may experience rate-limit spikes during peak hours. The `aiClient.ts` module implements automatic exponential backoff retry (up to 3 attempts). If congestion persists, users can supply their own private Gemini, Claude, or OpenAI key in the settings modal.

</details>

<details>
<summary><strong>2. Browser CORS Preflight Failures</strong></summary>
<br/>

Because API calls are made directly from the user's browser without a backend proxy, headers like `X-Title` or `Referer` trigger failed OPTIONS preflight requests on certain gateways. Vinho-Lab Correções strips all extraneous headers, sending strictly `Content-Type: application/json` and `Authorization: Bearer <key>`.

</details>

<details>
<summary><strong>3. High pH / Ineffective Molecular Sulfur Addition</strong></summary>
<br/>

At pH values exceeding 3.70, over 98% of free sulfur dioxide dissociates into bisulfite ($\text{HSO}_3^-$), rendering it microbiologically inactive. Adding further metabisulfite risks exceeding the legal maximum for total $\text{SO}_2$ before achieving antiseptic safety. The calculator automatically flags this condition and advises pre-acidification with tartaric acid or using fungal chitosan.

</details>

<details>
<summary><strong>4. Cross-Border Product Prohibitions</strong></summary>
<br/>

Certain enological additives allowed under Brazilian MAPA regulations are restricted or prohibited under European Union organic or conventional wine rules (e.g. ammonium dibasic phosphate limits or specific sorbates). The system's comparative knowledge base cross-checks jurisdiction rules before suggesting treatments.

</details>

---

## 11 / Lineage &amp; Provenance

<br/>

<div align="center">
  <img src="assets/readme/provenance.svg" alt="Vinho-Lab Correções Provenance" width="100%"/>
</div>

<br/>

### Regulatory Corpus

- **European Union &amp; Portugal:** Instituto da Vinha e do Vinho (IVV) — *Regulation (EU) No 1308/2013*, *Commission Delegated Regulation (EU) 2019/934*, and *Regulation (EU) 2024/3085*.
- **Federative Republic of Brazil:** Ministério da Agricultura, Pecuária e Abastecimento (MAPA) — *Instrução Normativa IN n.º 14/2018*, *Portaria MAPA n.º 723/2024*, and *Lei Federal n.º 7.678/1988*.
- **Technical Standards:** Organisation Internationale de la Vigne et du Vin (OIV) — *Code of Oenological Practices*.

### Sister Application Lineage

- **Vinho-Lab Companheiro (`vinho-lab-comp`):** Measures, computes OIV analytical values on the bench, and certifies dual-regime exportability.
- **Vinho-Lab Correções (`vinho-lab-correcoes`):** Diagnoses organoleptic defects, simulates corrective dosages, and cross-references treatments against regulatory restrictions.
- **Author &amp; Engineering:** Master Maiolo · MAIOLO / SYSTEMS LAB.

### Licence

Distributed under the **MIT Licence**. See the [LICENSE](LICENSE) file for complete terms.

---

<div align="center">
<sub>MAIOLO / SYSTEMS LAB · VINHO-LAB CORREÇÕES · AI ENOLOGICAL DEFECT DIAGNOSTICIAN</sub>
</div>
