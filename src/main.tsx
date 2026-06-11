import { StrictMode, Component, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { I18nProvider } from './components/I18nProvider'

// Sem error boundary, qualquer erro de render apaga a app para ecrã preto
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <p className="text-4xl">🍷</p>
            <h1 className="text-lg font-semibold text-stone-200">Algo correu mal</h1>
            <p className="text-sm text-stone-400 font-mono break-all">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-red-900 text-red-100 text-sm hover:bg-red-800 transition-colors"
            >
              Recarregar a página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>,
)
