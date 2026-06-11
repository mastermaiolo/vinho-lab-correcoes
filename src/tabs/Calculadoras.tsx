import { useState } from 'react'
import {
  so2Molecular, so2LivreParaMolecular,
  calcSO2, ProdutoSO2, NOMES_PRODUTO_SO2, UNIDADE_PRODUTO_SO2,
  calcAcidificacao, AcidoAcidificacao, NOMES_ACIDO,
  calcDesacidificacao, AgenteDesacid, NOMES_DESACID,
  calcEnriquecimento, MetodoEnriquecimento,
} from '../lib/calculadoras'
import { useI18n } from '../components/I18nProvider'

function num(v: number, d = 2) {
  return isFinite(v) && !isNaN(v) ? v.toFixed(d) : '—'
}

function Row({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-stone-800 last:border-0">
      <span className="text-sm text-stone-400">{label}</span>
      <span className="font-mono text-sm text-stone-100">{value}{unit ? <span className="text-stone-500 ml-1 text-xs">{unit}</span> : null}</span>
    </div>
  )
}

function CalcSO2({ jur }: { jur: 'ptue' | 'br' }) {
  const { t } = useI18n()
  const [vol, setVol] = useState('10')
  const [atual, setAtual] = useState('18')
  const [desejado, setDesejado] = useState('35')
  const [ph, setPh] = useState('3.65')
  const [tipo, setTipo] = useState('tinto_seco')
  const [produto, setProduto] = useState<ProdutoSO2>('kms')

  const LIMITES_SO2: Record<string, Record<'ptue' | 'br', number>> = {
    tinto_seco: { ptue: 150, br: 150 },
    branco_rose_seco: { ptue: 200, br: 150 },
    tinto_doce: { ptue: 200, br: 150 },
    branco_rose_doce: { ptue: 250, br: 150 },
    botrytis: { ptue: 300, br: 150 },
    biologico_tinto: { ptue: 100, br: 150 },
  }
  const TIPOS_SO2 = Object.keys(LIMITES_SO2)

  const vN = parseFloat(vol)
  const atuN = parseFloat(atual)
  const desN = parseFloat(desejado)
  const phN = parseFloat(ph)
  const limite = LIMITES_SO2[tipo]?.[jur] ?? 150

  const valid = vN > 0 && desN > atuN && phN > 0
  const calc = valid ? calcSO2(vN, atuN, desN, produto) : null
  const mol = valid ? so2Molecular(desN, phN) : null
  const molAtual = valid ? so2Molecular(atuN, phN) : null
  const unidade = UNIDADE_PRODUTO_SO2[produto]

  return (
    <div className="card space-y-4">
      <p className="section-title">{t('calc.so2.title')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">{t('calc.so2.volume')}</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">{t('calc.so2.atual')}</label>
          <input type="number" step="1" min="0" value={atual} onChange={e => setAtual(e.target.value)} /></div>
        <div>
          <label className="label">{t('calc.so2.desejado')}</label>
          <div className="flex gap-1.5">
            <input type="number" step="1" min="0" value={desejado} onChange={e => setDesejado(e.target.value)} className="flex-1 min-w-0" />
            <button
              type="button"
              title={t('calc.so2.sugerir.hint')}
              onClick={() => {
                const phV = parseFloat(ph)
                if (!phV) return
                const isTinto = tipo.startsWith('tinto') || tipo.startsWith('biologico_tinto')
                const alvoMol = isTinto ? 0.5 : 0.8
                setDesejado(String(Math.ceil(so2LivreParaMolecular(alvoMol, phV))))
              }}
              className="shrink-0 px-2 py-1.5 rounded-lg border border-wine-700/50 bg-wine-900/20 text-wine-300 text-xs hover:bg-wine-900/40 transition-colors whitespace-nowrap"
            >
              {t('calc.so2.sugerir')}
            </button>
          </div>
          <p className="text-[10px] text-stone-500 mt-0.5">{t('calc.so2.sugerir.hint')}</p>
        </div>
        <div><label className="label">{t('calc.so2.ph')}</label>
          <input type="number" step="0.01" min="2.8" max="4.5" value={ph} onChange={e => setPh(e.target.value)} /></div>
        <div><label className="label">{t('calc.so2.tipo')}</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            {TIPOS_SO2.map(k => <option key={k} value={k}>{t(`calc.so2.t.${k}`)}</option>)}
          </select>
        </div>
        <div><label className="label">{t('calc.so2.produto')}</label>
          <select value={produto} onChange={e => setProduto(e.target.value as ProdutoSO2)}>
            {(Object.keys(NOMES_PRODUTO_SO2) as ProdutoSO2[]).map(k => (
              <option key={k} value={k}>{NOMES_PRODUTO_SO2[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label={t('calc.so2.dose')} value={num(calc.doseProduto, 1)} unit={`${unidade} / ${vN} hL`} />
          <Row label={t('calc.so2.ativo')} value={num(calc.gAtivo, 1)} unit="g" />
          <Row label={t('calc.so2.mol.atual')} value={num(molAtual ?? 0, 3)} unit="mg/L" />
          <Row label={t('calc.so2.mol.apos')} value={num(mol ?? 0, 3)} unit="mg/L" />
          <Row label={t('calc.so2.limite', { jur: jur === 'ptue' ? t('common.ptue') : t('common.br') })} value={`${limite}`} unit="mg/L total" />
        </div>
      )}

      {calc && mol !== null && (
        <div>
          {mol >= 0.4
            ? <div className="alert-ok">{t('calc.so2.ok')}</div>
            : <div className="alert-warn">{t('calc.so2.warn.mol')}</div>
          }
          {parseFloat(desejado) > limite && (
            <div className="alert-err mt-2">{t('calc.so2.warn.limite', { val: desejado, limite })}</div>
          )}
        </div>
      )}

      <p className="legal-ref">Fórmula Sudraud-Chauvet · Reg. UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcAcidificacao({ jur }: { jur: 'ptue' | 'br' }) {
  const { t } = useI18n()
  const [vol, setVol] = useState('10')
  const [atAtual, setAtAtual] = useState('5.5')
  const [atDesejado, setAtDesejado] = useState('6.5')
  const [acido, setAcido] = useState<AcidoAcidificacao>('tartarico')
  const [fase, setFase] = useState<'mosto' | 'vinho'>('vinho')

  const LIMITE_FASE = { mosto: 1.5, vinho: 2.5 }

  const vN = parseFloat(vol)
  const atuN = parseFloat(atAtual)
  const desN = parseFloat(atDesejado)
  const valid = vN > 0 && desN > atuN

  const calc = valid ? calcAcidificacao(vN, atuN, desN, acido) : null
  const limite = LIMITE_FASE[fase]
  const excedeLimite = calc && calc.deltaAT > limite

  const acidoCitricoUE = acido === 'citrico' && jur === 'ptue'
  const faseLabel = t(`calc.fase.${fase}`)

  return (
    <div className="card space-y-4">
      <p className="section-title">{t('calc.acid.title')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">{t('calc.acid.volume')}</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">{t('calc.acid.at_atual')}</label>
          <input type="number" step="0.1" min="0" value={atAtual} onChange={e => setAtAtual(e.target.value)} /></div>
        <div><label className="label">{t('calc.acid.at_desejado')}</label>
          <input type="number" step="0.1" min="0" value={atDesejado} onChange={e => setAtDesejado(e.target.value)} /></div>
        <div><label className="label">{t('calc.acid.acido')}</label>
          <select value={acido} onChange={e => setAcido(e.target.value as AcidoAcidificacao)}>
            {(Object.keys(NOMES_ACIDO) as AcidoAcidificacao[]).map(k => (
              <option key={k} value={k}>{NOMES_ACIDO[k]}</option>
            ))}
          </select>
        </div>
        <div><label className="label">{t('calc.acid.fase')}</label>
          <select value={fase} onChange={e => setFase(e.target.value as 'mosto' | 'vinho')}>
            <option value="mosto">{t('calc.fase.mosto')}</option>
            <option value="vinho">{t('calc.fase.vinho')}</option>
          </select>
        </div>
      </div>

      {acidoCitricoUE && (
        <div className="alert-err">{t('calc.acid.proibido_citrico')}</div>
      )}

      {calc && !acidoCitricoUE && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label={t('calc.acid.dose_ghl')} value={num(calc.doseGHL)} unit="g/hL" />
          <Row label={t('calc.acid.dose_total')} value={num(calc.doseTotalG, 0)} unit="g" />
          <Row label={t('calc.acid.delta_at')} value={`+${num(calc.deltaAT)}`} unit="g/L" />
          <Row label={t('calc.acid.limite_row', { fase: faseLabel })} value={`${limite}`} unit="g/L" />
        </div>
      )}

      {excedeLimite && !acidoCitricoUE && (
        <div className="alert-err">{t('calc.acid.excede', { limite, fase: faseLabel })}</div>
      )}

      {calc && !excedeLimite && !acidoCitricoUE && (
        <div className="alert-ok">{t('calc.ok.limites')}</div>
      )}

      <p className="legal-ref">Reg. Delegado UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcDesacidificacao({ jur }: { jur: 'ptue' | 'br' }) {
  const { t } = useI18n()
  const [vol, setVol] = useState('10')
  const [atAtual, setAtAtual] = useState('8.0')
  const [atDesejado, setAtDesejado] = useState('6.5')
  const [agente, setAgente] = useState<AgenteDesacid>('khco3')

  const vN = parseFloat(vol)
  const atuN = parseFloat(atAtual)
  const desN = parseFloat(atDesejado)
  const valid = vN > 0 && atuN > desN

  const calc = valid ? calcDesacidificacao(vN, atuN, desN, agente) : null
  const excedeLimite = calc && calc.deltaAT > 1.0

  return (
    <div className="card space-y-4">
      <p className="section-title">{t('calc.desacid.title')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">{t('calc.acid.volume')}</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">{t('calc.desacid.at_atual')}</label>
          <input type="number" step="0.1" min="0" value={atAtual} onChange={e => setAtAtual(e.target.value)} /></div>
        <div><label className="label">{t('calc.desacid.at_desejado')}</label>
          <input type="number" step="0.1" min="0" value={atDesejado} onChange={e => setAtDesejado(e.target.value)} /></div>
        <div><label className="label">{t('calc.desacid.agente')}</label>
          <select value={agente} onChange={e => setAgente(e.target.value as AgenteDesacid)}>
            {(Object.keys(NOMES_DESACID) as AgenteDesacid[]).map(k => (
              <option key={k} value={k}>{NOMES_DESACID[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {jur === 'ptue' && agente === 'tartarato_k' && (
        <div className="alert-warn">{t('calc.desacid.warn_tartarato')}</div>
      )}

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label={t('calc.desacid.dose_ghl')} value={num(calc.doseGHL)} unit="g/hL" />
          <Row label={t('calc.desacid.dose_total')} value={num(calc.doseTotalG, 0)} unit="g" />
          <Row label={t('calc.desacid.delta_at')} value={`-${num(calc.deltaAT)}`} unit="g/L" />
          <Row label={t('calc.desacid.limite_row')} value="1,00" unit="g/L" />
        </div>
      )}

      {excedeLimite && <div className="alert-err">{t('calc.desacid.excede')}</div>}
      {calc && !excedeLimite && <div className="alert-ok">{t('calc.ok.limites')}</div>}

      <p className="legal-ref">Reg. Delegado UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcEnriquecimento({ jur }: { jur: 'ptue' | 'br' }) {
  const { t } = useI18n()
  const [vol, setVol] = useState('10')
  const [tavAtual, setTavAtual] = useState('11.5')
  const [tavDesejado, setTavDesejado] = useState('13.0')
  const [metodo, setMetodo] = useState<MetodoEnriquecimento>('mcr')
  const [categoria, setCategoria] = useState('reservado')

  const chapProibido = jur === 'ptue' && metodo === 'sacarose'
  const categoriaProibida = jur === 'br' && ['gran_reserva', 'nobre'].includes(categoria) && metodo === 'sacarose'

  const vN = parseFloat(vol)
  const atuN = parseFloat(tavAtual)
  const desN = parseFloat(tavDesejado)
  const valid = vN > 0 && desN > atuN && !chapProibido && !categoriaProibida

  const calc = valid ? calcEnriquecimento(vN, atuN, desN, metodo) : null
  const delta = desN - atuN
  // Zona C (Portugal): enriquecimento limitado a +1,5% vol (Reg. 1308/2013 Anexo VIII)
  const LIMITE_DELTA_UE = 1.5
  const excedeUE = jur === 'ptue' && calc && delta > LIMITE_DELTA_UE

  const CATEGORIAS_BR = ['reservado', 'reserva', 'gran_reserva', 'nobre']

  return (
    <div className="card space-y-4">
      <p className="section-title">{t('calc.enrich.title')}</p>

      {jur === 'ptue' && (
        <div className="alert-warn text-xs">{t('calc.enrich.warn_pt')}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">{t('calc.acid.volume')}</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">{t('calc.enrich.tav_atual')}</label>
          <input type="number" step="0.1" min="7" max="16" value={tavAtual} onChange={e => setTavAtual(e.target.value)} /></div>
        <div><label className="label">{t('calc.enrich.tav_desejado')}</label>
          <input type="number" step="0.1" min="7" max="16" value={tavDesejado} onChange={e => setTavDesejado(e.target.value)} /></div>
        <div><label className="label">{t('calc.enrich.metodo')}</label>
          <select value={metodo} onChange={e => setMetodo(e.target.value as MetodoEnriquecimento)}>
            <option value="sacarose">{t('calc.enrich.metodo.sacarose')}</option>
            <option value="mcr">{t('calc.enrich.metodo.mcr')}</option>
          </select>
        </div>
        {jur === 'br' && (
          <div><label className="label">{t('calc.enrich.categoria')}</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              {CATEGORIAS_BR.map(c => <option key={c} value={c}>{t(`calc.enrich.cat.${c}`)}</option>)}
            </select>
          </div>
        )}
      </div>

      {chapProibido && <div className="alert-err">{t('calc.enrich.chap_proibida')}</div>}
      {categoriaProibida && <div className="alert-err">{t('calc.enrich.cat_proibida', { cat: categoria })}</div>}

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label={t('calc.enrich.delta')} value={`+${num(delta)}`} unit="% vol" />
          <Row label={metodo === 'sacarose' ? t('calc.enrich.dose.sacarose') : t('calc.enrich.dose.mcr')}
            value={num(calc.dose, 1)} unit={calc.unidade} />
        </div>
      )}

      {excedeUE && (
        <div className="alert-err">{t('calc.enrich.excede_ue', { delta: num(delta, 1) })}</div>
      )}

      {jur === 'br' && calc && delta > (categoria === 'reservado' ? 2.0 : 1.0) && (
        <div className="alert-err">{t('calc.enrich.excede_cat', { cat: categoria })}</div>
      )}

      <p className="legal-ref">Reg. Delegado UE 2019/934 · IN MAPA 14/2018 · Portaria 723/2024</p>
    </div>
  )
}

export default function Calculadoras({ jur }: { jur: 'ptue' | 'br' }) {
  return (
    <div className="space-y-6">
      <CalcSO2 jur={jur} />
      <CalcAcidificacao jur={jur} />
      <CalcDesacidificacao jur={jur} />
      <CalcEnriquecimento jur={jur} />
    </div>
  )
}
