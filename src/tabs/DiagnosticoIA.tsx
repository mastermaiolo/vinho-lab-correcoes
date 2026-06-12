import { useEffect, useRef, useState } from 'react'
import { chamarIA, DiagnosticoItem, DiagnosticoResponse, AIConfig, PROVIDER_LABELS, PROVIDER_MODELS } from '../lib/aiClient'
import { DATA_VERSION } from '../data/version'
import { buildUserPrompt, SYSTEM_PROMPT, FormData } from '../lib/promptBuilder'
import { parseMdBoletim, isSessionCompanheiro, parseSessionCompanheiro } from '../lib/mdParser'
import { so2Molecular } from '../lib/calculadoras'
import { guardarHistorico, EntradaHistorico } from '../lib/historico'
import PrivacyConsentModal from '../components/PrivacyConsentModal'
import { useI18n } from '../components/I18nProvider'

// Os valores canónicos (PT) são o que vai no formulário, histórico e prompt da IA;
// a chave i18n serve apenas para a exibição na UI
const SINTOMAS: { id: string; valor: string }[] = [
  { id: 'vinagre', valor: 'Vinagre / acetona' },
  { id: 'brett', valor: 'Couro / suor de cavalo (Brett)' },
  { id: 'tca', valor: 'Rolha / mofo (TCA)' },
  { id: 'h2s', valor: 'Ovo podre / borracha (H₂S)' },
  { id: 'oxidado', valor: 'Oxidado / ranço / sherry' },
  { id: 'geranio', valor: 'Gerânio / sardinheiras' },
  { id: 'rato', valor: 'Gosto de rato' },
  { id: 'gas', valor: 'Gás indesejado / refermentação' },
  { id: 'turvacao', valor: 'Turvação' },
  { id: 'cor', valor: 'Cor alterada' },
]

const TIPOS: { id: string; valor: string }[] = [
  { id: 'tinto_seco', valor: 'Tinto seco' },
  { id: 'tinto_doce', valor: 'Tinto doce' },
  { id: 'branco_seco', valor: 'Branco seco' },
  { id: 'branco_doce', valor: 'Branco doce' },
  { id: 'rose_seco', valor: 'Rosé seco' },
  { id: 'espumante', valor: 'Espumante' },
]

const FASES: { id: string; valor: string }[] = [
  { id: 'fermentacao', valor: 'Fermentação' },
  { id: 'pos_fermentacao', valor: 'Pós-fermentação / trasfega' },
  { id: 'estagio', valor: 'Estágio / barrica' },
  { id: 'pre_engarrafamento', valor: 'Pré-engarrafamento' },
  { id: 'pos_engarrafamento', valor: 'Pós-engarrafamento' },
]

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

function exportarMd(form: FormData, result: DiagnosticoResponse, jur: 'ptue' | 'br', config: AIConfig): string {
  const provider = PROVIDER_LABELS[config.provider]
  const model = config.model ?? PROVIDER_MODELS[config.provider]
  const carimbo = `*Gerado por ${provider} (${model}) · dados v${DATA_VERSION} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}*`
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
    carimbo,
    `*Vinho-Lab Correções — ferramenta de apoio, não substitui aconselhamento enológico profissional.*`,
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
  aiConfig: AIConfig
  onApiKey: () => void
  jurisdicao: 'ptue' | 'br'
  initialForm?: Partial<FormData>
  historicoInicial?: EntradaHistorico
  onNovoDiagnostico: () => void
}

function DiagCard({ d, jur }: { d: DiagnosticoItem; jur: 'ptue' | 'br' }) {
  const { t } = useI18n()
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
              {d.reversivel ? t('diag.result.reversivel.sim') : t('diag.result.reversivel.nao')}
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
              <p className="section-title">{t('diag.result.marcadores')}</p>
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
            <p className="section-title">{t('diag.result.causa')}</p>
            <p className="text-sm text-stone-300">{d.causa}</p>
          </div>

          <div>
            <p className="section-title">{t('diag.result.confirmacao')}</p>
            <div className="space-y-1.5">
              <p className="text-sm text-stone-300">
                <span className="text-stone-500 text-xs mr-1">{t('diag.result.metodo_principal')}:</span>
                {d.confirmacao_analitica.metodo_principal}
              </p>
              <p className="text-sm text-stone-300">
                <span className="text-stone-500 text-xs mr-1">{t('diag.result.metodo_rapido')}:</span>
                {d.confirmacao_analitica.metodo_rapido}
              </p>
            </div>
          </div>

          <div>
            <p className="section-title">
              {t('diag.result.correcao')} — {jur === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 Brasil'}
            </p>
            <p className="text-sm text-stone-300">{d.correcao}</p>
          </div>

          {d.proibicoes && (
            <div className="alert-err">
              <span className="font-medium">⚠ {t('diag.result.proibicoes', { jur: jur === 'ptue' ? 'PT/UE' : 'BR' })}:</span> {d.proibicoes}
            </div>
          )}

          <p className="legal-ref">{t('diag.result.legal')}: {d.referencia_legal}</p>
        </div>
      )}
    </div>
  )
}

