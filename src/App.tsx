import { useState, lazy, Suspense } from 'react'
import Header from './components/Header'
import ApiKeyModal from './components/ApiKeyModal'
import HistoricoModal from './components/HistoricoModal'
import DiagnosticoIA from './tabs/DiagnosticoIA'

// Tabs secundárias em chunks separados — corta o bundle inicial
const Correcoes = lazy(() => import('./tabs/Correcoes'))
const Calculadoras = lazy(() => import('./tabs/Calculadoras'))
const FichasDefeito = lazy(() => import('./tabs/FichasDefeito'))
const Comparacao = lazy(() => import('./tabs/Comparacao'))
const Produtos = lazy(() => import('./tabs/Produtos'))

const TabFallback = () => (
  <div className="py-16 text-center text-stone-500 text-sm">⏳ …</div>
)
import { carregarHistorico, EntradaHistorico } from './lib/historico'
import { AIConfig, loadAIConfig } from './lib/aiClient'
import { useI18n } from './components/I18nProvider'
import { Rich } from './components/I18nProvider'

type Tab = 'diagnostico' | 'correcoes' | 'calculadoras' | 'fichas' | 'produtos' | 'comparacao'

const TAB_KEYS: Tab[] = ['diagnostico', 'correcoes', 'calculadoras', 'fichas', 'produtos', 'comparacao']

export default function App() {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('diagnostico')
  const [jurisdicao, setJurisdicao] = useState<'ptue' | 'br'>('ptue')
  const [aiConfig, setAIConfig] = useState<AIConfig>(() => loadAIConfig())
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
        aiConfig={aiConfig}
        onApiKey={() => setShowModal(true)}
        nHistorico={historico.length}
        onHistorico={() => { setHistorico(carregarHistorico()); setShowHistorico(true) }}
      />

      {/* Tab bar */}
      <div className="border-b border-stone-800 bg-stone-950 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TAB_KEYS.map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  tab === id
                    ? 'border-wine-500 text-wine-300 font-medium'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {t(`tab.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'diagnostico' && (
          <DiagnosticoIA
            aiConfig={aiConfig}
            onApiKey={() => setShowModal(true)}
            jurisdicao={jurisdicao}
            initialForm={diagInitial?.sintomas ? { sintomas: diagInitial.sintomas } : undefined}
            historicoInicial={diagInitial?.historico}
            onNovoDiagnostico={atualizarHistorico}
          />
        )}
        <Suspense fallback={<TabFallback />}>
          {tab === 'correcoes' && <Correcoes jur={jurisdicao} />}
          {tab === 'calculadoras' && <Calculadoras jur={jurisdicao} />}
          {tab === 'fichas' && (
            <FichasDefeito jur={jurisdicao} onDiagnosticar={handleDiagnosticarDeFicha} />
          )}
          {tab === 'produtos' && <Produtos jur={jurisdicao} />}
          {tab === 'comparacao' && <Comparacao />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-xs text-stone-600 leading-relaxed space-y-1.5">
          <p>{t('app.footer.disclaimer')}</p>
          <p>{t('app.footer.legal')}</p>
          <p>🔒 <Rich text={t('app.footer.privacy')} /></p>
        </div>
      </footer>

      {showModal && (
        <ApiKeyModal
          current={aiConfig}
          onSave={setAIConfig}
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
