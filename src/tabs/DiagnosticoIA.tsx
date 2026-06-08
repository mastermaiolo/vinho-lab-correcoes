import { useEffect, useRef, useState } from 'react'
import { chamarGemini, DiagnosticoItem, DiagnosticoResponse } from '../lib/geminiClient'
import { buildUserPrompt, SYSTEM_PROMPT, FormData } from '../lib/promptBuilder'
import { parseMdBoletim } from '../lib/mdParser'
import { so2Molecular } from '../lib/calculadoras'
import { guardarHistorico, EntradaHistorico } from '../lib/historico'
import PrivacyConsentModal from '../components/PrivacyConsentModal'

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

interface Aviso { msg: string; tipo: 'warn' | 'err' }

function validarCampos(form: FormData): Aviso[] {
  const avisos: Aviso[] = []
  const tav = parseFloat(form.tav)
  const ph = parseFloat(form.ph)
  const so2 = parseFloat(form.so2Livre)
  const av = parseFloat(form.av)
  const at = parseFloat(form.acidezTotal)

  if (form.tav && (tav < 7 || tav > 17))
    avisos.push({ msg: `TAV ${tav}% fora do intervalo típico (7–17% vol)`, tipo: 'warn' })
  if (form.ph && (ph < 2.8 || ph > 4.2))
    avisos.push({ msg: `pH ${ph} fora do intervalo vinícola (2,8–4,2)`, tipo: ph > 4.5 ? 'err' : 'warn' })
  if (form.so2Livre && so2 > 80)
    avisos.push({ msg: `SO₂ livre ${so2} mg/L elevado — verifique se é correto`, tipo: 'warn' })
  
  // Limite dinâmico de acidez volátil (AV) conforme legislação
  const avMax = (form.jurisdicao === 'ptue' && !form.tipo.toLowerCase().includes('tinto')) ? 18 : 20
  if (form.av && av > avMax) {
    avisos.push({ 
      msg: `AV ${av} mEq/L excede o limite legal de ${avMax} mEq/L para este tipo de vinho (${form.jurisdicao === 'ptue' ? 'PT/UE' : 'Brasil'})`, 
      tipo: 'err' 
    })
  }

  if (form.acidezTotal && at < 30)
    avisos.push({ msg: `Acidez total ${at} mEq/L muito baixa — valor suspeito`, tipo: 'warn' })
  return avisos
}

function exportarMd(form: FormData, result: DiagnosticoResponse, jur: 'ptue' | 'br'): string {
  const linhas = [
    `# Diagnóstico Vinho-Lab — ${jur === 'ptue' ? 'PT/UE' : 'Brasil'}`,
    ``,
    `**Vinho:** ${form.tipo} · ${form.fase}`,
    `**TAV:** ${form.tav || '—'} % vol · **pH:** ${form.ph || '—'}`,
    `**SO₂ livre:** ${form.so2Livre || '—'} mg/L · **SO₂ total:** ${form.so2Total || '—'} mg/L`,
    form.av ? `**AV:** ${form.av} mEq/L` : '',
    form.acidezTotal ? `**AT:** ${form.acidezTotal} mEq/L` : '',
    form.esr ? `**ESR:** ${form.esr} g/L` : '',
    ``,
    `**Sintomas:** ${[...form.sintomas, form.sintomaOutro.trim()].filter(Boolean).join(', ') || '—'}`,
    ``,
    `---`,
    ``,
    `## Diagnóstico Diferencial`,
    ``,
    ...result.diagnosticos.filter(Boolean).map((d) => [
      `### ${d!.posicao}. ${d!.defeito} (${d!.confianca} · ${d!.urgencia})`,
      ``,
      `**Causa:** ${d!.causa}`,
      ``,
      `**Correção (${jur === 'ptue' ? 'PT/UE' : 'BR'}):** ${d!.correcao}`,
      d!.proibicoes ? `\n**⚠ Proibições:** ${d!.proibicoes}` : '',
      ``,
      `*Ref. legal: ${d!.referencia_legal}*`,
      ``,
    ].filter((l) => l !== '').join('\n')),
    result.confirmacao_prioritaria ? `---\n\n**Exame prioritário:** ${result.confirmacao_prioritaria}\n` : '',
    result.observacoes ? `**Observações:** ${result.observacoes}\n` : '',
    `---`,
    `*Gerado por Vinho-Lab Correções — ferramenta de apoio, não substitui aconselhamento enológico profissional.*`,
  ]
  return linhas.filter((l) => l !== '').join('\n')
}

