// Versão dos dados legais — proveniente da fonte canónica (vinho-lab/).
// version.json é gerado por: python tools/export_correcoes.py (no repo vinho-lab).
// NÃO editar à mão; regenerar a partir da fonte.
import versionData from './version.json'

export const DATA_VERSION: string = versionData.version
export const DATA_GENERATED_UTC: string = versionData.generated_utc
