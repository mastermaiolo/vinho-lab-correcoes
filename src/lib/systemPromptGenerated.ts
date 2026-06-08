// AUTO-GERADO por scripts/gen-system-prompt.js — não editar manualmente
// Execute: npm run gen-prompt

export const SYSTEM_PROMPT_GENERATED = `
════════════════════════════════════════════════════════
BASE DE CONHECIMENTO — DEFEITOS DO VINHO (20 defeitos)
════════════════════════════════════════════════════════

### DEF-01: Acidez Volátil Elevada (microbiologico)
Causa: Bactérias acéticas aeróbias (Acetobacter aceti, A. pasteurianus) oxidam etanol a ácido acético. Bactérias lácticas heterofermentativas (Lactobacillus spp.) podem produzir AV em anaerobiose. Leveduras produzem 100–300 mg/L de AV durante fermentação normal.
Compostos marcadores: Ácido acético (CH3COOH) — limiar: 0,6 g/L (eq. H2SO4) — sabor azedo evidente acima deste valor; Acetato de etilo (CH3COOC2H5) — limiar: 160–180 mg/L — odor a diluente/acetona
Descritores: vinagre, azedo, pungente, acetona, aguardente
Análise: Destilação e titulação (método oficial OIV)
Correção PT/UE: TEÓRICO: Não existe tratamento químico direto autorizado para redução de AV em vinho acabado na UE — apenas técnicas físicas são permitidas. PRODUTOS/TÉCNICAS: Osmose inversa combinada com resina de troca iónica aniónica pode reduzir AV em 30–50% (autorizada Reg. UE 1234/2007). Metabissulfito de potássio 5–8 g/hL (equivalente a SO₂ 2,9–4,6 g/hL) na recepção da uva previne desenvolvimento de bactérias acéticas. RESTRIÇÕES: Nenhum produto oenológico reduz directamente o ácido acético formado; a osmose inversa é cara e pode alterar o perfil aromático.
Correção BR: TEÓRICO: Idêntico à UE. Osmose inversa autorizada (Lei 7.678/1988). Metabissulfito de potássio autorizado (IN MAPA 14/2018) nas mesmas doses preventivas.
Reversível: false

### DEF-02: Brettanomyces (microbiologico)
Causa: Levedura Brettanomyces bruxellensis (forma teleomórfica: Dekkera bruxellensis) descarboxila ácidos hidroxicinâmicos presentes no vinho (p-cumárico e ferúlico) a vinilfenóis, que são depois reduzidos a etilfenóis pela enzima vinilfenol redutase. Desenvolvimento preferencial em barricas de carvalho durante estágio.
Compostos marcadores: 4-Etilfenol (4-EP) (C8H10O) — limiar: 600 µg/L — defeito evidente; 4-Etilguaiacol (4-EG) (C9H12O2) — limiar: 110 µg/L; 4-Etilfenol + 4-Etilguaiacol (ratio)
Descritores: couro curtido, suor de cavalo, curral, estrebaria, bacon, curativo (band-aid), especiarias (4-EG), fumo (4-EG)
Análise: GC-MS: quantificação directa de 4-EP e 4-EG (µg/L)
Correção PT/UE: TEÓRICO: Remoção física/adsorção dos etilfenóis formados + eliminação da levedura viável. PRODUTOS: Esferas adsorventes PVI/PVP (Reg. UE 2024/3085) — aplicar ao vinho tinto, reduzem 40–60% dos etilfenóis; dose conforme produto comercial. Quitosano enológico 10 g/hL máx. — inibe activamente B. bruxellensis (Reg. UE 2018/1629). SO₂ molecular 0,4–0,8 mg/L (calcular em função do pH com metabissulfito de potássio). Carvão activado oenológico: PROIBIDO em tintos na UE. Higienização de barricas: vapor 90°C + solução SO₂ 2%.
Correção BR: TEÓRICO: Idêntico à UE mais opção adicional de carvão activado em tintos. PRODUTOS: Carvão activado oenológico máx. 100 g/hL (autorizado em tintos no Brasil — IN MAPA 14/2018) — adsorção de 4-EP e 4-EG. Quitosano 10 g/hL (autorizado). PVI/PVP: a verificar legislação BR. SO₂ molecular idêntico à UE. RESTRIÇÕES: Carvão activado remove cor e taninos em tintos — usar com prudência.
Reversível: false

### DEF-03: Gosto de Rolha (TCA) (quimico)
Causa: Bolores presentes na cortiça (Penicillium camemberti, Aspergillus niger, Trichoderma spp.) convertem clorofenóis (oriundos do tratamento industrial da cortiça com cloro ou fungicidas) em cloroanisóis por metilação enzimática. A contaminação pode ser também ambiental (madeiras tratadas na adega, paletes).
Compostos marcadores: 2,4,6-Tricloroanisol (TCA) (C7H5Cl3O) — limiar: 4 ng/L (4 ppt) — detecção mínima; 2,3,4,6-Tetracloroanisol (TeCA) — limiar: 4 ng/L; Pentacloroanisol (PCA) — limiar: 4000 ng/L; 1-Octen-3-ona — limiar: 20 ng/L; Geosmina — limiar: 25 ng/L
Descritores: mofo, cartão húmido, cortiça, farmácia, cogumelo, humidade
Análise: GC-MS (headspace ou SPME) — quantificação em ng/L
Correção PT/UE: TEÓRICO: Sem tratamento oenológico eficaz uma vez que o vinho está engarrafado — o TCA é extremamente estável e não é adsorvido por clarificantes convencionais. PRODUTOS: Para vinhos a granel ainda não engarrafados, carvão activado oenológico máx. 100 g/hL (apenas brancos/rosés na UE) pode reduzir parcialmente os cloroanisóis por adsorção. RESTRIÇÕES: Proibido em tintos na UE. Prevenção é a única estratégia eficaz. Substituição para sistemas de fecho alternativos (cápsula de rosca, rolha sintética) em linhas futuras.
Correção BR: TEÓRICO: Igual à UE. PRODUTOS: Carvão activado oenológico máx. 100 g/hL, autorizado em todos os tipos de vinho (IN MAPA 14/2018), incluindo tintos. RESTRIÇÕES: Mesmo com carvão activado, a remoção de TCA é parcial e pode comprometer cor e aroma.
Reversível: false

### DEF-04: Oxidação / Acetaldeído (quimico)
Causa: Oxidação de etanol por oxigénio dissolvido, catalisada por Fe²⁺/Fe³⁺ e Cu⁺/Cu²⁺ (reacção de Fenton). Ocorre durante trasegos, filtragem, engarrafamento. 'Bottle sickness': pico de acetaldeído 2–4 semanas após engarrafamento que reverte com tempo.
Compostos marcadores: Acetaldeído (etanal) (CH3CHO) — limiar: 100–125 mg/L — 'maçã cortada', 'sherried'; SO₂ livre necessário para cobrir acetaldeído
Descritores: maçã cortada (envelhecimento prematuro), ranço, xerez/sherry (acetaldeído elevado), cera de abelha, passas, nozes
Análise: HPLC ou GC com derivatização (2,4-DNPH)
Correção PT/UE: TEÓRICO: O SO₂ liga-se ao acetaldeído formando sulfonato de etanal (inodoro), mascarando o defeito. O ácido ascórbico age como antioxidante sinérgico impedindo nova oxidação. PRODUTOS: SO₂ livre ajustado a 25–35 mg/L em tintos, 30–40 mg/L em brancos ao engarrafamento (via metabissulfito de potássio, calcular pela fórmula Sudraud-Chauvet em função do pH). Ácido ascórbico 25–50 mg/L antes de qualquer arejamento — NUNCA usar sem SO₂ simultâneo (caso contrário gera peróxido de hidrogénio). Engarrafamento com gás inerte (N₂, CO₂ ou mistura). RESTRIÇÕES: Ácido ascórbico máx. 250 mg/L UE (Reg. CE 606/2009).
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Ácido ascórbico máx. 150 mg/L (IN MAPA 14/2018) — dose inferior à UE. SO₂ e técnicas de inertização: idênticas. RESTRIÇÕES: Nunca usar ácido ascórbico sem SO₂ activo no vinho.
Reversível: Parcial — bottle sickness resolve-se em 4–8 semanas. Oxidação avançada é irreversível.

### DEF-05: Redução (H₂S / Mercaptanos) (quimico)
Causa: Formação de H₂S durante fermentação por leveduras: redução de sulfato/sulfito ou degradação de aminoácidos sulfurados (cisteína, metionina) em condições de déficit nutritivo. H₂S acumula em borras durante envelhecimento (autólise levedurar). Mercaptanos formam-se por reacção de H₂S com etanol.
Compostos marcadores: Sulfeto de hidrogénio (H₂S) (H2S) — limiar: 1,1 µg/L (1,1 ppb) — extremamente volátil; Metanotiol (metanomercaptano) (CH3SH) — limiar: 1,2 µg/L; Etanotiol (C2H5SH) — limiar: 1,1 µg/L; Sulfeto de dimetilo (DMS) ((CH3)2S) — limiar: 25–60 µg/L em brancos / 50–100 µg/L em tintos; 4-Metil-4-mercaptopentan-2-ona (4-MMP) — limiar: 0,8 ng/L; 3-Mercaptohexan-1-ol (3-SH) — limiar: 4 ng/L
Descritores: ovo podre, borracha, repolho cozido, cebola, fósforos, petróleo
Análise: GC com detector de fotoionização de chama (FPD) — quantificação em µg/L
Correção PT/UE: TEÓRICO: H₂S é eliminado por volatilização (arejamento) ou precipitação como sulfeto de cobre insolúvel (CuS). Mercaptanos persistem após arejamento e requerem o cobre para precipitação. PRODUTOS: Sulfato de cobre (CuSO₄) 0,5–1,0 g/hL — forma CuS insolúvel com H₂S e mercaptanos (objectivo: Cu final < 0,5 mg/L no vinho, máx. legal 1 mg/L UE/BR). Arejamento controlado em trasega: elimina H₂S sem cobre para casos leves. RESTRIÇÕES: Nunca adicionar ácido ascórbico (agrava condições redutoras). Cu residual no vinho ≤ 1 mg/L (Reg. CE 606/2009).
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Sulfato de cobre autorizado (IN MAPA 14/2018) 0,5–1,0 g/hL, mesma dose e objectivo de Cu final. RESTRIÇÕES: Cu máx. 1 mg/L no vinho final.
Reversível: Sim, se tratado precocemente (H₂S volatiliza facilmente; mercaptanos mais persistentes)

### DEF-06: Gosto de Rato (Mousiness) (microbiologico)
Causa: Produzido por bactérias lácticas (Lactobacillus spp., Oenococcus oeni em algumas estirpes) e por leveduras não-Saccharomyces (Brettanomyces spp.) a partir de lisina e açúcares. Mecanismo: reacção de aminoácidos com acetaldeído.
Compostos marcadores: 2-Acetil-1,4,5,6-tetrahidropiridina (2-ATHP) — limiar: <1 ng/L (detecção sensorial a pH alcalino — varia com pH); 2-Acetil-3,4,5,6-tetrahidropiridina; 2-Acetilpiperidina
Descritores: urina de rato, rato, biscoito de arroz queimado, milho-pipoca rançoso
Análise: GC-MS ou SPME-GC-MS
Correção PT/UE: TEÓRICO: Sem tratamento oenológico eficaz depois de desenvolvido — os compostos ATHP são estáveis e não são removidos por clarificantes comuns. PRODUTOS: SO₂ activo (metabissulfito de potássio) para inibir formação adicional — manter SO₂ molecular ≥ 0,4 mg/L. Filtração esterilizante 0,45 µm para eliminar bactérias responsáveis. Bentonite 25–80 g/hL: efeito mínimo sobre os compostos ATHP. RESTRIÇÕES: Vinho comercialmente não recuperável acima de concentrações detectáveis; a filtração remove os microrganismos mas não os compostos já formados.
Correção BR: TEÓRICO: Igual à UE. PRODUTOS: Idênticos. SO₂ molecular via metabissulfito de potássio; filtração esterilizante (autorizada). RESTRIÇÕES: Mesmas que UE.
Reversível: false

### DEF-07: Gosto de Gerânio (quimico)
Causa: Bactérias lácticas (principalmente Oenococcus oeni) degradam o ácido sórbico (E,E-sorbato) por redução a (E,E)-hexadienol, que se etoxila espontaneamente a 2-etoxi-3,5-hexadieno. Ocorre quando se adiciona sorbato de potássio para estabilização microbiológica e o vinho sofre subsequentemente FML.
Compostos marcadores: 2-Etoxi-3,5-hexadieno (E)-hex-3,5-dien-2-ol — limiar: 0,001 mg/L (1 µg/L) — extremamente perceptível; Geraniol (precursor semelhante)
Descritores: gerânio, sardinheiras, folhas de gerânio, floral pesado desagradável
Análise: GC-MS (detecção a concentrações de ng/L)
Correção PT/UE: TEÓRICO: O 2-etoxi-3,5-hexadieno é extremamente estável e não pode ser removido quimicamente. Adsorção parcial possível apenas com carvão activado em brancos/rosés. PRODUTOS: Carvão activado oenológico máx. 100 g/hL (apenas brancos/rosés na UE) — redução parcial do composto odorante. RESTRIÇÕES: PROIBIDO carvão activado em tintos na UE. Vinho comercialmente inutilizável se pronunciado. Prevenção é imperativa.
Correção BR: TEÓRICO: Igual à UE. PRODUTOS: Carvão activado oenológico máx. 100 g/hL, autorizado em todos os tipos de vinho no Brasil (IN MAPA 14/2018), incluindo tintos. RESTRIÇÕES: Mesmo com carvão, a recuperação sensorial é parcial se o defeito for pronunciado.
Reversível: false

### DEF-08: Refermentação na Garrafa (microbiologico_fisico)
Causa: Leveduras viáveis residuais (Saccharomyces cerevisiae ou espécies mais resistentes como Saccharomycodes ludwigii, Zygosaccharomyces bailii) refermentam açúcares residuais após engarrafamento. Produção de CO₂ que pode causar rolha a estalar.
Compostos marcadores: Açúcares redutores residuais; CO₂ dissolvido
Descritores: efervescência indesejada, gás, turvação, depósito levedurar, sabor alterado
Análise: Contagem de leveduras viáveis (UFC/mL): objectivo < 10 UFC/mL no vinho filtrado
Correção PT/UE: TEÓRICO: Eliminar as leveduras viáveis por filtração esterilizante e/ou inibição microbiológica; estabilizar açúcares residuais. PRODUTOS: Filtração esterilizante 0,45 µm (único método garantido para vinho a granel). Sorbato de potássio 200 mg/L máx. — apenas APÓS garantir ausência de bactérias lácticas (risco de defeito de gerânio). SO₂ livre ≥ 25 mg/L (tintos) / ≥ 30 mg/L (brancos) no re-engarrafamento. Lisozima 200–500 mg/L para controlar bactérias. RESTRIÇÕES: Vinho já engarrafado: sem remédio — descontinuar lote.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Filtração 0,45 µm, sorbato de potássio 200 mg/L, SO₂ adequado — todos autorizados (IN MAPA 14/2018). Lisozima autorizada. RESTRIÇÕES: Mesmas que UE para vinho já engarrafado.
Reversível: Não (em garrafa); possível correção antes do engarrafamento

### DEF-09: Lightstrike (Golpe de Luz) (fisico_quimico)
Causa: Riboflavina absorve luz a 370–440 nm e em estado excitado catalisa a oxidação fotoquímica de metionina e cisteína, gerando compostos de enxofre (metanotiol, dimetil sulfeto). Ocorre em minutos a horas de exposição directa.
Compostos marcadores: Riboflavina (vitamina B2) (C17H20N4O6); Metanotiol e outros tiols; Dimetil dissulfeto (DMDS)
Descritores: repolho cozido, borracha, skunky (mosca) — mais em espumantes, mofo láctico, perda de frescura e aromas varietais
Análise: SPME-GC-FPD para compostos de enxofre; HPLC para riboflavina
Correção PT/UE: TEÓRICO: Sem tratamento eficaz após o dano fotoquímico — os tiols formados são extremamente voláteis mas persistentes. A adsorção parcial é possível apenas em brancos/rosés. PRODUTOS: Carvão activado oenológico máx. 100 g/hL (apenas brancos/rosés na UE) — adsorção parcial de metanotiol e outros tiols. SO₂ livre adequado pode limitar dano oxidativo adicional. RESTRIÇÕES: PROIBIDO carvão activado em tintos na UE. Prevenção é essencial.
Correção BR: TEÓRICO: Igual à UE. PRODUTOS: Carvão activado máx. 100 g/hL, autorizado em todos os tipos de vinho (IN MAPA 14/2018). RESTRIÇÕES: Mesmo em tintos, o carvão remove cor e aroma — usar apenas se necessário.
Reversível: false

### DEF-10: Casse Proteica (fisico_quimico)
Causa: Proteínas de uva (principalmente em variedades brancas) formam agregados insolúveis quando sujeitas a calor, oxidação ou variações de pH. Mais frequente em vinhos brancos que carecem de taninos (que precipitam proteínas naturalmente).
Compostos marcadores: Proteínas termolábeis (Proteínas ricas em prolina, taumatina-like proteins)
Descritores: turvação branca/leitosa, depósito branco fino, sem alteração gustativa
Análise: Teste de calor: 80°C durante 30 min — turbidez (>2 NTU de aumento) = instável
Correção PT/UE: TEÓRICO: A bentonite (argila montmorilonite) carregada negativamente adsorve proteínas catiónicas por troca iónica, precipitando-as como flocos que assentam e são removidos por filtração. PRODUTOS: Bentonite sódica ou cálcio-sódica 25–150 g/hL — dose determinada por jar-test laboratorial previamente ao tratamento (sempre realizar ensaio de dose mínima eficaz). Tratamento a frio (10–12°C) potencia a acção da bentonite. Caseína 1–20 g/hL: remove proteínas oxidadas e compostos de escurecimento. RESTRIÇÕES: Excesso de bentonite (>200 g/hL) remove aromas varietais (compostos voláteis adsorvidos). CMC não actua sobre proteínas.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Bentonite autorizada (IN MAPA 14/2018) nas mesmas doses. Caseína autorizada. RESTRIÇÕES: Idênticas à UE.
Reversível: Sim, se tratado com bentonite antes do engarrafamento

### DEF-11: Casse Férrica (quimico)
Causa: O ferro no vinho existe em equilíbrio Fe²⁺ (solúvel) ↔ Fe³⁺ (insolúvel). O arejamento oxida Fe²⁺ a Fe³⁺ que precipita com fosfatos (brancos) ou taninos/antocianinas (tintos). A casse ocorre tipicamente 48h após arejamento.
Compostos marcadores: Fe³⁺ (Ferro III / Ferro Férrico); Fosfato de Fe³⁺ (Casse Branca/White Casse); Fe³⁺-tanino (Casse Azul/Blue Casse)
Descritores: turvação branca (brancos), coloração azul-violeta intensa (tintos), sem alteração gustativa significativa
Análise: Espectrometria de absorção atómica (SAA) ou ICP: quantificação de Fe total (mg/L)
Correção PT/UE: TEÓRICO: Redução de Fe³⁺ a Fe²⁺ solúvel (via antioxidante) ou complexação/precipitação do excesso de ferro. PRODUTOS: Ácido ascórbico 25–50 mg/L — reduz Fe³⁺ a Fe²⁺ (solúvel) antes de qualquer arejamento. Ferrocianeto de potássio (K₄[Fe(CN)₆]) máx. 100 mg/L — precipitação de Fe como azul de Berlim insolúvel (exige oenólogo responsável e análise de cianeto residual livre <0,5 mg/L HCN). Ácido cítrico (como agente complexante, não acidificante) 0,5 g/L máx. UE — complexa Fe³⁺. Goma arábica 15–30 g/hL — estabiliza colóides, previne precipitação. RESTRIÇÕES: Ferrocianeto requer declaração obrigatória em muitos países; sobretratamento dá turbidez azul permanente.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Ácido cítrico máx. 1,0 g/L (autorizado no Brasil como agente complexante). Ferrocianeto de potássio, ácido ascórbico e goma arábica autorizados (IN MAPA 14/2018). RESTRIÇÕES: Análise de cianeto residual obrigatória após tratamento com ferrocianeto.
Reversível: Sim, se tratado antes do engarrafamento

### DEF-12: Casse Cúprica (quimico)
Causa: Cobre residual de equipamento (bombas, válvulas em bronze/latão) ou de tratamentos fitossanitários (calda bordalesa) precipita em condições redutoras (SO₂ elevado) como sulfeto de cobre (Cu₂S) — formação de turvação em anaerobiose.
Compostos marcadores: Cu²⁺ (Cobre II)
Descritores: turvação acastanhada/avermelhada, depósito castanho, sabor metálico (em casos graves)
Análise: SAA (Espectrometria de Absorção Atómica): quantificação Cu total (mg/L)
Correção PT/UE: TEÓRICO: Precipitação do cobre como sal insolúvel (ferrocianeto de cobre ou sulfeto de cobre) seguida de filtração. PRODUTOS: Ferrocianeto de potássio máx. 100 mg/L — precipita Cu²⁺ como ferrocianeto de cobre insolúvel (cianocupreto); exige análise de cianeto residual livre (<0,5 mg/L HCN) após tratamento. Sulfureto de potássio (K₂S) 2–10 g/hL — forma CuS insolúvel (uso controlado: risco de H₂S residual; arejar antes de filtrar). Bentonite 25–80 g/hL + arejamento suave: remove Cu parcialmente por adsorção. Goma arábica 15–30 g/hL: acção estabilizante sobre colóides. RESTRIÇÕES: Cu final deve ser ≤ 1 mg/L no vinho (Reg. CE 606/2009).
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Ferrocianeto de potássio, sulfureto de potássio, bentonite e goma arábica autorizados (IN MAPA 14/2018). RESTRIÇÕES: Cu máx. 1 mg/L no vinho final; análise de cianeto obrigatória pós-ferrocianeto.
Reversível: Sim, se tratado antes do engarrafamento

### DEF-13: Excesso de SO₂ / Dióxido de Enxofre (quimico)
Causa: Adição excessiva de SO₂ ou sulfuroso; SO₂ molecular excessivo em função do pH. Em vinhos com pH baixo (<3,2), mesmo doses moderadas de SO₂ livre geram concentrações moleculares elevadas. Fermentação em mosto com excesso de SO₂ pode produzir H₂S como subproduto.
Compostos marcadores: SO₂ livre (fracção molecular) (SO₂) — limiar: >2 mg/L SO₂ molecular — picante, irritante; >0,8 mg/L já perceptível para sensíveis
Descritores: enxofre, fósforo queimado, picante nasal, irritante, cabeça de fósforo
Análise: Determinação de SO₂ livre por aspiração-oxidação (método Ripper) ou por iodometria
Correção PT/UE: TEÓRICO: O SO₂ livre liga-se progressivamente a compostos carbonílicos (acetaldeído, piruvato, α-cetoglutarato) passando a SO₂ combinado (inodoro). O arejamento controlado oxida e volatiliza o excesso de SO₂. PRODUTOS/TÉCNICAS: Arejamento controlado em trasega — reduz SO₂ livre em 5–15 mg/L por operação. Aguardar 2–4 semanas: combinação natural com carbonilo. NÃO adicionar mais SO₂. RESTRIÇÕES: SO₂ total máx. UE: 150 mg/L (tintos secos), 200 mg/L (brancos secos), 400 mg/L (vinhos doces botrytizados) — Reg. CE 606/2009.
Correção BR: TEÓRICO: Idêntico à UE. TÉCNICAS: Arejamento controlado, aguardar. RESTRIÇÕES: SO₂ total máx. BR: 350 mg/L (tintos doces), 200 mg/L (brancos secos) — IN MAPA 14/2018.
Reversível: true

### DEF-14: Precipitação Tartárica (Casse Tartárica) (fisico_quimico)
Causa: Supersaturação em bitartarato de potássio (KHT) ou tartarato de cálcio (CaT) no vinho. O KHT é menos solúvel a baixas temperaturas — precipita ao refrigerar. CaT precipita mais a temperatura ambiente ao longo do tempo. O vinho é supersaturado quando [K⁺]×[HT⁻] > Ksp do KHT.
Compostos marcadores: Bitartarato de potássio (KHT) (KHC₄H₄O₆) — limiar: N/A — cristais visíveis; Tartarato de cálcio (CaT) (CaC₄H₄O₆)
Descritores: cristais no fundo, depósito branco, partículas brilhantes, turvação fria
Análise: Teste de estabilidade tartárica: condutividade eléctrica antes/após refrigeração a -4°C durante 48h (variação <100 µS/cm = estável)
Correção PT/UE: TEÓRICO: Indução de precipitação controlada de KHT (estabilização a frio) ou inibição da cristalização com polímeros/colóides que bloqueiam os sítios de crescimento dos cristais. PRODUTOS: Estabilização a frio a -4 a -6°C durante 1–2 semanas + filtração. CMC (carboximetilcelulose) máx. 100 mg/L — inibidor de cristalização KHT para brancos e rosés (APENAS, risco de interferência com cor em tintos). Metatartarato de potássio máx. 100 mg/L — efeito temporário (degrada acima 15°C, duração 6–12 meses). Manoprotéinas de levedura 200–400 mg/L (Reg. UE 2019/934) — estabilização natural e melhora textura. RESTRIÇÕES: CMC PROIBIDO em tintos na UE por risco de instabilidade de cor.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Estabilização a frio, CMC máx. 100 mg/L, metatartarato máx. 100 mg/L, manoprotéinas — todos autorizados (IN MAPA 14/2018). Eliminação de K⁺ por troca iónica autorizada no Brasil. RESTRIÇÕES: CMC em tintos — verificar legislação estadual.
Reversível: true

### DEF-15: Amargor / Amertume Excessivo (quimico)
Causa: Extracção excessiva de compostos fenólicos amargos das películas (maceração longa ou remontagem agressiva), sementes esmagadas (prensagem excessiva), ou madeira de barrica nova (ellagitaninos em excesso). Pode também resultar de oxidação de percursores fenólicos ou de actividade de Brettanomyces (4-VG).
Compostos marcadores: Quercetina e glucósidos de flavonóis — limiar: Variável conforme percepção individual; quercetina: ~5–20 mg/L; Proantocianidinas oligoméricas (taninos condensados); 4-Vinilguaiacol (4-VG) (C9H10O2) — limiar: 10–40 µg/L
Descritores: amargo persistente, adstringência seca, vegetal, verde, madeira excessiva
Análise: Índice de polifenóis totais (IPT 280 nm); taninos por método Bate-Smith ou precipitação com sulfato de amónia
Correção PT/UE: TEÓRICO: Remoção selectiva de compostos fenólicos amargos por adsorção ou colagem (precipitação de taninos com proteínas). PRODUTOS: Gelatina 1–5 g/hL — precipita taninos condensados amargos por ligação proteína-tanino; selecção natural para taninos mais duros. PVPP (polivinilpolipirrolidona) máx. 80 g/hL — remove quercetina, flavonóis e compostos fenólicos amargos por adsorção; muito eficaz mas remove também parte da cor. Carvão activado máx. 100 g/hL (apenas brancos/rosés na UE). Caseína 1–20 g/hL — remove fenóis e compostos de escurecimento. RESTRIÇÕES: Assemblagem com lotes menos amargos; estágio 12–24 meses atenua por polimerização natural.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: PVPP máx. 80 g/hL, gelatina, caseína, carvão activado (incluindo tintos) — autorizados (IN MAPA 14/2018). RESTRIÇÕES: PVPP reduz cor e estrutura — sempre jar-test prévio.
Reversível: true

### DEF-16: Filante / Graisse (Vinho Viscoso) (microbiologico)
Causa: Bactéria láctica Pediococcus damnosus produz exopolissacarídeos beta-1,3-glucanas em condições de pH elevado, SO₂ insuficiente e temperaturas de estágio acima de 15°C. As longas cadeias polissacarídicas conferem ao vinho uma textura viscosa, oleosa e filante — aspecto de clara de ovo em fio.
Compostos marcadores: Beta-1,3-glucanas (exopolissacarídeos); Diacetilo (C4H6O2) — limiar: 0,1 mg/L — amanteigado a baixas concentrações, rançoso em excesso
Descritores: viscoso, oleoso, filante, consistência de óleo, deslizante, sem efervescência, amanteigado (diacetilo)
Análise: Observação visual: o vinho 'fila' ao verter (textura de óleo ou clara em fio)
Correção PT/UE: TEÓRICO: As cadeias beta-1,3-glucanas são fisicamente quebradas por agitação mecânica vigorosa, depois o Pediococcus deve ser eliminado por filtração esterilizante e/ou lisozima. PRODUTOS: Agitação/trasega vigorosa — quebra fisicamente as cadeias glucanas e restaura fluidez imediata. Bentonite 50–100 g/hL — adsorção de proteínas bacterianas e flocculação, facilita clarificação após agitação. Lisozima 200–500 mg/L — destrói a parede celular dos Pediococcus (Gram-positivos), eliminando a fonte de produção de glucanas; autorizada UE (Reg. CE 606/2009) e BR. Filtração esterilizante 0,45 µm após tratamento. SO₂ ajustado para manter 0,4 mg/L de SO₂ molecular. RESTRIÇÕES: Reversível se apanhado cedo, antes de concentrações maciças de glucanas.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Lisozima 200–500 mg/L, bentonite 50–100 g/hL, filtração esterilizante — autorizados (IN MAPA 14/2018). SO₂ ajustado. RESTRIÇÕES: Lisozima é proteína de ovo (alergénio declarável nos rótulos). Mesmas que UE.
Reversível: true

### DEF-17: Picada Láctica / Acedamento Láctico (microbiologico)
Causa: Bactérias lácticas heterofermentativas (Lactobacillus brevis, L. hilgardii, L. buchneri) fermentam açúcares residuais e ácido málico produzindo excesso de ácido láctico, manitol (da redução de frutose), ácido acético e acroleína. Ocorre em vinhos com açúcares residuais e pH elevado onde o SO₂ é insuficiente.
Compostos marcadores: Ácido láctico em excesso (C3H6O3); Manitol (C6H14O6) — limiar: acima de 1–2 g/L confere doçura artificial e sensação metálica; Acroleína (C3H4O) — limiar: extremamente baixo — 0,01–0,05 mg/L
Descritores: azedo metálico, doce desequilibrado, amargo persistente, leite azedo, chucrute, picante residual, borracha láctica
Análise: HPLC para quantificação de ácido láctico, manitol, ácido acético
Correção PT/UE: TEÓRICO: Eliminação das bactérias responsáveis por filtração esterilizante; atenuação parcial dos compostos formados por adsorção. Os compostos manitol e acroleína são extremamente estáveis e não são removidos por clarificantes convencionais. PRODUTOS: Filtração esterilizante 0,45 µm — remove bactérias viáveis (impede formação adicional). Lisozima 200–500 mg/L — elimina Lactobacillus (Gram-positivos). SO₂ adequado (0,4 mg/L molecular). Bentonite 50–80 g/hL + carvão activado oenológico máx. 100 g/hL (apenas brancos/rosés UE) — atenuação parcial de compostos odorantes. Pasteurização (72°C/30 seg) se vinho a granel. RESTRIÇÕES: Vinho comercialmente comprometido se manitol elevado e defeito pronunciado — irrecuperável.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Lisozima 200–500 mg/L, filtração esterilizante, SO₂, carvão activado (incluindo tintos no Brasil) — autorizados (IN MAPA 14/2018). RESTRIÇÕES: Manitol elevado = defeito irreversível organolepticamente.
Reversível: false

### DEF-18: Sobre-Extração de Carvalho / Defeito de Barrica (quimico)
Causa: Extracção excessiva de compostos do carvalho durante estágio em barrica nova ou uso excessivo de alternativas de carvalho (chips, staves). O carvalho americano (Quercus alba) é mais rico em whisky-lactona e ellagtaninos que o carvalho europeu (Q. sessilis, Q. petraea). Estágio excessivamente longo em barrica nova agrava a extracção.
Compostos marcadores: Ellagtaninos (ácido elágico e derivados); cis/trans-Whisky-Lactona (beta-metil-gama-octalactona) (C9H16O2); Vanilina (C8H8O3) — limiar: 10 mg/L — quando percebida como agressiva e dominante indica sobre-extração
Descritores: madeira excessiva, serradura, coco excessivo, tanino seco adstringente, baunilha agressiva, desequilíbrio madeira/fruta, amargo lenhoso
Análise: GC-MS: quantificação de beta-metil-gama-octalactona, vanilina, guaiacol (µg/L e mg/L)
Correção PT/UE: TEÓRICO: Remoção selectiva de ellagtaninos e taninos hidrolisáveis do carvalho por colagem e adsorção; o tempo atenua a whisky-lactona e a vanilina por integração e polimerização. PRODUTOS: PVPP 20–80 g/hL — remove ellagtaninos e compostos fenólicos por adsorção selectiva (máx. 80 g/hL autorizado UE). Gelatina 1–5 g/hL — colagem selectiva para taninos hidrolisáveis e ellagtaninos. Caseína 1–10 g/hL — remove compostos fenólicos e contribui para clarificação. Assemblagem com lotes sem barrica (diluição do defeito). Aguardar 18–24 meses — a sobre-extração atenua por integração e polimerização natural. Carvão activado (apenas brancos/rosés UE): adsorção de vanilina e lactona. RESTRIÇÕES: PVPP remove cor em tintos — usar com prudência.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: PVPP, gelatina, caseína, assemblagem, aguardar — idênticos. Carvão activado autorizado em tintos (IN MAPA 14/2018). RESTRIÇÕES: Mesmas que UE para impacto na cor.
Reversível: true

### DEF-19: Brunissement / Escurecimento Oxidativo (Brancos e Rosés) (quimico)
Causa: Oxidação enzimática (polifenol oxidase — PPO — da própria uva, ou lacase produzida por Botrytis cinerea) ou não enzimática (catalisada por Fe e Cu) dos o-difenóis (ácido caftárico, ácido cafeico) a o-quinonas, que polimerizam em pigmentos castanhos insolúveis. A lacase de Botrytis é particularmente perigosa por ser termoresistente.
Compostos marcadores: trans-Caftarato de etilo (precursor principal); o-Quinonas (intermediários); Compostos xantilium (pigmentos castanhos/amarelos)
Descritores: cor dourada/âmbar excessiva, ranço oxidado, mel/maçã seca, perda de frescura, perda de aroma varietal, envelhecimento prematuro
Análise: Absorbância a 420 nm (cor castanha): > 0,20 em brancos = escurecimento significativo
Correção PT/UE: TEÓRICO: Remoção das o-quinonas e difenóis oxidados por adsorção (PVPP, carvão, caseína); redução das quinonas pelo ácido ascórbico; eliminação da lacase por bentonite (adsorção proteica). PRODUTOS: SO₂ ajustado a 30–40 mg/L livre — antioxidante primário e inibidor de PPO/lacase. Ácido ascórbico 50–100 mg/L (SEMPRE com SO₂ simultâneo, nunca isolado): reduz o-quinonas de volta a difenóis, antioxidante sinérgico. PVPP 20–40 g/hL — remove o-quinonas e o-difenóis oxidados por adsorção selectiva. Carvão activado oenológico máx. 100 g/hL (brancos/rosés UE) — adsorção de pigmentos castanhos e quinonas. Bentonite 50–100 g/hL + caseína 1–10 g/hL — remove lacase (proteína de Botrytis) e proteínas oxidadas. Filtração com terras diatomáceas após colagem. RESTRIÇÕES: Cor alterada é irreversível; atenuação parcial possível. Ácido ascórbico máx. 250 mg/L UE.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: SO₂, ácido ascórbico máx. 150 mg/L, PVPP, carvão activado (incluindo tintos), bentonite, caseína — todos autorizados (IN MAPA 14/2018). RESTRIÇÕES: Ácido ascórbico máx. 150 mg/L BR (inferior à UE). Cor irreversível — tratamento é de atenuação.
Reversível: false

### DEF-20: Contaminação por Ocratoxina A (OTA) (quimico)
Causa: Micotoxina produzida principalmente por Aspergillus carbonarius e A. niger em cachos de uva danificados (Botrytis, granizo, passas) em condições de humidade elevada e temperatura > 20°C. Penicillium verrucosum pode contribuir em climas mais frios. A OTA é estável ao processo de vinificação (fermentação não a degrada significativamente).
Compostos marcadores: Ocratoxina A (OTA) (C20H18ClNO6)
Descritores: (sem descriptor sensorial característico — defeito analítico/toxicológico), indetectável organolepticamente nas concentrações relevantes
Análise: HPLC com detecção por fluorescência (FLD) ou LC-MS/MS — quantificação em µg/L
Correção PT/UE: TEÓRICO: Redução de OTA por adsorção com agentes de colagem que a capturam fisicamente — a OTA liga-se a superfícies polares e proteínas por interacções hidrofóbicas e iónicas. PRODUTOS: Bentonite sódica 50–100 g/hL — adsorção de OTA junto com proteínas; eficácia de redução de 20–50%. Quitosano enológico 10 g/hL (Reg. UE 2018/1629) — eficaz na adsorção de OTA, especialmente em combinação com bentonite; redução adicional de 30–40%. Carvão activado oenológico máx. 100 g/hL (apenas brancos e rosés na UE): adsorção de OTA por mecanismo hidrofóbico, redução de 40–70%. Gelatina 1–5 g/hL + bentonite combinados — sinergia na adsorção. RESTRIÇÕES: Carvão activado PROIBIDO em tintos na UE. A prevenção é prioritária — os tratamentos adsortivos raramente eliminam totalmente a OTA se a contaminação inicial for elevada.
Correção BR: TEÓRICO: Idêntico à UE. PRODUTOS: Bentonite, quitosano, carvão activado (incluindo em tintos no Brasil — IN MAPA 14/2018), gelatina — todos autorizados. RESTRIÇÕES: OTA estável — triagem rigorosa da matéria-prima é a única garantia de segurança. RDC ANVISA 7/2011 fixa limite de 2 µg/L.
Reversível: true

════════════════════════════════════════════════════════
## Limites legais PT/UE

### _meta
  fontes: ["Reg. UE 1308/2013","Reg. Delegado UE 2019/934","Reg. UE 2024/3085","Reg. CE 606/2009"]
  zona_portugal: Zona C III (Alentejo) e Zona C II (Douro, Dão, Bairrada, etc.)
  atualizado: 2026-06

### so2_total
  _unidade: mg/L
  _nota: SO₂ total = livre + combinado; limites máximos no vinho acabado
  tinto_seco: {"max":150,"condicao":"açúcar < 5 g/L","fonte":"Reg. Delegado 2019/934, Anexo I-B"}
  branco_rose_seco: {"max":200,"condicao":"açúcar < 5 g/L","fonte":"Reg. Delegado 2019/934, Anexo I-B"}
  tinto_doce: {"max":200,"condicao":"açúcar ≥ 5 g/L"}
  branco_rose_doce: {"max":250,"condicao":"açúcar ≥ 5 g/L"}
  botrytis_colheita_tardia: {"max":300,"condicao":"vinhos de colheita tardia e de grão nobre"}
  espumante_qualidade: {"max":185}
  espumante_outros: {"max":235}
  biologico_tinto: {"max":100,"fonte":"Reg. UE 203/2012"}
  biologico_branco_rose: {"max":150,"fonte":"Reg. UE 203/2012"}
  derogacao_anos_dificeis: {"incremento_max":50,"nota":"Autorizado pelo Conselho da UE em anos com condições climáticas difíceis"}

### so2_livre_recomendado
  _nota: Valores recomendados para protecção microbiana; não são limites legais
  _formula_molecular: SO₂ molecular (mg/L) = SO₂ livre (mg/L) / (1 + 10^(pH - 1.81))
  _objectivo_molecular: 0,4–0,8 mg/L de SO₂ molecular activo
  por_ph: {"pH_3.0":{"so2_livre_mg_L":6,"so2_molecular_percent":6.06},"pH_3.2":{"so2_livre_mg_L":10},"pH_3.4":{"so2_livre_mg_L":16},"pH_3.5":{"so2_livre_mg_L":20,"so2_molecular_percent":2},"pH_3.6":{"so2_livre_mg_L":25},"pH_3.7":{"so2_livre_mg_L":32},"pH_3.8":{"so2_livre_mg_L":40},"pH_4.0":{"so2_livre_mg_L":63,"so2_molecular_percent":0.64}}

### so2_conversoes
  k2s2o5_para_so2: {"fator":0.572,"descricao":"57,2 g de K₂S₂O₅ = 32,7 g de SO₂ activo","uso":"metabissulfito de potássio"}
  khso3_para_so2: {"fator":0.538,"descricao":"53,8 g de KHSO₃ = 29,0 g de SO₂ activo","uso":"bissulfito de potássio"}
  so2_gasoso: {"fator":1,"uso":"SO₂ gasoso puro"}
  solucao_so2_6pct: {"concentracao_g_L":60,"fator":0.06,"uso":"solução aquosa 6% p/v"}

### acidificacao
  mosto: {"max_g_L_tartarico_equiv":1.5,"fonte":"Reg. Delegado 2019/934"}
  vinho: {"max_g_L_tartarico_equiv":2.5}
  agentes_autorizados: ["tartarico","malico","lactico"]
  proibidos: ["citrico"]
  regra_exclusividade: Na UE, acidificação e desacidificação NÃO podem ser realizadas no mesmo vinho no mesmo ano vitícola
  equivalencias: {"tartarico":{"fator_meq":13.3,"descricao":"1 g/L ác. tartárico = 13,3 mEq/L"},"malico":{"fator_meq":14.9,"descricao":"1 g/L ác. málico = 14,9 mEq/L"},"lactico":{"fator_meq":11.1,"descricao":"1 g/L ác. láctico = 11,1 mEq/L"}}
  efeito_tartarico_no_pH: {"0.5_g_L":{"acidez_total_g_L":"+0.33","delta_pH":"-0.08"},"1.0_g_L":{"acidez_total_g_L":"+0.65","delta_pH":"-0.15"},"1.5_g_L":{"acidez_total_g_L":"+1.04","delta_pH":"-0.22"}}

### desacidificacao
  mosto: {"max_g_L_tartarico_equiv":1}
  vinho: {"max_g_L_tartarico_equiv":1}
  agentes_autorizados: ["bicarbonato_potassio","carbonato_calcio","tartarato_neutro_k","fml"]
  proibidos_zona_c: ["acido_tartarico"]
  fatores_por_g_L_descida: {"bicarbonato_potassio_KHCO3":{"dose_g_L":0.67,"descricao":"0,67 g/L KHCO₃ por 1,0 g/L de descida de acidez total (em ác. tartárico)","fator_alternativo":"1,5 g KHCO₃ por 1 g/L de acidez total (em H₂SO₄)"},"carbonato_calcio_CaCO3":{"dose_g_L":0.5,"descricao":"0,50 g/L CaCO₃ por 1,0 g/L de descida de acidez (tartárico equiv.)","fator_alternativo":"1,0 g CaCO₃ por 1 g/L de acidez total (em H₂SO₄)"},"tartarato_neutro_potassio":{"dose_g_L":0.85,"descricao":"0,85 g/L tartarato neutro de K por 1,0 g/L de descida de acidez"}}

### enriquecimento
  zona_c_portugal: {"metodo_autorizado":["MC (Mosto Concentrado)","MCR (Mosto Concentrado Rectificado)"],"chapitalizacao":false,"aumento_normal_pct_vol":1.5,"aumento_excepcional_pct_vol":2,"nota_excepcional":"Autorizado por decisão anual da Comissão Europeia em anos difíceis"}
  zona_a_b: {"chapitalizacao":true,"aumento_max_pct_vol":{"zona_a":3,"zona_b":2}}
  fatores_conversao: {"sacarose_para_alcool":{"oficial_ue_g_L":16.378,"pratico_tintos_g_L":18,"pratico_brancos_g_L":17,"descricao":"g de açúcar por litro por 1% vol de álcool"},"mcr_liquido":{"concentracao_tipica_g_L":700,"ml_por_pct_vol":24,"descricao":"aprox. 24 mL/L de MCR 700 g/L por +1,0% vol"}}

### acidez_volatil
  _unidade: mEq/L ou g/L ác. acético
  _conversao: 1 g/L ác. acético = 16,7 mEq/L
  tinto: {"max_meq_L":20,"max_g_L_acac":1.2}
  branco_rose: {"max_meq_L":18,"max_g_L_acac":1.08}
  fonte: Reg. Delegado 2019/934

### sulfatos_totais
  max_g_L: 1
  unidade: g/L como K₂SO₄

### cloretos
  max_g_L: 1
  unidade: g/L como NaCl

### clarificacao_colagem
  bentonite: {"fase":["mosto","vinho"],"dose_tipica_g_hL":"25–150","obs":"Dose determinada por jar-test"}
  carvao_ativado_oenologico: {"fase":["mosto","vinho branco","vinho rosé"],"proibido_em":"vinho tinto (UE)","dose_max_g_hL":100,"obs":"Proibido em vinho tinto — Reg. CE 606/2009"}
  pvpp: {"fase":["mosto","vinho"],"obs":"Clarificante polifenólico; removido por filtração"}
  gelatina: {"fase":"vinho","dose_tipica_g_hL":"1–5","obs":"Colagem; interage com taninos"}
  caseina: {"fase":"vinho","obs":"Clarificação proteica; alergénio (declaração obrigatória em rótulo)"}
  albumina_ovo: {"fase":"vinho","obs":"Colagem clássica de tintos de qualidade; alergénio (declaração obrigatória)"}
  esferas_adsorventes_pvi_pvp: {"fase":"vinho","dose_max_g_hL":"Conforme Reg. UE 2024/3085","obs":"Para remoção selectiva de fenóis voláteis (Brettanomyces); autorizado desde 2024"}
  quitosano: {"fase":"vinho","dose_max_g_hL":10,"obs":"Inibe Brettanomyces; autorizado Reg. UE 2018/1629"}
  acido_ascorbico: {"fase":"vinho","dose_max_mg_L":250,"obs":"Antioxidante; SEMPRE em combinação com SO₂; nunca isolado"}
  goma_arabica: {"fase":"vinho","dose_max_g_L":0.3,"obs":"Estabilizador coloidal; uso no engarrafamento"}

### estabilizacao_tartarica
  frio: {"temperatura_tipica_C":-4,"duracao_dias":"7–14","obs":"Método clássico; precipita bitartarato de potássio"}
  cmc: {"nome":"Carboximetilcelulose (CMC)","dose_max_mg_L":100,"aplicacao":"brancos e rosés; inibição de cristalização","obs":"Não autorizado em espumantes"}
  acido_metatartarico: {"dose_max_g_hL":10,"duracao_efeito":"12–18 meses a temperatura moderada","obs":"Hidrolisa com o tempo; não adequado para conservação longa"}
  manoprotéinas: {"obs":"Inibidores naturais de cristalização das borras (lees); efeito preventivo"}

### ferro_cobre_limites
  ferro_max_mg_L: {"recomendado":5,"nota":"Limite legal não fixado; limite prático para evitar casse"}
  cobre_max_mg_L: {"legal":1,"fonte":"Reg. CE 606/2009"}

════════════════════════════════════════════════════════
## Limites legais Brasil

### _meta
  fontes: ["IN MAPA 14/2018 (Lei 7.678/1988)","Portaria MAPA 723/2024","Lei 10.970/2004"]
  orgao_regulador: MAPA (Ministério da Agricultura, Pecuária e Abastecimento) + ANVISA
  atualizado: 2026-06

### tabela_4_vinho_de_mesa_e_fino
  _descricao: Tabela 4 da IN MAPA 14/2018 — Parâmetros analíticos para vinho de mesa e fino
  graduacao_alcoolica: {"min":8.6,"max":14,"unidade":"% v/v a 20°C"}
  acidez_total: {"min":40,"max":130,"unidade":"mEq/L (pH 8,2)"}
  acidez_volatil: {"max_meq_L":20,"max_g_L_acac":1.2,"unidade":"mEq/L","nota":"Igual para todas as cores (tinto, branco, rosé)"}
  acido_citrico: {"max":1,"unidade":"g/L","nota":"Autorizado no Brasil (diferente da UE)"}
  so2_total: {"max":150,"unidade":"mg/L","nota":"Igual para todos os tipos de vinho de mesa e fino"}
  sulfatos_totais: {"max":1,"max_envelhecimento_2anos":1.5,"unidade":"g/L como K₂SO₄"}
  cloretos: {"max":1,"unidade":"g/L como NaCl"}
  sodio: {"max":80,"unidade":"mg/L"}
  cinzas: {"tinto":{"min":1.5,"unidade":"g/L"},"branco_rosado":{"min":1,"unidade":"g/L"}}
  extrato_seco_reduzido_esr: {"tinto":{"min":21,"unidade":"g/L"},"branco_rose":{"min":16,"unidade":"g/L"}}
  metanol: {"tinto":{"max":400,"unidade":"mg/L"},"branco_rosado":{"max":300,"unidade":"mg/L"}}

### categorias_de_vinho
  vinho_de_mesa: {"graduacao_alcoolica":{"min":8.6,"max":14,"unidade":"% v/v"},"nota":"Produzido com uvas V. labrusca, híbridos ou americanas"}
  vinho_fino: {"graduacao_alcoolica":{"min":8.6,"max":14,"unidade":"% v/v"},"nota":"Produzido com uvas V. vinifera L."}
  reservado: {"graduacao_alcoolica":{"min":9,"max":13,"unidade":"% v/v"},"chapitalizacao_permitida":true,"limite_chapitalizacao_pct_vol":2,"nota":"Vinho fino com maturação mínima 12 meses"}
  reserva: {"chapitalizacao_permitida":true,"limite_chapitalizacao_pct_vol":1,"nota":"Maturação mínima 18 meses (6 em barrica de carvalho)"}
  gran_reserva: {"chapitalizacao_permitida":false,"nota":"Maturação mínima 24 meses (12 em barrica); TAV natural mínimo 11%"}
  nobre: {"chapitalizacao_permitida":false,"nota":"Máxima categoria; colheita manual obrigatória; TAV natural mínimo 12%"}

### chapitalizacao
  _nota: Autorizada no Brasil com restrições por categoria (diferente de Portugal/UE onde é proibida na Zona C)
  reservado: {"permitida":true,"limite_adicao_pct_vol":2}
  reserva: {"permitida":true,"limite_adicao_pct_vol":1}
  gran_reserva: {"permitida":false}
  nobre: {"permitida":false}
  fator_sacarose: {"g_L_por_pct_vol_tintos":18,"g_L_por_pct_vol_brancos":17,"descricao":"Aprox. 17–18 g/L de sacarose por +1% vol de álcool"}

### acidificacao
  acidos_autorizados: ["tartarico","malico","lactico","citrico"]
  nota: Ácido cítrico AUTORIZADO no Brasil (máx. 1,0 g/L) — diferente da UE
  regra_exclusividade: Não existe regra de exclusividade explícita no Brasil (diferente da UE)

### desacidificacao
  agentes_autorizados: ["bicarbonato_potassio","carbonato_calcio","tartarato_neutro_k","fml"]

### clarificacao_colagem
  carvao_ativado_oenologico: {"fase":["mosto","vinho tinto","vinho branco","vinho rosé"],"obs":"AUTORIZADO em vinhos tintos no Brasil — diferente da UE (proibido em tintos)"}
  bentonite: {"obs":"Autorizada sem restrição de tipo de vinho"}
  quitosano: {"obs":"Autorizado (legislação harmonizada com OIV)"}

### so2_conversoes
  k2s2o5_para_so2: {"fator":0.572}
  khso3_para_so2: {"fator":0.538}
  so2_gasoso: {"fator":1}

### acido_ascorbico
  max_mg_L: 150
  obs: Limite no Brasil; na UE o limite é 250 mg/L

### ferro_cobre_limites
  ferro_max_mg_L: {"nota":"Não especificado explicitamente; limite prático <5 mg/L"}
  cobre_max_mg_L: {"legal":1,"fonte":"IN MAPA 14/2018"}

### diferencas_chave_ue
  _titulo: Diferenças principais Brasil vs. Portugal/UE
  chapitalizacao: ✅ Permitida no Brasil (exceto Gran Reserva e Nobre) | ❌ Proibida em Portugal (Zona C)
  acido_citrico: ✅ Autorizado no Brasil até 1,0 g/L | ❌ Proibido na UE como acidificante
  carvao_tintos: ✅ Autorizado em tintos no Brasil | ❌ Proibido em tintos na UE
  so2_branco: 150 mg/L Brasil | 200 mg/L UE (branco seco)
  av_branco: 20 mEq/L Brasil | 18 mEq/L UE (branco/rosé)
  regra_exclusividade: Não existe no Brasil | Obrigatória na UE (não se pode acidificar e desacidificar no mesmo ano)
  acido_ascorbico: 150 mg/L Brasil | 250 mg/L UE
`
