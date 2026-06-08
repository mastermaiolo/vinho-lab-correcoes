import { useState } from 'react'
import { EntradaHistorico, limparHistorico } from '../lib/historico'

interface Props {
  historico: EntradaHistorico[]
  onFechar: () => void
  onCarregar: (entrada: EntradaHistorico) => void
  onAtualizar: () => void
}

function formatTS(ts: number) {
  const d = new Date(ts)
  return d.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function HistoricoModal({ historico, onFechar, onCarregar, onAtualizar }: Props) {
  const [confirmarLimpar, setConfirmarLimpar] = useState(false)

  const handleLimpar = () => {
    limparHistorico()
    onAtualizar()
    setConfirmarLimpar(false)
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-100">Histórico de diagnósticos</h2>
            <p className="text-xs text-stone-500 mt-0.5">Sessão atual — {historico.length} entrada{historico.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onFechar} className="text-stone-500 hover:text-stone-200 text-xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {historico.length === 0 && (
            <p className="text-stone-500 text-sm text-center py-8">Nenhum diagnóstico nesta sessão.</p>
          )}
          {historico.map((e) => {
            const top = e.resultado.diagnosticos.find(Boolean)
            return (
              <div key={e.id} className="card border-stone-800 hover:border-stone-600 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-xs text-stone-500">{formatTS(e.ts)}</span>
                      <span className="text-xs bg-stone-800 border border-stone-700 text-stone-400 px-1.5 py-0.5 rounded">
                        {e.jurisdicao === 'ptue' ? '🇵🇹 PT/UE' : '🇧🇷 BR'}
                      </span>
                      <span className="text-xs text-stone-500">{e.tipo}</span>
                    </div>
                    {top && (
                      <p className="text-sm font-medium text-stone-200">
                        1.º {top.defeito}
                        <span className={`ml-2 text-xs badge-${top.confianca}`}>{top.confianca}</span>
                      </p>
                    )}
                    {e.sintomas.length > 0 && (
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{e.sintomas.slice(0, 3).join(', ')}{e.sintomas.length > 3 ? ` +${e.sintomas.length - 3}` : ''}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { onCarregar(e); onFechar() }}
                    className="btn-ghost text-xs shrink-0"
                    title="Reabrir este diagnóstico"
                  >
                    Abrir
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-stone-800 flex justify-between items-center">
          {confirmarLimpar ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Confirmar limpeza?</span>
              <button onClick={handleLimpar} className="text-xs text-red-400 hover:text-red-300 underline">Sim, limpar</button>
              <button onClick={() => setConfirmarLimpar(false)} className="text-xs text-stone-500 hover:text-stone-300">Cancelar</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmarLimpar(true)}
              disabled={historico.length === 0}
              className="text-xs text-stone-600 hover:text-stone-400 disabled:opacity-40"
            >
              Limpar histórico
            </button>
          )}
          <button onClick={onFechar} className="btn-ghost text-xs">Fechar</button>
        </div>
      </div>
    </div>
  )
}
