interface Props {
  onAccept: () => void
  onCancel: () => void
}

export default function PrivacyConsentModal({ onAccept, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-base font-semibold text-stone-100">Aviso de privacidade — Diagnóstico IA</h2>
          <p className="text-sm text-stone-400 mt-1">Antes de continuar, confirme o que é enviado para a API Google Gemini.</p>
        </div>

        <div className="p-6 space-y-4">
          {/* O que é enviado */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              ✉ Enviado ao Google Gemini (API)
            </p>
            <ul className="space-y-1.5">
              {[
                'Tipo de vinho e fase de produção',
                'Parâmetros analíticos: TAV, pH, SO₂, acidez volátil, acidez total, ESR',
                'Sintomas sensoriais e físicos selecionados',
                'Jurisdição (PT/UE ou Brasil)',
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-stone-300">
                  <span className="text-amber-400 shrink-0 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* O que NÃO é enviado */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              🔒 Nunca enviado — fica apenas no seu browser
            </p>
            <ul className="space-y-1.5">
              {[
                'Nome da amostra, lote, data ou responsável (do boletim importado)',
                'A chave API Gemini',
                'Qualquer outro dado pessoal ou identificador da empresa',
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-stone-300">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Nota legal */}
          <div className="bg-stone-800 rounded-lg p-3 text-xs text-stone-400 leading-relaxed">
            <p>
              Os dados analíticos do vinho podem identificar um produtor ou lote específico e constituem
              informação empresarial sensível. Ao prosseguir, aceita que esses dados sejam processados
              pela Google LLC ao abrigo da{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine-400 underline"
              >
                Política de Privacidade do Google
              </a>{' '}
              e dos{' '}
              <a
                href="https://ai.google.dev/gemini-api/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine-400 underline"
              >
                Termos da Gemini API
              </a>
              .
            </p>
            <p className="mt-2">
              Base jurídica (RGPD Art. 6.º, n.º 1, al. a)): <strong className="text-stone-300">consentimento explícito</strong> do titular.
              Este consentimento aplica-se à sessão atual e pode ser revogado a qualquer momento
              fechando o tab do browser.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={onAccept} className="btn-primary">
            Compreendo e aceito — continuar
          </button>
        </div>
      </div>
    </div>
  )
}
