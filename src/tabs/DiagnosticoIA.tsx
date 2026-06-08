import { useRef, useState } from 'react'
import { chamarGemini, DiagnosticoItem } from '../lib/geminiClient'
import { buildUserPrompt, SYSTEM_PROMPT, FormData } from '../lib/promptBuilder'
import { parseMdBoletim } from '../lib/mdParser'

const SINTOMAS = [
  'Vinagre / acetona',
  'Couro / suor de cavalo (Brett)',
  'Rolha / mofo (TCA)',
  'Ovo podre / borracha (H₂S)',
  'Oxidado / ranço / sherry',
  'Gerânio / sardinheiras',
  'Gosto de rato',
  'Gás indesejado / refermentação',
  'Turvação',
  'Cor alterada',
]

const TIPOS = ['Tinto seco', 'Tinto doce', 'Branco seco', 'Branco doce', 'Rosé seco', 'Espumante']
const FASES = ['Fermentação', 'Pós-fermentação / trasfega', 'Estágio / barrica', 'Pré-engarrafamento', 'Pós-engarrafamento']

const URGENCIA_COR: Record<string, string> = {
  imediata: 'bg-red-900/40 text-red-300 border-red-700/40',
  moderada: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  preventiva: 'bg-green-900/40 text-green-300 border-green-700/40',
}

interface Props {
  apiKey: string
  onApiKey: () => void
  jurisdicao: 'ptue' | 'br'
  initialForm?: Partial<FormData>
}

