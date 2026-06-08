import { useState } from 'react'
import produtos from '../data/produtos_correcao.json'

type Jur = 'ptue' | 'br'

interface Props {
  jur: Jur
}

interface Produto {
  nome: string
  formula?: string
  fator_so2?: number
  dose_tipica_g_hL?: string
  dose_max_g_hL?: number
  dose_max_g_L?: number
  dose_equivalente_calculo?: string
  concentracao_g_L?: number
  acção?: string
  descricao?: string
  aviso?: string
  aviso_ue?: string
  nota?: string
  fase?: string[]
  fase_pt_ue?: string[]
  fase_brasil?: string[]
  pt_ue?: boolean | string
  brasil?: boolean | string
  fonte_ue?: string
}

interface Categoria {
  title: string
  produtos: Record<string, Produto>
}

const ICONES: Record<string, string> = {
  so2: '🛡️',
  acidificacao: '🍋',
  desacidificacao: '⬇️',
  enriquecimento: '🍇',
  clarificacao: '✨',
}

function BadgeJur({ ok, label }: { ok: boolean | string; label: string }) {
  const partial = typeof ok === 'string'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
      !ok ? 'bg-red-900/30 text-red-300 border-red-700/30'
        : partial ? 'bg-amber-900/30 text-amber-300 border-amber-700/30'
        : 'bg-green-900/30 text-green-300 border-green-700/30'
    }`}>
      {label}: {!ok ? 'Proibido' : partial ? 'Parcial' : 'Autorizado'}
    </span>
  )
}

function CardProduto({ p, jur }: { id: string; p: Produto; jur: Jur }) {
  const [open, setOpen] = useState(false)

  const jurOk = jur === 'ptue' ? p.pt_ue : p.brasil
  const bloqueado = jurOk === false

  return (
    <div className={`card border-stone-800 ${bloqueado ? 'opacity-60' : ''}`}>
      <button className="w-full flex items-start gap-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-stone-100 text-sm">{p.nome}</span>
            {p.formula && <span className="font-mono text-xs text-stone-500">{p.formula}</span>}
            {bloqueado && (
              <span className="text-xs px-2 py-0.5 rounded-full border bg-red-900/30 text-red-300 border-red-700/30 font-medium">
                ❌ Proibido {jur === 'ptue' ? 'PT/UE' : 'BR'}
              </span>
            )}
          </div>
          {p.descricao && !open && (
            <p className="text-xs text-stone-500 line-clamp-1">{p.descricao}</p>
          )}
        </div>
        <span className="text-stone-500 mt-0.5 shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 border-t border-stone-800 pt-3 space-y-2.5">
          {p.descricao && <p className="text-sm text-stone-300">{p.descricao}</p>}
          {p.acção && (
            <div>
              <p className="section-title">Mecanismo de ação</p>
              <p className="text-sm text-stone-300">{p.acção}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            {p.dose_tipica_g_hL && (
              <div className="bg-stone-800 rounded-lg p-2.5">
                <p className="text-stone-500 mb-0.5">Dose típica</p>
                <p className="text-stone-200 font-mono">{p.dose_tipica_g_hL} g/hL</p>
              </div>
            )}
            {p.dose_max_g_hL && (
              <div className="bg-stone-800 rounded-lg p-2.5">
                <p className="text-stone-500 mb-0.5">Dose máxima</p>
                <p className="text-stone-200 font-mono">{p.dose_max_g_hL} g/hL</p>
              </div>
            )}
            {p.fator_so2 && (
              <div className="bg-stone-800 rounded-lg p-2.5">
                <p className="text-stone-500 mb-0.5">Factor SO₂</p>
                <p className="text-stone-200 font-mono">{p.fator_so2}</p>
              </div>
            )}
            {p.concentracao_g_L && (
              <div className="bg-stone-800 rounded-lg p-2.5">
                <p className="text-stone-500 mb-0.5">Concentração</p>
                <p className="text-stone-200 font-mono">{p.concentracao_g_L} g/L</p>
              </div>
            )}
          </div>

          {p.dose_equivalente_calculo && (
            <div className="bg-stone-800/60 rounded-lg px-3 py-2 font-mono text-xs text-stone-300">
              {p.dose_equivalente_calculo}
            </div>
          )}

          {(p.fase || p.fase_pt_ue || p.fase_brasil) && (
            <div>
              <p className="section-title">Fase de aplicação</p>
              <div className="flex flex-wrap gap-1">
                {(p.fase ?? []).map((f, i) => (
                  <span key={i} className="text-xs bg-stone-800 border border-stone-700 text-stone-400 px-2 py-0.5 rounded">{f}</span>
                ))}
                {p.fase_pt_ue && <span className="text-xs text-stone-500">PT/UE: {p.fase_pt_ue.join(', ')}</span>}
                {p.fase_brasil && <span className="text-xs text-stone-500">BR: {p.fase_brasil.join(', ')}</span>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <BadgeJur ok={p.pt_ue ?? false} label="PT/UE" />
            <BadgeJur ok={p.brasil ?? false} label="Brasil" />
          </div>

          {(p.aviso || p.aviso_ue || p.nota) && (
            <div className="alert-warn text-xs">
              ⚠ {p.aviso ?? p.aviso_ue ?? p.nota}
            </div>
          )}

          {p.fonte_ue && <p className="legal-ref">{p.fonte_ue}</p>}
        </div>
      )}
    </div>
  )
}

export default function Produtos({ jur }: Props) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<string | null>(null)

  const cats = produtos as Record<string, Categoria>
  const catKeys = Object.keys(cats)

  const filtrar = (p: Produto) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.nome.toLowerCase().includes(q) ||
      (p.formula ?? '').toLowerCase().includes(q) ||
      (p.descricao ?? '').toLowerCase().includes(q) ||
      (p.acção ?? '').toLowerCase().includes(q)
    )
  }

  return (
    <div className="space-y-5">
      {/* Pesquisa e filtro */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Pesquisar produto, fórmula, mecanismo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setCat(null)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              cat === null ? 'border-wine-600 text-wine-300 bg-wine-900/30' : 'border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            Todos
          </button>
          {catKeys.map((k) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                cat === k ? 'border-wine-600 text-wine-300 bg-wine-900/30' : 'border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              {ICONES[k] ?? ''} {cats[k].title}
            </button>
          ))}
        </div>
      </div>

      {catKeys
        .filter((k) => !cat || cat === k)
        .map((k) => {
          const categoria = cats[k]
          const ids = Object.keys(categoria.produtos).filter((id) => filtrar(categoria.produtos[id]))
          if (ids.length === 0) return null
          return (
            <div key={k} className="space-y-2">
              <h3 className="text-sm font-semibold text-stone-300 flex items-center gap-2">
                <span>{ICONES[k] ?? '•'}</span>
                {categoria.title}
              </h3>
              {ids.map((id) => (
                <CardProduto key={id} id={id} p={categoria.produtos[id]} jur={jur} />
              ))}
            </div>
          )
        })}
    </div>
  )
}
