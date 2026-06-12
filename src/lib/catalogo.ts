// Índice mínimo (id + nome) gerado por gen-system-prompt.js a partir de
// defeitos.json — importar o JSON completo arrastava 65 kB para o bundle.
import catalogo from '../data/catalogo.json'

const CATALOGO_IDS = new Set(
  (catalogo as { id: string }[]).map((d) => d.id)
)

const CATALOGO_NOMES = new Map(
  (catalogo as { id: string; nome: string }[]).map((d) => [d.id, d.nome])
)

export interface CatalogoStatus {
  emCatalogo: boolean
  id: string | null
  nome: string | null
}

// Valida a referência de catálogo devolvida pela IA contra o catálogo curado.
// Um ref fora do catálogo (null ou ID inventado) é sinalizado — a recomendação
// não está ancorada na base de conhecimento verificada.
export function validarCatalogo(ref: string | null | undefined): CatalogoStatus {
  if (ref && CATALOGO_IDS.has(ref)) {
    return { emCatalogo: true, id: ref, nome: CATALOGO_NOMES.get(ref) ?? null }
  }
  return { emCatalogo: false, id: null, nome: null }
}