export default function DiagnosticoIA({ aiConfig, onApiKey, jurisdicao, initialForm, historicoInicial, onNovoDiagnostico }: Props) {
  const { t, locale } = useI18n()
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
  // 'gemini_privacy_consent' é a chave antiga — aceite por retrocompatibilidade
  const privacyConsent = () =>
    sessionStorage.getItem('vl_privacy_consent') === '1' ||
    sessionStorage.getItem('gemini_privacy_consent') === '1'

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

  const applyParsed = (parsed: ReturnType<typeof parseMdBoletim>, label: string) => {
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
    setImportMsg(t('diag.import.ok', { label }))
    setTimeout(() => setImportMsg(null), 4000)
  }

  const handleImportMd = async (file: File) => {
    try {
      const texto = await file.text()

      // Tenta JSON do companheiro primeiro
      if (file.name.endsWith('.json')) {
        const raw = JSON.parse(texto)
        if (isSessionCompanheiro(raw)) {
          const parsed = parseSessionCompanheiro(raw)
          applyParsed(parsed, parsed.amostra || parsed.lote || file.name)
          return
        }
        setImportMsg(t('diag.import.unrecognized'))
        setTimeout(() => setImportMsg(null), 4000)
        return
      }

      // .md boletim
      const parsed = parseMdBoletim(texto)
      applyParsed(parsed, parsed.amostra || parsed.lote || file.name)
    } catch {
      setImportMsg(t('diag.import.error'))
      setTimeout(() => setImportMsg(null), 4000)
    }
  }

  const runDiagnosis = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await chamarIA(aiConfig, SYSTEM_PROMPT, buildUserPrompt({ ...form, jurisdicao: jur }, locale))
      setResult(res)
      guardarHistorico({
        jurisdicao: jur,
        tipo: form.tipo,
        fase: form.fase,
        sintomas: form.sintomas,
        resultado: res,
        formSnapshot: { ...form, jurisdicao: jur },
        provider: aiConfig.provider,
        model: aiConfig.model ?? PROVIDER_MODELS[aiConfig.provider],
        dataVersion: DATA_VERSION,
      })
      onNovoDiagnostico()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!aiConfig.apiKey) { onApiKey(); return }
    if (!privacyConsent()) { setShowPrivacy(true); return }
    runDiagnosis()
  }

  const handlePrivacyAccept = () => {
    sessionStorage.setItem('vl_privacy_consent', '1')
    setShowPrivacy(false)
    runDiagnosis()
  }

  return (
    <div className="space-y-6">
      {showPrivacy && (
        <PrivacyConsentModal
          provider={aiConfig.provider}
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
          title="Importar boletim .md ou sessão .json do Vinho-Lab Companheiro"
        >
          {t('diag.import')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".md,.json,text/markdown,application/json"
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
        <p className="section-title">{t('diag.section.context')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-2">
            <label className="label">{t('diag.field.tipo')}</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              {TIPOS.map((tp) => <option key={tp.id} value={tp.valor}>{t(`tipo.${tp.id}`)}</option>)}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <label className="label">{t('diag.field.fase')}</label>
            <select value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value })}>
              {FASES.map((f) => <option key={f.id} value={f.valor}>{t(`fase.${f.id}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{t('diag.field.tav')}</label>
            <input type="number" step="0.1" min="7" max="17" placeholder="13.5"
              value={form.tav} onChange={(e) => setForm({ ...form, tav: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('diag.field.ph')}</label>
            <input type="number" step="0.01" min="2.8" max="4.5" placeholder="3.65"
              value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('diag.field.so2livre')}</label>
            <input type="number" step="1" min="0" placeholder="28"
              value={form.so2Livre} onChange={(e) => setForm({ ...form, so2Livre: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('diag.field.so2total')}</label>
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
        <p className="section-title">{t('diag.section.analiticos')} <span className="text-stone-500 normal-case font-normal">{t('diag.section.analiticos.opt')}</span></p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">{t('diag.field.av')}</label>
            <input type="number" step="0.1" placeholder="12"
              value={form.av} onChange={(e) => setForm({ ...form, av: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('diag.field.at')}</label>
            <input type="number" step="0.5" placeholder="65"
              value={form.acidezTotal} onChange={(e) => setForm({ ...form, acidezTotal: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('diag.field.esr')}</label>
            <input type="number" step="0.1" placeholder="22"
              value={form.esr} onChange={(e) => setForm({ ...form, esr: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Sintomas */}
      <div className="card">
        <p className="section-title">{t('diag.section.sintomas')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {SINTOMAS.map((s) => (
            <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.sintomas.includes(s.valor)}
                onChange={() => toggleSintoma(s.valor)}
                className="w-4 h-4 accent-wine-600 shrink-0"
              />
              <span className="text-sm text-stone-300 group-hover:text-stone-100">{t(`sintoma.${s.id}`)}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="label">{t('diag.sintoma.outro')}</label>
          <input type="text" placeholder={t('diag.sintoma.outro.placeholder')}
            value={form.sintomaOutro} onChange={(e) => setForm({ ...form, sintomaOutro: e.target.value })} />
        </div>
      </div>

      {/* Ação */}
      {!aiConfig.apiKey && (
        <div className="alert-warn">
          {t('diag.warn.nokey')}{' '}
          <button onClick={onApiKey} className="underline">{t('diag.warn.nokey.link')}</button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (form.sintomas.length === 0 && !form.sintomaOutro.trim())}
        className="btn-primary w-full py-3 text-base"
      >
        {loading ? t('diag.btn.loading') : t('diag.btn.diagnosticar', { jur: jur === 'ptue' ? 'PT/UE' : 'Brasil' })}
      </button>

      {/* Aviso de privacidade inline */}
      <div className="flex items-start gap-2.5 text-xs text-stone-500 leading-relaxed">
        <span className="shrink-0 mt-0.5">🔒</span>
        <p>
          {t('diag.privacy.text').split('**nunca são enviados**')[0]}
          <strong className="text-stone-400">nunca são enviados</strong>
          {t('diag.privacy.text').split('**nunca são enviados**')[1] ?? ''}.
          {privacyConsent()
            ? <span className="text-green-600 ml-1">{t('diag.privacy.consent.given')}</span>
            : <span className="ml-1">{t('diag.privacy.consent.pending')}</span>
          }
        </p>
      </div>

      {/* Erro — t() traduz chaves err.*; mensagens cruas das APIs passam tal-e-qual */}
      {error && <div className="alert-err">{t(error)}</div>}

      {/* Resultado */}
      {result && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-200">
              {t('diag.result.title', { jur: jur === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 Brasil' })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => downloadMd(exportarMd(form, result, jur, aiConfig))}
                className="btn-ghost text-xs flex items-center gap-1.5"
                title="Exportar diagnóstico como ficheiro Markdown"
              >
                {t('diag.result.export.md')}
              </button>
              <button
                onClick={() => window.print()}
                className="btn-ghost text-xs flex items-center gap-1.5"
                title="Imprimir ou guardar como PDF"
              >
                {t('diag.result.export.pdf')}
              </button>
            </div>
          </div>

          {result.diagnosticos.filter(Boolean).map((d) => (
            <DiagCard key={d!.posicao} d={d!} jur={jur} />
          ))}

          {result.confirmacao_prioritaria && (
            <div className="card bg-stone-800/60">
              <p className="section-title">{t('diag.result.confirmacao_prio')}</p>
              <p className="text-sm text-stone-300">{result.confirmacao_prioritaria}</p>
            </div>
          )}

          {result.observacoes && (
            <div className="card bg-stone-800/60">
              <p className="section-title">{t('diag.result.observacoes')}</p>
              <p className="text-sm text-stone-300">{result.observacoes}</p>
            </div>
          )}

          {/* Carimbo de proveniência — auditabilidade */}
          <p className="text-[11px] text-stone-600 font-mono pt-1">
            {t('diag.result.carimbo', {
              provider: PROVIDER_LABELS[aiConfig.provider],
              model: aiConfig.model ?? PROVIDER_MODELS[aiConfig.provider],
              versao: DATA_VERSION,
            })}
          </p>
        </div>
      )}
    </div>
  )
}
