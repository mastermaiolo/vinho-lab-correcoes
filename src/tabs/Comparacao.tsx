import { useI18n } from '../components/I18nProvider'

interface Row {
  param: string
  ptue: string
  br: string
  diferenca?: boolean
}

const ROWS: Row[] = [
  { param: 'Chaptalização (Zona C / vinhos finos)', ptue: '❌ Proibida', br: '✅ Permitida (até +2,0%)', diferenca: true },
  { param: 'MCR / MC para enriquecimento', ptue: '✅ Autorizado', br: '✅ Autorizado' },
  { param: 'Acidificação vinho (máx.)', ptue: '2,50 g/L (tart. equiv.)', br: 'Não expressamente limitado' },
  { param: 'Ácido cítrico como acidificante', ptue: '❌ Proibido', br: '✅ Até 1,0 g/L', diferenca: true },
  { param: 'Regra exclusividade acidif./desacid.', ptue: '✅ Obrigatória', br: 'Não explícita', diferenca: true },
  { param: 'SO₂ total — tinto seco', ptue: '150 mg/L', br: '150 mg/L' },
  { param: 'SO₂ total — branco seco', ptue: '200 mg/L', br: '150 mg/L', diferenca: true },
  { param: 'SO₂ total — botrytis', ptue: '300 mg/L', br: '150 mg/L', diferenca: true },
  { param: 'SO₂ total — biológico tinto', ptue: '100 mg/L', br: '— (não previsto)' },
  { param: 'AV máx. tinto', ptue: '20 mEq/L', br: '20 mEq/L' },
  { param: 'AV máx. branco/rosé', ptue: '18 mEq/L', br: '20 mEq/L', diferenca: true },
  { param: 'Carvão activado em tintos', ptue: '❌ Proibido', br: '✅ Autorizado', diferenca: true },
  { param: 'Esferas adsorventes PVI/PVP', ptue: '✅ Autorizado (Reg. 2024/3085)', br: '❌ Não previsto', diferenca: true },
  { param: 'Ácido ascórbico (máx.)', ptue: '250 mg/L', br: '150 mg/L', diferenca: true },
  { param: 'Quitosano', ptue: '10 g/hL (Reg. Delegado UE 2019/934)', br: '✅ Autorizado' },
  { param: 'Cu máx. no vinho', ptue: '1 mg/L', br: '1 mg/L' },
  { param: 'TAV mín.', ptue: '8,5% vol', br: '8,6% vol' },
  { param: 'ESR tinto mín.', ptue: '—', br: '21 g/L' },
  { param: 'Na máx.', ptue: '—', br: '80 mg/L' },
  { param: 'Metanol tinto máx.', ptue: '400 mg/L', br: '400 mg/L' },
  { param: 'Entidade reguladora', ptue: 'IVV / IVDP (PT)', br: 'MAPA / ANVISA' },
]

export default function Comparacao() {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      <p className="text-xs text-stone-500 bg-stone-800/40 rounded-lg px-3 py-2 leading-relaxed">{t('reftable.note')}</p>
      <div className="flex items-center gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> diferença relevante</span>
        <span>✅ autorizado &nbsp; ❌ proibido</span>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 w-[45%]">Parâmetro</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400">🇵🇹 PT/UE</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400">🇧🇷 Brasil</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className={`border-b border-stone-800/50 last:border-0 ${r.diferenca ? 'bg-amber-900/10' : ''}`}>
                <td className="px-4 py-2.5 text-stone-300">
                  {r.diferenca && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-2 -mt-0.5"></span>}
                  {r.param}
                </td>
                <td className="px-4 py-2.5 text-stone-300">{r.ptue}</td>
                <td className="px-4 py-2.5 text-stone-300">{r.br}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card bg-stone-800/40 text-xs text-stone-500 leading-relaxed">
        <p className="font-medium text-stone-400 mb-1">Fontes legais</p>
        <p>PT/UE: Reg. UE 1308/2013 · Reg. Delegado UE 2019/934 · Reg. UE 2024/3085 · Reg. UE 2023/915 (OTA)</p>
        <p className="mt-1">Brasil: IN MAPA 14/2018 · Portaria MAPA 723/2024 · Lei 7.678/1988</p>
        <p className="mt-2 text-stone-600 italic">
          A colocação no mercado exige também documentação (certificado de origem, VI-1 para exportação PT→BR), rotulagem e práticas enológicas conformes. Esta tabela reflete apenas limites físico-químicos e práticas enológicas.
        </p>
      </div>
    </div>
  )
}