function downloadMd(conteudo: string) {
  const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diagnostico-vinho-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  apiKey: string
  onApiKey: () => void
  jurisdicao: 'ptue' | 'br'
  initialForm?: Partial<FormData>
  historicoInicial?: EntradaHistorico
  onNovoDiagnostico: () => void
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

export default function DiagnosticoIA({ apiKey, onApiKey, jurisdicao, initialForm, historicoInicial, onNovoDiagnostico }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormData>(() => ({
    tipo: historicoInicial?.formSnapshot.tipo ?? initialForm?.tipo ?? 'Tinto seco',
    fase: historicoInicial?.formSnapshot.fase ?? initialForm?.fase ?? 'Estágio / barrica',
    tav: historicoInicial?.formSnapshot.tav ?? initialForm?.tav ?? '',
    ph: historicoInicial?.formSnapshot.ph ?? initialForm?.ph ?? '',
    so2Livre: historicoInicial?.formSnapshot.so2Livre ?? initialForm?.so2Livre ?? '',
    av: historicoInicial?.formSnapshot.av ?? initialForm?.av ?? '',
    acidezTotal: historicoInicial?.formSnapshot.acidezTotal ?? initialForm?.acidezTotal ?? '',
    so2Total: historicoInicial?.formSnapshot.so2Total ?? initialForm?.so2Total ?? '',
    esr: historicoInicial?.formSnapshot.esr ?? initialForm?.esr ?? '',
    sintomas: historicoInicial?.formSnapshot.sintomas ?? initialForm?.sintomas ?? [],
    sintomaOutro: historicoInicial?.formSnapshot.sintomaOutro ?? initialForm?.sintomaOutro ?? '',
    jurisdicao,
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DiagnosticoResponse | null>(() => historicoInicial?.resultado ?? null)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const privacyConsent = () => sessionStorage.getItem('gemini_privacy_consent') === '1'

  // Sync jurisdição prop → form
  useEffect(() => {
    setForm((f) => ({ ...f, jurisdicao }))
  }, [jurisdicao])

  const jur = jurisdicao

  // SO₂ molecular em tempo real
  const phN = parseFloat(form.ph)
  const so2N = parseFloat(form.so2Livre)
  const so2Mol = form.ph && form.so2Livre && phN > 0 && so2N >= 0
    ? so2Molecular(so2N, phN)
    : null

  const avisos = validarCampos(form)

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

  const runDiagnosis = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await chamarGemini(apiKey, SYSTEM_PROMPT, buildUserPrompt({ ...form, jurisdicao: jur }))
      setResult(res)
      guardarHistorico({
        jurisdicao: jur,
        tipo: form.tipo,
        fase: form.fase,
        sintomas: form.sintomas,
        resultado: res,
        formSnapshot: { ...form, jurisdicao: jur },
      })
      onNovoDiagnostico()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!apiKey) { onApiKey(); return }
    if (!privacyConsent()) { setShowPrivacy(true); return }
    runDiagnosis()
  }

  const handlePrivacyAccept = () => {
    sessionStorage.setItem('gemini_privacy_consent', '1')
    setShowPrivacy(false)
    runDiagnosis()
  }

  return (
    <div className="space-y-6">
      {showPrivacy && (
        <PrivacyConsentModal
          onAccept={handlePrivacyAccept}
          onCancel={() => setShowPrivacy(false)}
        />
      )}

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

        {/* SO₂ molecular em tempo real */}
        {so2Mol !== null && (
          <div className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
            so2Mol >= 0.4
              ? 'bg-green-900/20 border-green-700/30 text-green-300'
              : 'bg-amber-900/20 border-amber-700/30 text-amber-300'
          }`}>
            <span className="font-mono font-semibold">SO₂ mol: {so2Mol.toFixed(3)} mg/L</span>
            <span className="text-stone-500">·</span>
            <span>{so2Mol >= 0.4 ? '✅ Protecção antimicrobiana efetiva (≥0,4 mg/L)' : '⚠ Insuficiente — alvo ≥ 0,4 mg/L'}</span>
          </div>
        )}

        {/* Avisos de validação */}
        {avisos.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {avisos.map((a, i) => (
              <div key={i} className={a.tipo === 'err' ? 'alert-err' : 'alert-warn'}>
                {a.tipo === 'err' ? '❌' : '⚠'} {a.msg}
              </div>
            ))}
          </div>
        )}
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

      {/* Aviso de privacidade inline */}
      <div className="flex items-start gap-2.5 text-xs text-stone-500 leading-relaxed">
        <span className="shrink-0 mt-0.5">🔒</span>
        <p>
          Os parâmetros analíticos e sintomas são enviados à API Google Gemini para processamento.
          Nome da amostra, lote e responsável <strong className="text-stone-400">nunca são enviados</strong>.
          {privacyConsent()
            ? <span className="text-green-600 ml-1">Consentimento dado para esta sessão.</span>
            : <span className="ml-1">Será solicitado consentimento antes do primeiro diagnóstico.</span>
          }
        </p>
      </div>

      {/* Erro */}
      {error && <div className="alert-err">{error}</div>}

      {/* Resultado */}
      {result && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-200">
              Diagnóstico diferencial — {jur === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 Brasil'}
            </h3>
            <button
              onClick={() => downloadMd(exportarMd(form, result, jur))}
              className="btn-ghost text-xs flex items-center gap-1.5"
              title="Exportar diagnóstico como ficheiro Markdown"
            >
              ⬇ Exportar .md
            </button>
          </div>

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
