import { useState } from 'react'
import Header from './components/Header'
import ApiKeyModal from './components/ApiKeyModal'
import HistoricoModal from './components/HistoricoModal'
import DiagnosticoIA from './tabs/DiagnosticoIA'
import Correcoes from './tabs/Correcoes'
import Calculadoras from './tabs/Calculadoras'
import FichasDefeito from './tabs/FichasDefeito'
import Comparacao from './tabs/Comparacao'
import Produtos from './tabs/Produtos'
import { carregarHistorico, EntradaHistorico } from './lib/historico'

type Tab = 'diagnostico' | 'correcoes' | 'calculadoras' | 'fichas' | 'produtos' | 'comparacao'

const TABS: { id: Tab; label: string }[] = [
  { id: 'diagnostico', label: '🤖 Diagnóstico IA' },
  { id: 'correcoes', label: '📋 Correções' },
  { id: 'calculadoras', label: '🧮 Calculadoras' },
  { id: 'fichas', label: '🔬 Fichas de Defeito' },
  { id: 'produtos', label: '🧪 Produtos' },
  { id: 'comparacao', label: '⚖️ PT ↔ BR' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('diagnostico')
  const [jurisdicao, setJurisdicao] = useState<'ptue' | 'br'>('ptue')
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem('gemini_api_key') ?? '')
  const [showModal, setShowModal] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)
  const [historico, setHistorico] = useState<EntradaHistorico[]>(() => carregarHistorico())
  const [diagInitial, setDiagInitial] = useState<{ sintomas?: string[]; historico?: EntradaHistorico } | undefined>()

  const handleDiagnosticarDeFicha = (sintomas: string[]) => {
    setDiagInitial({ sintomas })
    setTab('diagnostico')
  }

  const handleCarregarHistorico = (entrada: EntradaHistorico) => {
    setDiagInitial({ historico: entrada })
    setTab('diagnostico')
  }

  const atualizarHistorico = () => setHistorico(carregarHistorico())

  return (
    <div className="min-h-screen bg-stone-950">
      <Header
        jurisdicao={jurisdicao}
        onJurisdicao={setJurisdicao}
        apiKey={apiKey}
        onApiKey={() => setShowModal(true)}
        nHistorico={historico.length}
        onHistorico={() => { setHistorico(carregarHistorico()); setShowHistorico(true) }}
      />

      {/* Tab bar */}
      <div className="border-b border-stone-800 bg-stone-950 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-wine-500 text-wine-300 font-medium'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'diagnostico' && (
          <DiagnosticoIA
            apiKey={apiKey}
            onApiKey={() => setShowModal(true)}
            jurisdicao={jurisdicao}
            initialForm={diagInitial?.sintomas ? { sintomas: diagInitial.sintomas } : undefined}
            historicoInicial={diagInitial?.historico}
            onNovoDiagnostico={atualizarHistorico}
          />
        )}
        {tab === 'correcoes' && <Correcoes jur={jurisdicao} />}
        {tab === 'calculadoras' && <Calculadoras jur={jurisdicao} />}
        {tab === 'fichas' && (
          <FichasDefeito jur={jurisdicao} onDiagnosticar={handleDiagnosticarDeFicha} />
        )}
        {tab === 'produtos' && <Produtos jur={jurisdicao} />}
        {tab === 'comparacao' && <Comparacao />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-xs text-stone-600 leading-relaxed space-y-1.5">
          <p>
            Ferramenta de apoio à decisão. Não substitui o boletim oficial emitido por laboratório autorizado nem aconselhamento enológico profissional.
          </p>
          <p>
            Limites legais: MAPA (IN 14/2018 e alt.) · Reg. UE 1308/2013 · 2019/934 · 2024/3085 · CE 606/2009.
          </p>
          <p>
            🔒 <strong className="text-stone-500">Privacidade:</strong> Os parâmetros analíticos enviados ao módulo de Diagnóstico IA são processados pela Google LLC (Gemini API).
            Nome de amostra, lote e dados de identificação nunca são enviados. Consentimento solicitado antes do primeiro diagnóstico (RGPD Art. 6.º, n.º 1, al. a).
            Chave API guardada apenas em sessionStorage — eliminada ao fechar o tab.
          </p>
        </div>
      </footer>

      {showModal && (
        <ApiKeyModal
          onSave={setApiKey}
          onClose={() => setShowModal(false)}
        />
      )}

      {showHistorico && (
        <HistoricoModal
          historico={historico}
          onFechar={() => setShowHistorico(false)}
          onCarregar={handleCarregarHistorico}
          onAtualizar={atualizarHistorico}
        />
      )}
    </div>
  )
}
