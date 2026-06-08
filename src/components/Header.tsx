interface Props {
  jurisdicao: 'ptue' | 'br'
  onJurisdicao: (j: 'ptue' | 'br') => void
  apiKey: string
  onApiKey: () => void
  nHistorico: number
  onHistorico: () => void
}

export default function Header({ jurisdicao, onJurisdicao, apiKey, onApiKey, nHistorico, onHistorico }: Props) {
  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🍷</span>
          <span className="font-semibold text-stone-100 hidden sm:block">Vinho-Lab Correções</span>
          <span className="font-semibold text-stone-100 sm:hidden">VL Correções</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle jurisdição */}
          <div className="flex bg-stone-900 rounded-lg p-0.5 border border-stone-800">
            <button
              onClick={() => onJurisdicao('ptue')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                jurisdicao === 'ptue'
                  ? 'bg-purple-900 text-purple-200 border border-purple-700/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🇵🇹 PT/UE
            </button>
            <button
              onClick={() => onJurisdicao('br')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                jurisdicao === 'br'
                  ? 'bg-blue-900 text-blue-200 border border-blue-700/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🇧🇷 Brasil
            </button>
          </div>

          {/* Botão histórico */}
          <button
            onClick={onHistorico}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200 transition-colors relative"
            title="Histórico de diagnósticos desta sessão"
          >
            🕐 Histórico
            {nHistorico > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-wine-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                {nHistorico > 9 ? '9+' : nHistorico}
              </span>
            )}
          </button>

          {/* Botão chave API */}
          <button
            onClick={onApiKey}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              apiKey
                ? 'border-green-700/50 bg-green-900/30 text-green-300 hover:bg-green-900/50'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
            }`}
            title={apiKey ? 'Chave API configurada — clique para alterar' : 'Configurar chave API Gemini'}
          >
            {apiKey ? '🔑 API ok' : '🔑 API'}
          </button>
        </div>
      </div>
    </header>
  )
}
