<div align="center">

# VINHO-LAB CORREÇÕES

**Diagnóstico Diferencial de Defectos del Vino Asistido por IA y Calculadora Enológica**

[![Release](https://img.shields.io/badge/release-v1.0.0-AD283B?style=flat-square&labelColor=13161A)](https://github.com/mastermaiolo/vinho-lab-correcoes)
[![Licencia](https://img.shields.io/badge/licencia-MIT-E9E5DC?style=flat-square&labelColor=13161A)](LICENSE)
[![Producción](https://img.shields.io/badge/producci%C3%B3n-vinholabcor.vercel.app-C86D51?style=flat-square&labelColor=13161A)](https://vinholabcor.vercel.app)
[![Framework](https://img.shields.io/badge/React-18%20%2B%20Vite-B62B32?style=flat-square&labelColor=13161A)](https://vitejs.dev)
[![Conformidad](https://img.shields.io/badge/conformidad-PT%2FUE%20%E2%86%94%20BR%20(OIV)-E9E5DC?style=flat-square&labelColor=13161A)](https://www.oiv.int)

<br/>

[English (UK)](README.md) · [Português (Brasil)](README.pt-br.md) · [Português (Portugal)](README.pt-pt.md) · **Español** · [简体中文](README.zh-cn.md)

<br/>

<img src="assets/readme/hero.svg" alt="Vinho-Lab Correções Hero Canvas" width="100%"/>

</div>

<br/>

> **Aplicación web para enólogos, elaboradores y técnicos de bodega**: proporciona diagnóstico diferencial de defectos del vino asistido por inteligencia artificial, calculadoras precisas de dosificación enológica y referencias normativas comparativas entre **Portugal / Unión Europea** y **Brasil**.
>
> Aplicación hermana de [**Vinho-Lab Companheiro**](https://github.com/mastermaiolo/vinho-lab-comp) — *Companheiro mide y valida los parámetros fisicoquímicos en la mesa de laboratorio; Correções diagnostica alteraciones y prescribe intervenciones enológicas reguladas.*
>
> 🔗 **Despliegue en Producción:** [vinholabcor.vercel.app](https://vinholabcor.vercel.app)

> [!WARNING]
> **Herramienta de Soporte a la Decisión:** Esta aplicación funciona exclusivamente como instrumento de asistencia técnica y orientación analítica. No sustituye los boletines de análisis oficiales emitidos por laboratorios acreditados ni la supervisión técnica y dictamen de un enólogo colegiado.

---

## 01 / Índice de Navegación

- [02 / Visión General](#02--visión-general)
- [03 / Capacidades e Ingeniería](#03--capacidades-e-ingeniería)
- [04 / Espacios de Trabajo y Atlas de Defectos](#04--espacios-de-trabajo-y-atlas-de-defectos)
- [05 / Superficie de Control e Interfaz](#05--superficie-de-control-e-interfaz)
- [06 / Proveedores de IA y Protocolo de Privacidad](#06--proveedores-de-ia-y-protocolo-de-privacidad)
- [07 / Calculadoras Enológicas y Matemáticas de Sudraud-Chauvet](#07--calculadoras-enológicas-y-matemáticas-de-sudraud-chauvet)
- [08 / Instalación y Desarrollo](#08--instalación-y-desarrollo)
- [09 / Arquitectura y Organización del Código](#09--arquitectura-y-organización-del-código)
- [10 / Resolución de Problemas y Casos Extremos](#10--resolución-de-problemas-y-casos-extremos)
- [11 / Linaje y Procedencia](#11--linaje-y-procedencia)

---

## 02 / Visión General

Cuando surge una lectura anómala o un defecto organoléptico durante la vinificación o crianza, los responsables de bodega deben intervenir con rigor técnico inmediato. Vinho-Lab Correções cruza parámetros analíticos fisicoquímicos con síntomas sensoriales para identificar la causa bioquímica fundamental, recomendar ensayos de confirmación en laboratorio y calcular dosificaciones exactas de tratamientos autorizados.

<br/>

<div align="center">
  <img src="assets/readme/at-a-glance.svg" alt="Vinho-Lab Correções Visión General" width="100%"/>
</div>

<br/>

### Pilares Arquitectónicos Fundamentales

| Pilar Arquitectónico | Implementación Técnica | Ventaja Práctica en Bodega |
|---|---|---|
| **Diagnóstico Diferencial por IA** | Pasarela multiproveedor en el navegador (OpenRouter, Gemini, Claude, OpenAI) | Identifica causas bioquímicas, pruebas de contraste y tratamientos autorizados |
| **Ingestión Fluida desde Companheiro** | Analizador doble nativo que importa tablas `.md` y archivos de sesión `.json` | Cero transcripción manual; precarga inmediata de parámetros analíticos |
| **Motor SO₂ Sudraud-Chauvet** | Cálculo de $\text{SO}_2$ molecular activo en función del pH y la temperatura del vino | Garantiza protección microbiana ($0,8\text{ ppm}$) respetando los topes legales |
| **Atlas Integral de Defectos** | 20 fichas de alteraciones enológicas (químicas, microbiológicas y físicas) | Compuestos marcadores, notas olfativas y tratamientos legales |
| **Privacidad Estricta sin Servidor** | Peticiones API emitidas directamente desde el navegador; claves en `sessionStorage` | Nombres de bodega, números de lote e identidad del vino nunca salen del cliente |

---

## 03 / Capacidades e Ingeniería

<br/>

<div align="center">
  <img src="assets/readme/capabilities.svg" alt="Vinho-Lab Correções Capacidades" width="100%"/>
</div>

<br/>

### 1. Diagnóstico Diferencial Asistido por IA
La aplicación analiza tanto las métricas de laboratorio (grado alcohólico % vol, pH, $\text{SO}_2$ libre y total, acidez volátil, acidez total, extracto seco) como los síntomas y observaciones sensoriales de la bodega (turbidez, olor acético/pegamento, manzana oxidada, animal/cuero/sudor de caballo, notas de reducción).

Mediante un prompt enológico especializado compilado a partir de bases de conocimiento estructuradas (`scripts/gen-system-prompt.js`), la IA genera una respuesta JSON normalizada que detalla:
- **Diagnóstico Principal y Probabilidad Estimada:** Identifica la alteración precisa (ej. proliferación de *Brettanomyces bruxellensis*, picado acético, quiebra tartárica, quiebra proteica).
- **Causa Bioquímica Fundamental:** Explica las rutas biológicas o mecanismos físico-químicos causantes de la desviación.
- **Protocolo de Ensayos de Confirmación:** Recomienda tanto un análisis riguroso de laboratorio como una prueba rápida inmediata de bodega.
- **Medidas Correctoras Reglamentadas:** Distingue entre intervenciones inmediatas de choque/estabilización y medidas higiénicas preventivas.
- **Fundamento Jurídico Aplicable:** Fundamenta cada tratamiento en los reglamentos vigentes de la Unión Europea o la legislación brasileña.

### 2. Formulación de $\text{SO}_2$ Molecular por Sudraud-Chauvet
La eficacia antiséptica del sulfuroso depende exclusivamente de la fracción de dióxido de azufre molecular libre ($\text{SO}_2\text{ mol}$), condicionada directamente por el pH del vino:

$$\text{SO}_2\text{ mol} = \frac{\text{SO}_2\text{ libre}}{1 + 10^{\text{pH} - 1,81}} \quad (\text{a } 20^\circ\text{C})$$

Vinho-Lab Correções calcula la masa exacta de metabisulfito potásico ($\text{K}_2\text{S}_2\text{O}_5$) o sulfuroso líquido en disolución requerida para alcanzar el umbral protector objetivo de $0,8\text{ mg/L}$ molecular. Si el pH del vino es excesivamente elevado (&ge;3,70), la calculadora emite una advertencia enológica: añadir sulfuroso de forma aislada superará el límite legal de $\text{SO}_2$ total antes de conferir protección microbiana eficaz, recomendando acidificación previa o clarificación con quitosano de origen fúngico.

### 3. Ingestión Directa de Informes y Blindaje de Privacidad RGPD
La aplicación asimila los boletines generados en **Vinho-Lab Companheiro** sin intervención manual:
- **Tablas en Markdown (`.md`):** Extracción automatizada por expresiones regulares de lecturas y perfiles enológicos.
- **Sesiones JSON (`.json`):** Lectura directa de la estructura canónica `measurements{}` con verificación de unidades.

**Higienización de Privacidad:** Nombres de bodegas, códigos de depósito o barrica, fechas de vendimia y datos de los técnicos se omiten localmente. Solo se transmiten al proveedor de IA los valores numéricos anonimizados y los síntomas seleccionados, tras confirmar un modal explícito conforme al Artículo 6(1)(a) del RGPD.

---

## 04 / Espacios de Trabajo y Atlas de Defectos

<br/>

<div align="center">
  <img src="assets/readme/showcase.svg" alt="Vinho-Lab Correções Espacios de Trabajo" width="100%"/>
</div>

<br/>

### Estructura de Pestañas de la Aplicación

| Pestaña | Objetivo Operativo | Funcionalidades Clave |
|---|---|---|
| **01 / Correções** | Formulario analítico e importación de boletines | Entrada de TAV, pH, $\text{SO}_2$ libre/total, acidez volátil/total, extracto seco; matriz de síntomas; carga en un clic desde Companheiro |
| **02 / Diagnóstico IA** | Consulta y prescripción con IA | Envío al proveedor de IA; tarjeta diagnóstica estructurada; clasificación de severidad (inmediata, moderada, preventiva); índice de reversibilidad |
| **03 / Calculadoras** | Dosificaciones y cálculos de enriquecimiento | $\text{SO}_2$ molecular Sudraud-Chauvet; acidificación tartárica; desacidificación con carbonato cálcico; chaptalización |
| **04 / Comparação** | Comparativa entre boletines y normativas | Comparación analítica diferencial entre muestras; matriz de discrepancias legales entre PT/UE y Brasil |
| **05 / Fichas de Defeito** | Enciclopedia técnica de alteraciones | 20 fichas detalladas de defectos: moléculas marcadoras, causas bioquímicas, pruebas diagnósticas, tratamientos admitidos |
| **06 / Produtos** | Directorio de tratamientos enológicos | 19 productos enológicos en 9 familias: sulfitos, ácidos, clarificantes, adsorbentes, estabilizantes antimicrobianos |

<br/>

<details>
<summary><strong>Explorar las 20 Fichas Catalogadas de Defectos Enológicos (Haz clic para desplegar)</strong></summary>
<br/>

1. **Alteraciones Químicas (11):** Déficit de $\text{SO}_2$ Libre, Exceso de $\text{SO}_2$ Total, Acidez Volátil Elevada (Picado Acético), pH Elevado / Baja Acidez Total, Anhídrido Carbónico Residual, Oxidación Química (Acescencia y Formación de Acetaldehído), Presencia de Acetato de Etilo, Quiebra Cúprica (Cobre), Quiebra Férrica (Hierro), Gusto a Luz (*Goût de Lumière*), Sobreextracción / Amargor Fenólico Excesivo.
2. **Alteraciones Microbiológicas (5):** Contaminación por *Brettanomyces* / 4-Etilfenol, Refermentación en Botella, Enfermedad de la Vuelta / Manitol, Flor o Levaduras de Velo (*Mycoderma vini*), Gusto a Ratón (Tetrahidropiridinas).
3. **Inestabilidades Físico-Químicas (3):** Precipitación de Bitartrato Potásico / Tartrato Cálcico, Quiebra Proteica (Inestabilidad Térmica), Turbidez Coloidal por Glucanos / Pectinas.
4. **Alteraciones Mixtas (1):** Síndrome de Reducción Combinado (Ácido Sulfhídrico / Mercaptanos).

</details>

---

## 05 / Superficie de Control e Interfaz

<br/>

<div align="center">
  <img src="assets/readme/control-surface.svg" alt="Vinho-Lab Correções Superficie de Control" width="100%"/>
</div>

<br/>

### Controles Interactivos y Flujo de Trabajo

1. **Cargar o Introducir Datos:** En la pestaña **Correções**, haz clic en *Importar boletim* para cargar un archivo `.json` o `.md` exportado desde Vinho-Lab Companheiro, o introduce manualmente los valores analíticos. Marca los síntomas observados en bodega (olor volátil, notas animales, turbidez visual).
2. **Configurar el Proveedor de IA:** Haz clic en el icono de llave en el encabezado para seleccionar tu proveedor (OpenRouter incluye una clave compartida gratuita ya configurada).
3. **Lanzar el Diagnóstico:** Accede a **Diagnóstico IA** y envía la solicitud. Confirma el modal de consentimiento de privacidad RGPD en la primera consulta.
4. **Calcular Dosificaciones:** Accede a **Calculadoras** para determinar la cantidad exacta de metabisulfito potásico, ácido tartárico o desacidificante.
5. **Verificar Restricciones Legales:** Revisa las **Fichas de Defeito** y **Produtos** para comprobar si la intervención se ajusta al Reglamento (UE) 2019/934 o a la IN MAPA 14/2018 de Brasil.

---

## 06 / Proveedores de IA y Protocolo de Privacidad

### Pasarelas de Inferencia Compatibles

| Proveedor | Modelo Predeterminado | Modelo de Tarificación | Mecanismo de Formato |
|---|---|---|---|
| **OpenRouter** (Por defecto) | `nvidia/nemotron-3-super-120b-a12b:free` | Clave compartida gratuita incluida | Extracción JSON por prompt de sistema |
| **Google Gemini** | `gemini-2.5-flash` | Nivel gratuito / Clave de pago propia | `responseMimeType: application/json` nativo |
| **Anthropic Claude** | `claude-haiku-4-5` | Clave de pago proporcionada por el usuario | Extracción JSON por prompt de sistema |
| **OpenAI** | `gpt-4o-mini` | Clave de pago proporcionada por el usuario | `response_format: json_object` nativo |

### Seguridad y Política de Protección de Datos

- **Persistencia Efímera en SessionStorage:** Las claves API introducidas por el usuario se conservan exclusivamente en el `sessionStorage` del navegador y se eliminan al cerrar la pestaña.
- **Cero Retención en Servidor:** Vinho-Lab Correções es una Single Page Application (SPA) sin backend propio. El servidor estático jamás recibe claves, analíticas ni prompts.
- **Tráfico CORS Directo desde el Navegador:** Las llamadas se dirigen directamente desde el navegador del usuario al endpoint de la IA sin proxies intermedios. Se descartan encabezados no estándar para evitar bloqueos en las solicitudes previas OPTIONS.
- **Discreción sobre Datos Comerciales Sensibles:** Los niveles gratuitos (como OpenRouter `:free`) pueden registrar los prompts de forma agregada para entrenamiento. Para elaboraciones y mezclas de alta confidencialidad técnica, se aconseja el uso de claves privadas de pago.

---

## 07 / Calculadoras Enológicas y Matemáticas de Sudraud-Chauvet

### Fórmulas Matemáticas Implementadas

```
1. SO₂ Molecular Activo:
   SO₂ mol = SO₂ Libre / (1 + 10^(pH - 1,81))

2. Dosis de Metabisulfito Potásico (K₂S₂O₅ rinde aprox. 50% de SO₂ activo):
   Gramos K₂S₂O₅ = (Delta de SO₂ Libre deseado en mg/L × Volumen en Litros) / 500

3. Acidificación Tartárica (Límites máximos: +1,5 g/L en Zona C de la UE, +2,5 g/L en Zonas A/B):
   Gramos Ácido Tartárico = Incremento de Acidez Total deseado en g/L × Volumen en Litros

4. Desacidificación con Carbonato Cálcico (CaCO₃):
   Gramos CaCO₃ = Disminución de Acidez en g/L (como tartárico) × 0,667 × Volumen en Litros
```

---

## 08 / Instalación y Desarrollo

### Requisitos Previos

- **Entorno de Ejecución:** Node.js 18+ o Bun 1.1+
- **Gestor de Paquetes:** `npm` (por defecto) o `pnpm`

### Puesta en Marcha Local

```bash
# Clonar el repositorio
git clone https://github.com/mastermaiolo/vinho-lab-correcoes.git
cd vinho-lab-correcoes

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Regenerar el prompt de sistema en TypeScript a partir de los datos JSON
npm run gen-prompt

# Ejecutar la suite de pruebas unitarias (Vitest)
npm test

# Compilar para despliegue en producción
npm run build
```

---

## 09 / Arquitectura y Organización del Código

<br/>

<div align="center">
  <img src="assets/readme/architecture.svg" alt="Vinho-Lab Correções Arquitectura del Pipeline" width="100%"/>
</div>

<br/>

### Estructura de Directorios

```
vinho-lab-correcoes/
├── public/                    # Recursos estáticos de la web
├── src/
│   ├── main.tsx               # Punto de entrada que monta <I18nProvider><App />
│   ├── App.tsx                # Enrutador de pestañas y estado global de IA
│   ├── tabs/                  # Espacios de trabajo principales
│   │   ├── Correcoes.tsx      # Entrada de métricas analíticas e importación de ficheros
│   │   ├── DiagnosticoIA.tsx  # Petición a IA y renderizado de diagnósticos
│   │   ├── Calculadoras.tsx   # Cálculo de SO₂ molecular, acidificación y chaptalización
│   │   ├── Comparacao.tsx     # Comparación entre boletines y discrepancias legales
│   │   ├── FichasDefeito.tsx  # Fichas técnicas de las 20 alteraciones del vino
│   │   └── Produtos.tsx       # Catálogo de productos enológicos autorizados
│   ├── components/            # Componentes de interfaz y diálogos modales
│   │   ├── Header.tsx         # Barra de navegación superior y estado de API
│   │   ├── ApiKeyModal.tsx    # Diálogo para seleccionar proveedor y clave de API
│   │   ├── PrivacyConsentModal.tsx # Consentimiento de privacidad según RGPD Art. 6
│   │   └── LanguageSwitcher.tsx # Selector de idioma de la interfaz
│   ├── lib/                   # Motores algorítmicos y enológicos
│   │   ├── aiClient.ts        # Clientes HTTP directos para los 4 modelos de IA
│   │   ├── calculadoras.ts    # Ecuaciones de dosificación enológica
│   │   ├── mdParser.ts        # Analizador de boletines .md y .json de Companheiro
│   │   ├── promptBuilder.ts   # Constructor de prompts con métricas analíticas
│   │   ├── systemPrompt.ts    # Instrucciones base del enólogo experto
│   │   └── systemPromptGenerated.ts # Base estática compilada en JSON para TypeScript
│   └── data/                  # Fuentes de datos únicas (Single Source of Truth)
│       ├── defeitos.json      # 20 defectos, moléculas marcadoras y pruebas
│       ├── produtos_correcao.json # 19 productos enológicos en 9 familias
│       ├── limites_pt_ue.json # Límites legales UE y Portugal (IVV, Reg. 2019/934)
│       └── limites_brasil.json# Límites legales de Brasil (MAPA IN 14/2018)
├── scripts/
│   └── gen-system-prompt.js   # Script que compila los JSON en prompts TypeScript
└── assets/
    └── readme/                # Recursos vectoriales SVG del sistema visual
```

---

## 10 / Resolución de Problemas y Casos Extremos

<br/>

<div align="center">
  <img src="assets/readme/failure-modes.svg" alt="Vinho-Lab Correções Modos de Fallo" width="100%"/>
</div>

<br/>

### Casos Extremos y Estrategias de Corrección

<details>
<summary><strong>1. Límite de Peticiones HTTP 429 en Niveles Gratuitos de IA</strong></summary>
<br/>

Los modelos públicos en OpenRouter pueden experimentar picos de saturación en horas punta. El módulo `aiClient.ts` implementa reintentos automáticos con retroceso exponencial (hasta 3 intentos). Si la saturación continúa, el usuario puede introducir su propia clave de Gemini, Claude o OpenAI en el modal de configuración.

</details>

<details>
<summary><strong>2. Errores de Solicitud Previa CORS en el Navegador</strong></summary>
<br/>

Al ejecutarse las llamadas a la API directamente desde el navegador sin intermediación de un backend, los encabezados como `X-Title` o `Referer` pueden desencadenar fallos en las peticiones preliminares OPTIONS en ciertas pasarelas. Vinho-Lab Correções descarta los encabezados no esenciales y transmite exclusivamente `Content-Type: application/json` y `Authorization: Bearer <key>`.

</details>

<details>
<summary><strong>3. pH Elevado e Ineficacia de Nuevas Dosis de Sulfuroso</strong></summary>
<br/>

Con valores de pH superiores a 3,70, más del 98% del $\text{SO}_2$ libre se disocia en bisulfito ($\text{HSO}_3^-$), carente de poder antiséptico directo. Añadir más metabisulfito acarrea el riesgo de sobrepasar el tope legal de sulfuroso total antes de lograr estabilidad microbiana. La calculadora alerta sobre esta contingencia y sugiere acidificar previamente con ácido tartárico o aplicar quitosano fúngico.

</details>

<details>
<summary><strong>4. Incompatibilidades Normativas Transfronterizas de Productos</strong></summary>
<br/>

Determinados aditivos autorizados bajo la normativa brasileña de MAPA se hallan restringidos o vetados en la Unión Europea para vinos convencionales u orgánicos (por ejemplo, límites de fosfato amónico dibásico o sorbatos específicos). La base comparativa del sistema evalúa la jurisdicción correspondiente antes de sugerir tratamientos.

</details>

---

## 11 / Linaje y Procedencia

<br/>

<div align="center">
  <img src="assets/readme/provenance.svg" alt="Vinho-Lab Correções Linaje y Procedencia" width="100%"/>
</div>

<br/>

### Marco Regulatorio

- **Unión Europea y Portugal:** Instituto da Vinha e do Vinho (IVV) — *Reglamento (UE) n.º 1308/2013*, *Reglamento Delegado (UE) 2019/934 de la Comisión* y *Reglamento (UE) 2024/3085*.
- **República Federativa de Brasil:** Ministério da Agricultura, Pecuária e Abastecimento (MAPA) — *Instrucción Normativa IN n.º 14/2018*, *Portaria MAPA n.º 723/2024* y *Ley Federal n.º 7.678/1988*.
- **Normas Técnicas Internacionales:** Organisation Internationale de la Vigne et du Vin (OIV) — *Código de Prácticas Enológicas*.

### Ecosistema de Aplicaciones Hermanas

- **Vinho-Lab Companheiro (`vinho-lab-comp`):** Mide, calcula parámetros analíticos OIV en el banco de trabajo y valida la aptitud comercial para exportación.
- **Vinho-Lab Correções (`vinho-lab-correcoes`):** Diagnostica defectos organolépticos, calcula dosificaciones correctoras y coteja tratamientos con las restricciones legales.
- **Autoría e Ingeniería:** Master Maiolo · MAIOLO / SYSTEMS LAB.

### Licencia

Distribuido bajo la **Licencia MIT**. Consulta el archivo [LICENSE](LICENSE) para conocer los términos completos.

---

<div align="center">
<sub>MAIOLO / SYSTEMS LAB · VINHO-LAB CORREÇÕES · DIAGNÓSTICO ENOLÓGICO DE DEFECTOS ASISTIDO POR IA</sub>
</div>