function DiagCard({ d, jur }: { d: DiagnosticoItem; jur: 'ptue' | 'br' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="card border-stone-700">
      <button
        className="w-full flex items-start gap-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="w-7 h-7 rounded-full bg-wine-900 border border-wine-700 flex items-center justify-center text-wine-300 text-sm font-semibold shrink-0 mt-0.5">
          {d.posicao}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-stone-100">{d.defeito}</span>
            <span className={`badge-${d.confianca}`}>{d.confianca}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${URGENCIA_COR[d.urgencia] ?? ''}`}>
              {d.urgencia}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              d.reversivel
                ? 'bg-green-900/30 text-green-300 border-green-700/30'
                : 'bg-red-900/30 text-red-300 border-red-700/30'
            }`}>
              {d.reversivel ? 'reversível' : 'irreversível'}
            </span>
          </div>
          <p className="text-xs text-stone-400 line-clamp-1">{d.causa}</p>
        </div>
        <span className="text-stone-500 mt-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3 border-t border-stone-800 pt-4">
          {d.compostos_marcadores.length > 0 && (
            <div>
              <p className="section-title">Compostos marcadores</p>
              <div className="flex flex-wrap gap-1.5">
                {d.compostos_marcadores.map((c, i) => (
                  <span key={i} className="text-xs bg-stone-800 border border-stone-700 text-stone-300 px-2 py-1 rounded-md font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="section-title">Causa</p>
            <p className="text-sm text-stone-300">{d.causa}</p>
          </div>

          <div>
            <p className="section-title">Confirmação analítica</p>
            <div className="space-y-1.5">
              <p className="text-sm text-stone-300">
                <span className="text-stone-500 text-xs mr-1">Principal:</span>
                {d.confirmacao_analitica.metodo_principal}
              </p>
              <p className="text-sm text-stone-300">
                <span className="text-stone-500 text-xs mr-1">Rápido:</span>
                {d.confirmacao_analitica.metodo_rapido}
              </p>
            </div>
          </div>

          <div>
            <p className="section-title">
              Correção — {jur === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 Brasil'}
            </p>
            <p className="text-sm text-stone-300">{d.correcao}</p>
          </div>

          {d.proibicoes && (
            <div className="alert-err">
              <span className="font-medium">⚠ Proibições:</span> {d.proibicoes}
            </div>
          )}

          <p className="legal-ref">Ref. legal: {d.referencia_legal}</p>
        </div>
      )}
    </div>
  )
}

export default function DiagnosticoIA({ apiKey, onApiKey, jurisdicao, initialForm }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormData>({
    tipo: initialForm?.tipo ?? 'Tinto seco',
    fase: initialForm?.fase ?? 'Estágio / barrica',
    tav: initialForm?.tav ?? '',
    ph: initialForm?.ph ?? '',
    so2Livre: initialForm?.so2Livre ?? '',
    av: initialForm?.av ?? '',
    acidezTotal: initialForm?.acidezTotal ?? '',
    so2Total: initialForm?.so2Total ?? '',
    esr: initialForm?.esr ?? '',
    sintomas: initialForm?.sintomas ?? [],
    sintomaOutro: initialForm?.sintomaOutro ?? '',
    jurisdicao,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Awaited<ReturnType<typeof chamarGemini>> | null>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  const jur = jurisdicao

  const toggleSintoma = (s: string) => {
    setForm((f) => ({
      ...f,
      sintomas: f.sintomas.includes(s) ? f.sintomas.filter((x) => x !== s) : [...f.sintomas, s],
    }))
  }

  const handleImportMd = async (file: File) => {
    try {
      const texto = await file.text()
      const parsed = parseMdBoletim(texto)
      setForm((f) => ({
        ...f,
        tipo: parsed.tipo ?? f.tipo,
        tav: parsed.tav ?? f.tav,
        ph: parsed.ph ?? f.ph,
        so2Livre: parsed.so2Livre ?? f.so2Livre,
        so2Total: parsed.so2Total ?? f.so2Total,
        av: parsed.av ?? f.av,
        acidezTotal: parsed.acidezTotal ?? f.acidezTotal,
        esr: parsed.esr ?? f.esr,
      }))
      setImportMsg(`Importado: ${parsed.amostra || parsed.lote || file.name}`)
      setTimeout(() => setImportMsg(null), 4000)
    } catch {
      setImportMsg('Erro ao importar o ficheiro.')
      setTimeout(() => setImportMsg(null), 4000)
    }
  }

  const handleSubmit = async () => {
    if (!apiKey) { onApiKey(); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await chamarGemini(apiKey, SYSTEM_PROMPT, buildUserPrompt({ ...form, jurisdicao: jur }))
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Import boletim */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn-ghost text-xs flex items-center gap-2"
          title="Importar boletim .md exportado pelo Vinho-Lab Companheiro"
        >
          📄 Importar boletim (.md)
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".md,text/markdown"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleImportMd(f)
            e.target.value = ''
          }}
        />
        {importMsg && (
          <span className="text-xs text-green-400">{importMsg}</span>
        )}
      </div>

      {/* Contexto do vinho */}
      <div className="card">
        <p className="section-title">Contexto do vinho</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-2">
            <label className="label">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <label className="label">Fase</label>
            <select value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value })}>
              {FASES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="label">TAV (% vol)</label>
            <input type="number" step="0.1" min="7" max="17" placeholder="13.5"
              value={form.tav} onChange={(e) => setForm({ ...form, tav: e.target.value })} />
          </div>
          <div>
            <label className="label">pH</label>
            <input type="number" step="0.01" min="2.8" max="4.5" placeholder="3.65"
              value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} />
          </div>
          <div>
            <label className="label">SO₂ livre (mg/L)</label>
            <input type="number" step="1" min="0" placeholder="28"
              value={form.so2Livre} onChange={(e) => setForm({ ...form, so2Livre: e.target.value })} />
          </div>
          <div>
            <label className="label">SO₂ total (mg/L)</label>
            <input type="number" step="1" min="0" placeholder="85"
              value={form.so2Total} onChange={(e) => setForm({ ...form, so2Total: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Parâmetros analíticos */}
      <div className="card">
        <p className="section-title">Parâmetros analíticos <span className="text-stone-500 normal-case font-normal">(opcional)</span></p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">AV (mEq/L)</label>
            <input type="number" step="0.1" placeholder="12"
              value={form.av} onChange={(e) => setForm({ ...form, av: e.target.value })} />
          </div>
          <div>
            <label className="label">Acidez total (mEq/L)</label>
            <input type="number" step="0.5" placeholder="65"
              value={form.acidezTotal} onChange={(e) => setForm({ ...form, acidezTotal: e.target.value })} />
          </div>
          <div>
            <label className="label">ESR (g/L)</label>
            <input type="number" step="0.1" placeholder="22"
              value={form.esr} onChange={(e) => setForm({ ...form, esr: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Sintomas */}
      <div className="card">
        <p className="section-title">Sintomas sensoriais e físicos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {SINTOMAS.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.sintomas.includes(s)}
                onChange={() => toggleSintoma(s)}
                className="w-4 h-4 accent-wine-600 shrink-0"
              />
              <span className="text-sm text-stone-300 group-hover:text-stone-100">{s}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="label">Outro sintoma</label>
          <input type="text" placeholder="Descreva sintoma adicional..."
            value={form.sintomaOutro} onChange={(e) => setForm({ ...form, sintomaOutro: e.target.value })} />
        </div>
      </div>

      {/* Ação */}
      {!apiKey && (
        <div className="alert-warn">
          🔑 Configure a chave API Gemini antes de diagnosticar.{' '}
          <button onClick={onApiKey} className="underline">Configurar agora</button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (form.sintomas.length === 0 && !form.sintomaOutro.trim())}
        className="btn-primary w-full py-3 text-base"
      >
        {loading ? '⏳ A analisar…' : `🤖 Diagnosticar com Gemini — ${jur === 'ptue' ? 'PT/UE' : 'Brasil'}`}
      </button>

      {/* Erro */}
      {error && <div className="alert-err">{error}</div>}

      {/* Resultado */}
      {result && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          <h3 className="text-base font-semibold text-stone-200">
            Diagnóstico diferencial — {jur === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 Brasil'}
          </h3>

          {result.diagnosticos.filter(Boolean).map((d) => (
            <DiagCard key={d!.posicao} d={d!} jur={jur} />
          ))}

          {result.confirmacao_prioritaria && (
            <div className="card bg-stone-800/60">
              <p className="section-title">Exame prioritário</p>
              <p className="text-sm text-stone-300">{result.confirmacao_prioritaria}</p>
            </div>
          )}

          {result.observacoes && (
            <div className="card bg-stone-800/60">
              <p className="section-title">Observações adicionais</p>
              <p className="text-sm text-stone-300">{result.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
