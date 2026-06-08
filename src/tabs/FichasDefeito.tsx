import { useState } from 'react'
import defeitos from '../data/defeitos.json'
import { useI18n } from '../components/I18nProvider'

interface CompostoMarcador {
  nome: string
  formula?: string
  limiar_percepcao?: string
  zona_risco?: string
  nota?: string
}

interface Defeito {
  id: string
  nome: string
  categoria: string
  compostos_marcadores?: CompostoMarcador[] | string[]
  descritores_sensoriais?: string[]
  causa?: string
  favorecido_por?: string[]
  confirmacao_analitica?: {
    metodo_principal?: string
    metodo_rapido?: string
    interpretacao?: string
  }
  correcao?: {
    pt_ue?: string
    br?: string
  }
  prevencao?: string[]
  reversivel?: boolean
}

const CAT_LABEL: Record<string, string> = {
  microbiologico: 'Microbiológico',
  quimico: 'Químico',
  fisico_quimico: 'Físico-Químico',
}
const CAT_COR: Record<string, string> = {
  microbiologico: 'bg-red-900/40 text-red-300 border-red-700/40',
  quimico: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  fisico_quimico: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
}

interface Props {
  jur: 'ptue' | 'br'
  onDiagnosticar: (sintomas: string[]) => void
}

function Ficha({ d, jur, onDiagnosticar }: { d: Defeito; jur: 'ptue' | 'br'; onDiagnosticar: (s: string[]) => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <div className="card border-stone-800">
      <button className="w-full flex items-start gap-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-stone-500">{d.id}</span>
            <span className="font-semibold text-stone-100">{d.nome}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CAT_COR[d.categoria] ?? ''}`}>
              {CAT_LABEL[d.categoria] ?? d.categoria}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              d.reversivel
                ? 'bg-green-900/30 text-green-300 border-green-700/30'
                : 'bg-red-900/30 text-red-300 border-red-700/30'
            }`}>
              {d.reversivel ? 'reversível' : 'irreversível'}
            </span>
          </div>
          {d.descritores_sensoriais && (
            <p className="text-xs text-stone-500">{d.descritores_sensoriais.slice(0, 4).join(' · ')}</p>
          )}
        </div>
        <span className="text-stone-500 mt-0.5 shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 border-t border-stone-800 pt-4 space-y-4">
          {d.descritores_sensoriais && (
            <div>
              <p className="section-title">Descritores sensoriais</p>
              <div className="flex flex-wrap gap-1.5">
                {d.descritores_sensoriais.map((s, i) => (
                  <span key={i} className="text-xs bg-stone-800 border border-stone-700 text-stone-300 px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
            </div>
          )}

          {d.compostos_marcadores && d.compostos_marcadores.length > 0 && (
            <div>
              <p className="section-title">Compostos marcadores</p>
              <div className="space-y-2">
                {d.compostos_marcadores.map((c, i) => {
                  if (typeof c === 'string') {
                    return (
                      <span key={i} className="inline-block font-mono text-sm bg-stone-800 border border-stone-700 text-stone-300 px-2 py-1 rounded-md mr-1.5 mb-1">
                        {c}
                      </span>
                    )
                  }
                  return (
                    <div key={i} className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-mono text-sm text-stone-200">{c.nome}</span>
                        {c.formula && <span className="text-xs text-stone-500 font-mono">{c.formula}</span>}
                      </div>
                      {c.limiar_percepcao && <p className="text-xs text-stone-400 mt-0.5">Limiar: {c.limiar_percepcao}</p>}
                      {c.zona_risco && <p className="text-xs text-stone-500 mt-0.5">{c.zona_risco}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {d.causa && (
            <div>
              <p className="section-title">Causa</p>
              <p className="text-sm text-stone-300">{d.causa}</p>
            </div>
          )}

          {d.favorecido_por && (
            <div>
              <p className="section-title">Favorecido por</p>
              <ul className="space-y-0.5">
                {d.favorecido_por.map((f, i) => (
                  <li key={i} className="text-sm text-stone-400 flex gap-2">
                    <span className="text-stone-600">·</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.confirmacao_analitica && (
            <div>
              <p className="section-title">Confirmação analítica</p>
              <div className="space-y-1">
                {d.confirmacao_analitica.metodo_principal && (
                  <p className="text-sm text-stone-300">
                    <span className="text-stone-500 text-xs mr-1">Principal:</span>
                    {d.confirmacao_analitica.metodo_principal}
                  </p>
                )}
                {d.confirmacao_analitica.metodo_rapido && (
                  <p className="text-sm text-stone-300">
                    <span className="text-stone-500 text-xs mr-1">Rápido:</span>
                    {d.confirmacao_analitica.metodo_rapido}
                  </p>
                )}
                {d.confirmacao_analitica.interpretacao && (
                  <p className="text-xs text-stone-500 mt-1 italic">{d.confirmacao_analitica.interpretacao}</p>
                )}
              </div>
            </div>
          )}

          {d.correcao && (
            <div>
              <p className="section-title">Correção</p>
              {jur === 'ptue' && d.correcao.pt_ue && (
                <div className="mb-2">
                  <span className="text-xs text-stone-500 mr-1">🇵🇹 PT/UE:</span>
                  <span className="text-sm text-stone-300">{d.correcao.pt_ue}</span>
                </div>
              )}
              {jur === 'br' && d.correcao.br && (
                <div>
                  <span className="text-xs text-stone-500 mr-1">🇧🇷 Brasil:</span>
                  <span className="text-sm text-stone-300">{d.correcao.br}</span>
                </div>
              )}
            </div>
          )}

          {d.prevencao && (
            <div>
              <p className="section-title">Prevenção</p>
              <ul className="space-y-0.5">
                {d.prevencao.map((p, i) => (
                  <li key={i} className="text-sm text-stone-400 flex gap-2">
                    <span className="text-green-600 shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onDiagnosticar(d.descritores_sensoriais ?? [])}
            className="btn-ghost text-xs w-full mt-2"
          >
            {t('fichas.btn.diagnosticar')} →
          </button>
        </div>
      )}
    </div>
  )
}

export default function FichasDefeito({ jur, onDiagnosticar }: Props) {
  const { t } = useI18n()
  const [search, setSearch] = useState('')

  const lista = (defeitos as unknown as Defeito[]).filter((d) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      d.nome.toLowerCase().includes(q) ||
      d.descritores_sensoriais?.some((s) => s.toLowerCase().includes(q)) ||
      d.compostos_marcadores?.some((c) =>
        (typeof c === 'string' ? c : c.nome).toLowerCase().includes(q)
      )
    )
  })

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder={t('fichas.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {lista.length === 0 && (
        <p className="text-stone-500 text-sm text-center py-8">Nenhum defeito encontrado.</p>
      )}
      {lista.map((d) => (
        <Ficha key={d.id} d={d} jur={jur} onDiagnosticar={onDiagnosticar} />
      ))}
    </div>
  )
}
