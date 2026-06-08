import { useState } from 'react'
import {
  so2Molecular, so2LivreParaMolecular,
  calcSO2, ProdutoSO2, NOMES_PRODUTO_SO2, UNIDADE_PRODUTO_SO2,
  calcAcidificacao, AcidoAcidificacao, NOMES_ACIDO,
  calcDesacidificacao, AgenteDesacid, NOMES_DESACID,
  calcEnriquecimento, MetodoEnriquecimento,
} from '../lib/calculadoras'

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
      <p className="section-title">Calculadora SO₂</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">Volume (hL)</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">SO₂ livre atual (mg/L)</label>
          <input type="number" step="1" min="0" value={atual} onChange={e => setAtual(e.target.value)} /></div>
        <div>
          <label className="label">SO₂ livre desejado (mg/L)</label>
          <div className="flex gap-1.5">
            <input type="number" step="1" min="0" value={desejado} onChange={e => setDesejado(e.target.value)} className="flex-1 min-w-0" />
            <button
              type="button"
              title="Sugerir SO₂ livre para atingir SO₂ molecular alvo (tintos 0,5 mg/L; brancos/rosés 0,8 mg/L)"
              onClick={() => {
                const phV = parseFloat(ph)
                if (!phV) return
                const isTinto = tipo.startsWith('tinto') || tipo.startsWith('biologico_tinto')
                const alvoMol = isTinto ? 0.5 : 0.8
                setDesejado(String(Math.ceil(so2LivreParaMolecular(alvoMol, phV))))
              }}
              className="shrink-0 px-2 py-1.5 rounded-lg border border-wine-700/50 bg-wine-900/20 text-wine-300 text-xs hover:bg-wine-900/40 transition-colors whitespace-nowrap"
            >
              ✨ Sugerir alvo
            </button>
          </div>
          <p className="text-[10px] text-stone-500 mt-0.5">Tintos: SO₂mol=0,5 mg/L · Brancos/rosés: 0,8 mg/L</p>
        </div>
        <div><label className="label">pH</label>
          <input type="number" step="0.01" min="2.8" max="4.5" value={ph} onChange={e => setPh(e.target.value)} /></div>
        <div><label className="label">Tipo de vinho</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="tinto_seco">Tinto seco</option>
            <option value="branco_rose_seco">Branco/rosé seco</option>
            <option value="tinto_doce">Tinto doce (≥5 g/L)</option>
            <option value="branco_rose_doce">Branco/rosé doce</option>
            <option value="botrytis">Botrytis (só PT/UE)</option>
            <option value="biologico_tinto">Biológico tinto</option>
          </select>
        </div>
        <div><label className="label">Produto</label>
          <select value={produto} onChange={e => setProduto(e.target.value as ProdutoSO2)}>
            {(Object.keys(NOMES_PRODUTO_SO2) as ProdutoSO2[]).map(k => (
              <option key={k} value={k}>{NOMES_PRODUTO_SO2[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label="Dose a adicionar" value={num(calc.doseProduto, 1)} unit={`${unidade} / ${vN} hL`} />
          <Row label="SO₂ activo necessário" value={num(calc.gAtivo, 1)} unit="g" />
          <Row label="SO₂ molecular actual (pH actual)" value={num(molAtual ?? 0, 3)} unit="mg/L" />
          <Row label="SO₂ molecular após adição" value={num(mol ?? 0, 3)} unit="mg/L" />
          <Row label={`Limite legal (${jur === 'ptue' ? 'PT/UE' : 'BR'})`} value={`${limite}`} unit="mg/L total" />
        </div>
      )}

      {calc && mol !== null && (
        <div>
          {mol >= 0.4
            ? <div className="alert-ok">✅ SO₂ molecular ≥ 0,4 mg/L — protecção antimicrobiana efetiva.</div>
            : <div className="alert-warn">⚠ SO₂ molecular &lt; 0,4 mg/L — protecção insuficiente. Aumente o SO₂ livre ou reduza o pH.</div>
          }
          {parseFloat(desejado) > limite && (
            <div className="alert-err mt-2">⚠ SO₂ desejado ({desejado} mg/L) pode exceder o limite legal de {limite} mg/L.</div>
          )}
        </div>
      )}

      <p className="legal-ref">Fórmula Sudraud-Chauvet · Reg. UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcAcidificacao({ jur }: { jur: 'ptue' | 'br' }) {
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

  return (
    <div className="card space-y-4">
      <p className="section-title">Calculadora de Acidificação</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">Volume (hL)</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">AT actual (g/L tart.)</label>
          <input type="number" step="0.1" min="0" value={atAtual} onChange={e => setAtAtual(e.target.value)} /></div>
        <div><label className="label">AT desejada (g/L tart.)</label>
          <input type="number" step="0.1" min="0" value={atDesejado} onChange={e => setAtDesejado(e.target.value)} /></div>
        <div><label className="label">Ácido</label>
          <select value={acido} onChange={e => setAcido(e.target.value as AcidoAcidificacao)}>
            {(Object.keys(NOMES_ACIDO) as AcidoAcidificacao[]).map(k => (
              <option key={k} value={k}>{NOMES_ACIDO[k]}</option>
            ))}
          </select>
        </div>
        <div><label className="label">Fase</label>
          <select value={fase} onChange={e => setFase(e.target.value as 'mosto' | 'vinho')}>
            <option value="mosto">Mosto</option>
            <option value="vinho">Vinho</option>
          </select>
        </div>
      </div>

      {acidoCitricoUE && (
        <div className="alert-err">❌ Ácido cítrico PROIBIDO como acidificante na UE (Reg. 1308/2013).</div>
      )}

      {calc && !acidoCitricoUE && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label="Dose (g/hL)" value={num(calc.doseGHL)} unit="g/hL" />
          <Row label="Dose total" value={num(calc.doseTotalG, 0)} unit="g" />
          <Row label="Δ AT" value={`+${num(calc.deltaAT)}`} unit="g/L" />
          <Row label={`Limite ${fase} (PT/UE)`} value={`${limite}`} unit="g/L" />
        </div>
      )}

      {excedeLimite && !acidoCitricoUE && (
        <div className="alert-err">⚠ Dose excede o limite legal de {limite} g/L para {fase}.</div>
      )}

      {calc && !excedeLimite && !acidoCitricoUE && (
        <div className="alert-ok">✅ Dentro dos limites legais.</div>
      )}

      <p className="legal-ref">Reg. Delegado UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcDesacidificacao({ jur }: { jur: 'ptue' | 'br' }) {
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
      <p className="section-title">Calculadora de Desacidificação</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">Volume (hL)</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">AT actual (g/L tart.)</label>
          <input type="number" step="0.1" min="0" value={atAtual} onChange={e => setAtAtual(e.target.value)} /></div>
        <div><label className="label">AT desejada (g/L tart.)</label>
          <input type="number" step="0.1" min="0" value={atDesejado} onChange={e => setAtDesejado(e.target.value)} /></div>
        <div><label className="label">Agente</label>
          <select value={agente} onChange={e => setAgente(e.target.value as AgenteDesacid)}>
            {(Object.keys(NOMES_DESACID) as AgenteDesacid[]).map(k => (
              <option key={k} value={k}>{NOMES_DESACID[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {jur === 'ptue' && agente === 'tartarato_k' && (
        <div className="alert-warn">⚠ Ácido tartárico proibido na desacidificação na Zona C (Portugal).</div>
      )}

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label="Dose (g/hL)" value={num(calc.doseGHL)} unit="g/hL" />
          <Row label="Dose total" value={num(calc.doseTotalG, 0)} unit="g" />
          <Row label="Δ AT" value={`-${num(calc.deltaAT)}`} unit="g/L" />
          <Row label="Limite (PT/UE e BR)" value="1,00" unit="g/L" />
        </div>
      )}

      {excedeLimite && <div className="alert-err">⚠ Redução de acidez excede o limite legal de 1,00 g/L.</div>}
      {calc && !excedeLimite && <div className="alert-ok">✅ Dentro dos limites legais.</div>}

      <p className="legal-ref">Reg. Delegado UE 2019/934 · IN MAPA 14/2018</p>
    </div>
  )
}

function CalcEnriquecimento({ jur }: { jur: 'ptue' | 'br' }) {
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

  return (
    <div className="card space-y-4">
      <p className="section-title">Calculadora de Enriquecimento</p>

      {jur === 'ptue' && (
        <div className="alert-warn text-xs">Portugal (Zona C): chaptalização com sacarose PROIBIDA. Use MCR ou MC.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className="label">Volume (hL)</label>
          <input type="number" step="0.5" min="0.01" value={vol} onChange={e => setVol(e.target.value)} /></div>
        <div><label className="label">TAV actual (% vol)</label>
          <input type="number" step="0.1" min="7" max="16" value={tavAtual} onChange={e => setTavAtual(e.target.value)} /></div>
        <div><label className="label">TAV pretendido (% vol)</label>
          <input type="number" step="0.1" min="7" max="16" value={tavDesejado} onChange={e => setTavDesejado(e.target.value)} /></div>
        <div><label className="label">Método</label>
          <select value={metodo} onChange={e => setMetodo(e.target.value as MetodoEnriquecimento)}>
            <option value="sacarose">Sacarose (chaptalização)</option>
            <option value="mcr">MCR (mosto conc. rectificado)</option>
          </select>
        </div>
        {jur === 'br' && (
          <div><label className="label">Categoria (BR)</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="reservado">Reservado (+2,0% máx.)</option>
              <option value="reserva">Reserva (+1,0% máx.)</option>
              <option value="gran_reserva">Gran Reserva (proibido)</option>
              <option value="nobre">Nobre (proibido)</option>
            </select>
          </div>
        )}
      </div>

      {chapProibido && <div className="alert-err">❌ Chaptalização com sacarose PROIBIDA em Portugal (Zona C).</div>}
      {categoriaProibida && <div className="alert-err">❌ Chaptalização PROIBIDA para a categoria {categoria} no Brasil.</div>}

      {calc && (
        <div className="bg-stone-800 rounded-xl p-4 space-y-1">
          <Row label="Δ TAV" value={`+${num(delta)}`} unit="% vol" />
          <Row label={metodo === 'sacarose' ? 'Sacarose a adicionar' : 'MCR a adicionar'}
            value={num(calc.dose, metodo === 'sacarose' ? 1 : 1)} unit={calc.unidade} />
        </div>
      )}

      {jur === 'br' && calc && delta > (categoria === 'reservado' ? 2.0 : 1.0) && (
        <div className="alert-err">⚠ Enriquecimento excede o limite da categoria {categoria}.</div>
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
