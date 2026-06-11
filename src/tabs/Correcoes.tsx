import limitesUE from '../data/limites_pt_ue.json'
import limitesBR from '../data/limites_brasil.json'

interface Props {
  jur: 'ptue' | 'br'
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-3">
      <p className="section-title">{title}</p>
      {children}
    </div>
  )
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-stone-800 last:border-0 ${highlight ? 'text-amber-300' : ''}`}>
      <span className="text-sm text-stone-400">{label}</span>
      <span className="text-sm font-medium text-stone-200 text-right ml-4">{value}</span>
    </div>
  )
}

function RefLegal({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-stone-500 font-mono mt-2">{children}</p>
}

function CorrecoesPTUE() {
  const ue = limitesUE as Record<string, unknown>
  const so2Raw = ue.so2_total as Record<string, unknown>
  const so2Unit = (so2Raw?._unidade as string) ?? 'mg/L'
  const so2Entries = so2Raw
    ? Object.entries(so2Raw).filter(([k]) => !k.startsWith('_'))
    : []
  const acid = ue.acidificacao as { mosto: { max: number }; vinho: { max: number }; agentes: string[]; proibidos: string[] }
  const desacid = ue.desacidificacao as { mosto: { max: number }; vinho: { max: number }; agentes: string[] }

  return (
    <div className="space-y-4">
      <Section title={`SO₂ Total — limites máximos (${so2Unit})`}>
        {so2Entries.map(([k, v]) => {
          const entry = v as { max?: number; incremento_max?: number; nota?: string; condicao?: string }
          const val = entry.max != null
            ? `máx. ${entry.max} ${so2Unit}`
            : entry.incremento_max != null
              ? `+${entry.incremento_max} ${so2Unit} (derroga.)`
              : '—'
          const extra = entry.condicao ? ` · ${entry.condicao}` : entry.nota ? ` · ${entry.nota}` : ''
          return (
            <TableRow key={k}
              label={k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              value={val + extra}
            />
          )
        })}
        <div className="bg-stone-800 rounded-lg p-3 mt-2 text-xs text-stone-400 leading-relaxed">
          <strong className="text-stone-300">SO₂ molecular recomendado ≥ 0,4 mg/L</strong><br />
          Fórmula Sudraud-Chauvet: SO₂mol = SO₂livre / (1 + 10^(pH − 1,81))<br />
          pH 3,5 → 21 mg/L livre · pH 3,7 → 33 mg/L · pH 3,8 → 42 mg/L · pH 4,0 → 66 mg/L
        </div>
        <div className="mt-1">
          <p className="text-sm text-stone-400 mb-1"><strong className="text-stone-300">Formas autorizadas:</strong></p>
          <ul className="text-sm text-stone-400 space-y-0.5 ml-3">
            <li>· SO₂ gasoso</li>
            <li>· Metabissulfito de potássio (K₂S₂O₅) — fator 0,572</li>
            <li>· Bissulfito de potássio (KHSO₃) — fator 0,538</li>
            <li>· Ácido L-ascórbico (co-antioxidante, máx. 250 mg/L — nunca sozinho)</li>
          </ul>
        </div>
        <RefLegal>Reg. Delegado UE 2019/934, Anexo I-B · Reg. UE 2024/3085</RefLegal>
      </Section>

      <Section title="Acidificação">
        <TableRow label="Mosto — dose máxima" value={`${acid?.mosto?.max ?? 1.5} g/L (equiv. ác. tartárico)`} />
        <TableRow label="Vinho — dose máxima" value={`${acid?.vinho?.max ?? 2.5} g/L (equiv. ác. tartárico)`} />
        <TableRow label="Ácidos autorizados" value={(acid?.agentes ?? ['tartárico', 'málico', 'láctico']).join(', ')} />
        <TableRow label="Ácido cítrico" value="❌ Proibido como acidificante" highlight />
        <TableRow label="Regra de exclusividade" value="Não acidificar E desacidificar o mesmo vinho no mesmo ano" />
        <RefLegal>Reg. Delegado UE 2019/934, Anexo I-A · Reg. UE 1308/2013</RefLegal>
      </Section>

      <Section title="Desacidificação">
        <TableRow label="Dose máxima (mosto e vinho)" value={`${desacid?.mosto?.max ?? 1.0} g/L (equiv. ác. tartárico)`} />
        <TableRow label="Agentes autorizados" value="KHCO₃, CaCO₃, tartarato neutro de K, FML" />
        <TableRow label="Zona C (Portugal)" value="❌ Ácido tartárico proibido na desacidificação" highlight />
        <div className="bg-stone-800 rounded-lg p-3 mt-2 text-xs text-stone-400">
          KHCO₃: 0,67 g/L por −1 g/L AT · CaCO₃: 0,50 g/L · Tartarato neutro K: 0,85 g/L
        </div>
        <RefLegal>Reg. Delegado UE 2019/934, Anexo I-A</RefLegal>
      </Section>

      <Section title="Enriquecimento (Zona C — Portugal)">
        <TableRow label="Chaptalização (sacarose)" value="❌ Proibida" highlight />
        <TableRow label="Métodos autorizados" value="MCR (≥61,7°Brix; pH ≤5,0 a 25°Brix) e MC" />
        <TableRow label="Aumento normal" value="+1,5% vol" />
        <TableRow label="Aumento excepcional" value="+2,0% vol (decisão anual)" />
        <RefLegal>Reg. UE 1308/2013, Anexo VIII-B</RefLegal>
      </Section>

      <Section title="Clarificação e colagem">
        <TableRow label="Carvão activado em tintos" value="❌ Proibido" highlight />
        <TableRow label="Esferas adsorventes PVI/PVP" value="✅ Autorizadas (fenóis voláteis)" />
        <TableRow label="Quitosano" value="10 g/hL máx." />
        <TableRow label="Bentonite" value="25–150 g/hL (jar-test obrigatório)" />
        <TableRow label="Gelatina" value="Autorizada (colagem tânica clássica)" />
        <TableRow label="Caseína / albumina / PVPP" value="Autorizados em brancos e rosés" />
        <RefLegal>Reg. Delegado UE 2019/934 · Reg. UE 2024/3085 · Reg. Delegado UE 2019/934</RefLegal>
      </Section>

      <Section title="Acidez volátil — limites máximos">
        <TableRow label="Tinto" value="20 mEq/L (= 1,20 g/L ác. acético)" />
        <TableRow label="Branco / rosé" value="18 mEq/L (= 1,08 g/L ác. acético)" />
        <TableRow label="Vinho doce botritizado" value="30 mEq/L" />
        <RefLegal>Reg. Delegado UE 2019/934, Anexo I-C</RefLegal>
      </Section>

      <Section title="Ferro e cobre">
        <TableRow label="Cobre máx. no produto final" value="1 mg/L" />
        <TableRow label="Ferro — limiar de casse" value=">6 mg/L (brancos) / >10 mg/L (tintos)" />
        <TableRow label="Tratamento" value="Ácido ascórbico + SO₂; ferrocianeto K (controlado)" />
        <RefLegal>Reg. Delegado UE 2019/934</RefLegal>
      </Section>
    </div>
  )
}

function CorrecoesBR() {
  const br = limitesBR as Record<string, unknown>
  const tabRaw = (br.tabela_4_vinho_de_mesa_e_fino ?? br.tabela_4_vinho_mesa_fino) as Record<string, unknown> | undefined
  const chap = br.chapitalizacao as Record<string, unknown>

  return (
    <div className="space-y-4">
      <Section title="SO₂ Total — limite máximo">
        <TableRow label="Todos os tipos de vinho" value="150 mg/L" />
        <div className="alert-warn text-xs mt-2">⚠ Brasil: limite único 150 mg/L para todos os tipos (UE tem limites diferenciados até 300 mg/L).</div>
        <RefLegal>IN MAPA 14/2018, Tabela 4</RefLegal>
      </Section>

      <Section title="Parâmetros gerais (Tabela 4 — IN MAPA 14/2018)">
        {tabRaw && Object.entries(tabRaw)
          .filter(([k]) => !k.startsWith('_'))
          .map(([k, v]) => {
            const entry = v as Record<string, unknown>
            const unidade = (entry.unidade as string) ?? ''
            const nota = entry.nota ? ` · ${entry.nota}` : ''
            const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

            // flat entry with min/max
            if (entry.unidade != null) {
              let valor: string
              if (entry.min != null && entry.max != null)
                valor = `${entry.min} – ${entry.max} ${unidade}`
              else if (entry.min != null)
                valor = `mín. ${entry.min} ${unidade}`
              else if (entry.max != null)
                valor = `máx. ${entry.max} ${unidade}`
              else if (entry.max_meq_L != null)
                valor = `máx. ${entry.max_meq_L} ${unidade}`
              else
                valor = unidade
              return <TableRow key={k} label={label} value={valor + nota} />
            }

            // nested object by wine type (cinzas, ESR, metanol…)
            const subEntries = Object.entries(entry).filter(([sk]) => !sk.startsWith('_'))
            const parts = subEntries.map(([sk, sv]) => {
              const s = sv as Record<string, unknown>
              const su = (s.unidade as string) ?? ''
              const val = s.min != null && s.max != null
                ? `${s.min}–${s.max}`
                : s.min != null ? `≥${s.min}` : s.max != null ? `≤${s.max}` : '—'
              return `${sk.replace(/_/g, '/')}: ${val} ${su}`
            })
            return <TableRow key={k} label={label} value={parts.join(' · ') || '—'} />
          })}
        <RefLegal>IN MAPA 14/2018, Tabela 4</RefLegal>
      </Section>

      <Section title="Acidificação">
        <TableRow label="Ácido cítrico" value="✅ Até 1,0 g/L (diferente da UE)" highlight />
        <TableRow label="Ácidos autorizados" value="Tartárico, málico, láctico, cítrico" />
        <TableRow label="Ácido ascórbico" value="Máx. 150 mg/L (UE: 250 mg/L)" />
        <RefLegal>IN MAPA 14/2018 · Portaria MAPA 723/2024</RefLegal>
      </Section>

      <Section title="Chaptalização">
        {chap && Object.entries(chap)
          .filter(([k]) => !k.startsWith('_'))
          .map(([cat, v]) => {
            const entry = v as Record<string, unknown>
            const label = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            const val = entry.limite_adicao_pct_vol != null
              ? `✅ Até +${entry.limite_adicao_pct_vol}% vol`
              : entry.limite_adicao != null
                ? `✅ Até +${entry.limite_adicao}% vol`
                : entry.permitida === false
                  ? '❌ Proibida'
                  : String(entry.permitida ?? '—')
            return <TableRow key={cat} label={label} value={val} highlight={entry.permitida === false} />
          })}
        <RefLegal>IN MAPA 14/2018 · Portaria MAPA 723/2024</RefLegal>
      </Section>

      <Section title="Clarificação">
        <TableRow label="Carvão activado em tintos" value="✅ Autorizado (diferente da UE)" highlight />
        <TableRow label="Bentonite" value="Autorizada" />
        <TableRow label="Quitosano" value="Autorizado" />
        <TableRow label="Gelatina / albumina" value="Autorizados" />
        <RefLegal>IN MAPA 14/2018</RefLegal>
      </Section>

      <Section title="Acidez volátil — limite máximo">
        <TableRow label="Todos os tipos de vinho" value="20 mEq/L" />
        <TableRow label="Diferença face à UE" value="Brancos/rosés: 20 mEq/L BR vs. 18 mEq/L UE" highlight />
        <RefLegal>IN MAPA 14/2018, Tabela 4</RefLegal>
      </Section>

      <Section title="Ferro e cobre">
        <TableRow label="Cobre máx. no produto final" value="1 mg/L" />
        <TableRow label="Tratamento" value="Ferrocianeto K, ácido ascórbico, ácido cítrico (1,0 g/L)" />
        <RefLegal>IN MAPA 14/2018</RefLegal>
      </Section>
    </div>
  )
}

export default function Correcoes({ jur }: Props) {
  return jur === 'ptue' ? <CorrecoesPTUE /> : <CorrecoesBR />
}
