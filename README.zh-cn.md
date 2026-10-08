<div align="center">

# VINHO-LAB CORREÇÕES

**AI 辅助葡萄酒缺陷鉴别诊断与酿酒校正剂量计算器**

[![Release](https://img.shields.io/badge/release-v1.0.0-AD283B?style=flat-square&labelColor=13161A)](https://github.com/mastermaiolo/vinho-lab-correcoes)
[![许可证](https://img.shields.io/badge/许可证-MIT-E9E5DC?style=flat-square&labelColor=13161A)](LICENSE)
[![生产环境](https://img.shields.io/badge/生产环境-vinholabcor.vercel.app-C86D51?style=flat-square&labelColor=13161A)](https://vinholabcor.vercel.app)
[![技术栈](https://img.shields.io/badge/React-18%20%2B%20Vite-B62B32?style=flat-square&labelColor=13161A)](https://vitejs.dev)
[![合规认证](https://img.shields.io/badge/合规性-PT%2FUE%20%E2%86%94%20BR%20(OIV)-E9E5DC?style=flat-square&labelColor=13161A)](https://www.oiv.int)

<br/>

[English (UK)](README.md) · [Português (Brasil)](README.pt-br.md) · [Português (Portugal)](README.pt-pt.md) · [Español](README.es-es.md) · **简体中文**

<br/>

<img src="assets/readme/hero.svg" alt="Vinho-Lab Correções 核心画布" width="100%"/>

</div>

<br/>

> **面向酿酒师、酒庄主管与酒窖技术人员的 Web 应用**：提供由人工智能驱动的葡萄酒缺陷鉴别诊断、高精度酿酒校正添加量计算器，以及跨**葡萄牙 / 欧盟**与**巴西**双重法规划界的合规参考系统。
>
> 本项目为 [**Vinho-Lab Companheiro**](https://github.com/mastermaiolo/vinho-lab-comp) 的姊妹应用 —— *Companheiro 负责在化验台测量、核验理化指标；Correções 负责诊断异态缺陷并开具符合法规的工艺处方。*
>
> 🔗 **线上生产环境部署：** [vinholabcor.vercel.app](https://vinholabcor.vercel.app)

> [!WARNING]
> **决策辅助工具声明：** 本系统仅作为酿酒技术咨询与决策辅助参考。不能替代由具备资质的认可化验室出具的官方检验报告，亦不可替代持证专业酿酒师的现场技术签核。

---

## 01 / 导航目录

- [02 / 项目概览](#02--项目概览)
- [03 / 核心能力与工程设计](#03--核心能力与工程设计)
- [04 / 工作区与缺陷图谱](#04--工作区与缺陷图谱)
- [05 / 控制面板与操作流程](#05--控制面板与操作流程)
- [06 / AI 接入与隐私安全协议](#06--ai-接入与隐私安全协议)
- [07 / 酿酒计算器与 Sudraud-Chauvet 数学模型](#07--酿酒计算器与-sudraud-chauvet-数学模型)
- [08 / 安装部署与本地开发](#08--安装部署与本地开发)
- [09 / 系统架构与工程目录结构](#09--系统架构与工程目录结构)
- [10 / 常见故障排查与边缘场景处理](#10--常见故障排查与边缘场景处理)
- [11 / 项目渊源与技术沿革](#11--项目渊源与技术沿革)

---

## 02 / 项目概览

在酿造或熟化过程中出现异常理化读数或感官风味劣化时，酿酒团队必须迅速做出精准的技术决断。Vinho-Lab Correções 将化验台理化数据与感官异味症状交叉比对，推导生化根本原因，推荐实验室复核方案，并自动计算法定许可工艺药剂的精确添加量。

<br/>

<div align="center">
  <img src="assets/readme/at-a-glance.svg" alt="Vinho-Lab Correções 项目概览" width="100%"/>
</div>

<br/>

### 核心架构优势

| 架构支柱 | 技术实现机制 | 酒窖实际应用价值 |
|---|---|---|
| **AI 鉴别诊断引擎** | 纯客户端多模型网关（OpenRouter、Gemini、Claude、OpenAI） | 明确生化机理诱因、复核化验方法及法定许可纠偏措施 |
| **Companheiro 无缝对接** | 双模解析器自动载入 `.md` 报表与 `.json` 会话文件 | 告别重复手动抄写；秒级自动填充理化指标参数 |
| **Sudraud-Chauvet SO₂ 算法** | 基于酒液 pH 与温度动态推导活性分子态 $\text{SO}_2$ | 确保抗菌防腐有效性（$0.8\text{ ppm}$）同时严守法定总量上限 |
| **完整缺陷知识图谱** | 涵盖化学、微生物及物理失衡 3 大类的 20 种典型葡萄酒病害 | 标识化合物、嗅觉表征特征及法定许可处理工艺一览 |
| **纯前端零留存隐私防线** | API 凭证保存在 `sessionStorage`；浏览器直连服务商端点 | 酒庄名称、储酒罐批号及生产主体信息绝不外泄 |

---

## 03 / 核心能力与工程设计

<br/>

<div align="center">
  <img src="assets/readme/capabilities.svg" alt="Vinho-Lab Correções 核心能力" width="100%"/>
</div>

<br/>

### 1. AI 辅助鉴别诊断
系统综合考量实验室基础读数（酒精度 % vol、pH、游离与总 $\text{SO}_2$、挥发酸、总酸、干浸出物）与酒窖现场感官观察指标（浑浊度、醋酸/胶水异味、烂苹果氧化味、马汗/马厩味、还原硫味）。

通过由结构化数据库直接编译的酿酒专家系统提示词（`scripts/gen-system-prompt.js`），AI 将返回标准化的 JSON 数据：
- **主要诊断结论与概率估算：** 明确异常病害（例如酒香酵母 *Brettanomyces* 污染、醋酸酸败、酒石酸结晶失稳、热不稳定蛋白质沉淀等）。
- **生化根本诱因：** 阐释造成缺陷的微生物代谢途径或胶体物理化学机理。
- **验证性化验规程：** 同时给出规范的化验室生化复验方法与现场快速简易判别法。
- **法定纠偏行动方案：** 区分紧急制止恶化的下胶/抑菌操作与预防复发的酒窖卫生管理措施。
- **适用法律依据条文：** 每一项处置方案均对应欧盟规例或巴西联邦法令的具体条款。

### 2. Sudraud-Chauvet 分子态 $\text{SO}_2$ 精准计算
二氧化硫在酒体中的杀菌防腐效果完全取决于未解离的活性分子态（$\text{SO}_2\text{ mol}$），而该比例直接受酒体 pH 值调控：

$$\text{SO}_2\text{ mol} = \frac{\text{游离 }\text{SO}_2}{1 + 10^{\text{pH} - 1.81}} \quad (20^\circ\text{C}\text{ 条件下})$$

Vinho-Lab Correções 能够根据酒体体积计算达到目标保护浓度（$0.8\text{ mg/L}$）所需的焦亚硫酸钾（$\text{K}_2\text{S}_2\text{O}_5$）或液体二氧化硫的精确投料克数。如果酒体 pH 过高（&ge;3.70），计算器将发出警示：仅靠补硫将在达到防腐保护浓度之前突破法定总硫上限，系统将自动建议优先进行酒石酸增酸或投加真菌源壳聚糖。

### 3. Companheiro 报告一键导入与 GDPR 隐私护栏
系统直接兼容 **Vinho-Lab Companheiro** 导出的分析档案：
- **Markdown 报表表格（`.md`）：** 正则表达式引擎自动提取结构化读数与葡萄酒类型。
- **JSON 分析会话（`.json`）：** 原生识别 `measurements{}` 规范字段及单位。

**隐私安全过滤：** 酒庄名、批次编号、年份和技术人员签字等元数据均在本地前端脱敏剔除。仅将无标识的纯理化数值及勾选的感官症状发送给 AI 模型，并在首次调用前弹出严格符合欧盟 GDPR 第 6(1)(a) 条的授权弹窗。

---

## 04 / 工作区与缺陷图谱

<br/>

<div align="center">
  <img src="assets/readme/showcase.svg" alt="Vinho-Lab Correções 工作区展示" width="100%"/>
</div>

<br/>

### 应用工作区分区矩阵

| 标签页 | 业务重点 | 核心功能 |
|---|---|---|
| **01 / Correções（校正）** | 理化数据录入与报表导入 | 输入酒精度、pH、游离/总硫、挥发酸/总酸、干浸出物；症状勾选矩阵；一键载入 Companheiro 档案 |
| **02 / Diagnóstico IA（AI 诊断）** | 智能推理与工艺处方审阅 | 调用 AI 网关；结构化诊断卡片输出；严重度分级（紧急、中度、预防）；缺陷可逆性指数 |
| **03 / Calculadoras（计算器）** | 酿造校正投料计算 | Sudraud-Chauvet 分子硫计算；酒石酸加酸增酸；碳酸钙降酸；加糖富集度计算 |
| **04 / Comparação（对比分析）** | 样品批次与法规差异对比 | 多批次化验读数差异横向对比；葡萄牙/欧盟与巴西之间法定阈值差异比对 |
| **05 / Fichas de Defeito（缺陷图谱）** | 酿酒缺陷权威知识库 | 20 份详尽缺陷档案：特征标记物、生化诱因、化验方法、法定允许处理手段 |
| **06 / Produtos（产品目录）** | 酿造辅助制剂名录 | 9 大门类下的 19 种酿酒辅料：亚硫酸盐制剂、有机酸、澄清剂、吸附剂、抗菌稳定剂 |

<br/>

<details>
<summary><strong>展开浏览收录的 20 份葡萄酒缺陷技术档案（点击展开）</strong></summary>
<br/>

1. **化学性病害与失衡（11 种）：** 游离 $\text{SO}_2$ 缺失、总 $\text{SO}_2$ 超标、挥发酸过高（醋酸酸败）、高 pH / 低总酸、二氧化碳残留过量、化学氧化（乙醛异味与褐变）、乙酸乙酯形成（指甲水味）、铜破败病（铜浑浊）、铁破败病（铁浑浊）、光击味（日光嗅 / *Goût de Lumière*）、酚类过萃取与结构性苦涩。
2. **微生物病害（5 种）：** 酒香酵母（*Brettanomyces*）/ 4-乙基苯酚污染、瓶内酵母二次发酵、甘露醇发酵病 / 乳酸病、产膜酵母生花（*Mycoderma vini*，酒花菌）、鼠臭味（四氢吡啶衍生异味）。
3. **物理与胶体不稳定（3 种）：** 酒石酸氢钾 / 酒石酸钙结晶沉淀、热诱导蛋白质破败（蛋白浑浊）、葡聚糖 / 果胶胶体浑浊。
4. **混合型病害（1 种）：** 复合还原气味综合征（硫化氢 / 硫醇化合物）。

</details>

---

## 05 / 控制面板与操作流程

<br/>

<div align="center">
  <img src="assets/readme/control-surface.svg" alt="Vinho-Lab Correções 控制面板" width="100%"/>
</div>

<br/>

### 交互操作标准工作流

1. **数据导入或手动输入：** 在 **Correções** 页面中，点击 *Importar boletim* 载入来自 Vinho-Lab Companheiro 的 `.json` 或 `.md` 简报，或手动键入各理化数值，并勾选当前观察到的感官症状（如挥发酸异味、动物毛皮味、混浊外观）。
2. **配置 AI 服务商：** 点击顶部导航栏的钥匙图标选择推理模型（默认提供免费共享凭证的 OpenRouter 渠道）。
3. **执行智能诊断：** 切换至 **Diagnóstico IA** 页面并提交。首次调用时确认并同意 GDPR 隐私保护弹窗。
4. **计算纠偏投料量：** 切换至 **Calculadoras** 计算焦亚硫酸钾、酒石酸或碳酸钙的精确添加克数。
5. **核验法律限制指标：** 查阅 **Fichas de Defeito** 与 **Produtos**，确认所拟采取的物理或化学下胶手段是否符合欧盟 (EU) 2019/934 规例或巴西 MAPA IN 14/2018 规范。

---

## 06 / AI 接入与隐私安全协议

### 支持的模型服务网关

| 服务商 | 默认接入模型 | 资费模式 | 结构化输出机制 |
|---|---|---|---|
| **OpenRouter**（默认） | `nvidia/nemotron-3-super-120b-a12b:free` | 内置免费共享密钥 | 系统提示词驱动 JSON 校验 |
| **Google Gemini** | `gemini-2.5-flash` | 免费额度 / 自备私有 API Key | 原生 `responseMimeType: application/json` |
| **Anthropic Claude** | `claude-haiku-4-5` | 需自备私有 API Key | 系统提示词驱动 JSON 校验 |
| **OpenAI** | `gpt-4o-mini` | 需自备私有 API Key | 原生 `response_format: json_object` |

### 安全与数据隐私规范

- **会话存储生命周期：** 用户输入的 API 密钥仅暂存于浏览器 `sessionStorage` 中，浏览器标签页关闭后自动彻底销毁。
- **零服务端留存承诺：** Vinho-Lab Correções 为纯静态单页应用程序（SPA），静态托管服务器从不接收、处理或中转任何 API 密钥、化验数据或提示词。
- **纯浏览器端直连请求：** 请求直接由用户浏览器向对应 AI 供应商发起，无需反向代理中继。系统自动剥离非必要请求头（如 `X-Title` 等），规避 OPTIONS 跨域预检异常。
- **商业数据保密建议：** 免费公开接口（如 OpenRouter `:free`）可能将输入数据用于上游模型训练。对于涉及商业机密的高端酒款调配，建议配置自备私有付费密钥。

---

## 07 / 酿酒计算器与 Sudraud-Chauvet 数学模型

### 核心数学公式实现

```
1. 活性分子态 SO₂ 计算：
   SO₂ mol = 游离 SO₂ / (1 + 10^(pH - 1.81))

2. 焦亚硫酸钾投药量计算（K₂S₂O₅ 有效释放率约为 50%）：
   焦亚硫酸钾克数 = (目标游离 SO₂ 提升差值 mg/L × 酒液升数) / 500

3. 酒石酸增酸计算（法定加酸上限：欧盟 C 区为 +1.5 g/L，A/B 区为 +2.5 g/L）：
   酒石酸克数 = 期望总酸提升量 g/L × 酒液升数

4. 碳酸钙 (CaCO₃) 降酸计算：
   碳酸钙克数 = 拟降低酸度 g/L（以酒石酸计）× 0.667 × 酒液升数
```

---

## 08 / 安装部署与本地开发

### 环境依赖

- **运行环境：** Node.js 18+ 或 Bun 1.1+
- **包管理器：** `npm`（推荐）或 `pnpm`

### 本地启动流程

```bash
# 克隆代码仓库
git clone https://github.com/mastermaiolo/vinho-lab-correcoes.git
cd vinho-lab-correcoes

# 安装依赖
npm install

# 启动本地开发热更新服务器
npm run dev

# 从 JSON 知识库重新生成内嵌的 TypeScript 系统提示词
npm run gen-prompt

# 运行自动化单元测试套件 (Vitest)
npm test

# 生产环境编译构建
npm run build
```

---

## 09 / 系统架构与工程目录结构

<br/>

<div align="center">
  <img src="assets/readme/architecture.svg" alt="Vinho-Lab Correções 系统流水线架构" width="100%"/>
</div>

<br/>

### 目录结构组织

```
vinho-lab-correcoes/
├── public/                    # 静态 Web 资源
├── src/
│   ├── main.tsx               # 挂载入口 <I18nProvider><App />
│   ├── App.tsx                # 标签页路由切换与全局 AI 状态机
│   ├── tabs/                  # 核心酿造业务工作区
│   │   ├── Correcoes.tsx      # 理化指标输入与 Companheiro 简报导入
│   │   ├── DiagnosticoIA.tsx  # AI 调度与结构化诊断结果卡片渲染
│   │   ├── Calculadoras.tsx   # 分子 SO₂、酒石酸增酸与加糖富集算法
│   │   ├── Comparacao.tsx     # 跨批次与跨法规管辖区域比对视图
│   │   ├── FichasDefeito.tsx  # 20 种葡萄酒缺陷技术档案详情
│   │   └── Produtos.tsx       # 经批准许可的酿造药剂辅料目录
│   ├── components/            # 界面通用组件与弹窗
│   │   ├── Header.tsx         # 顶部导航栏与 API 状态按钮
│   │   ├── ApiKeyModal.tsx    # AI 服务商切换与密钥设置弹窗
│   │   ├── PrivacyConsentModal.tsx # GDPR 第 6 条合规授权弹窗
│   │   └── LanguageSwitcher.tsx # 多语言区域切换控件
│   ├── lib/                   # 算法逻辑与酿造核心库
│   │   ├── aiClient.ts        # 4 类 AI 模型的浏览器直连 HTTP 客户端
│   │   ├── calculadoras.ts    # 酿酒投料量换算方程实现
│   │   ├── mdParser.ts        # Companheiro .md 与 .json 文件解析引擎
│   │   ├── promptBuilder.ts   # 结合实测读数的结构化 Prompt 组装器
│   │   ├── systemPrompt.ts    # 资深酿酒师基底系统指令
│   │   └── systemPromptGenerated.ts # 从 JSON 编译生成的静态知识库
│   └── data/                  # 单一可信数据源（Single Source of Truth）
│       ├── defeitos.json      # 20 种缺陷的特征物、病因及化验规程
│       ├── produtos_correcao.json # 9 大分类下的 19 种酿酒辅料数据
│       ├── limites_pt_ue.json # 葡萄牙与欧盟法定指标限值 (IVV, Reg. 2019/934)
│       └── limites_brasil.json# 巴西法定指标限值 (MAPA IN 14/2018)
├── scripts/
│   └── gen-system-prompt.js   # 将 JSON 数据编译并注入 TS 提示词的构建脚本
└── assets/
    └── readme/                # 模块化矢量 SVG 设计视觉资产
```

---

## 10 / 常见故障排查与边缘场景处理

<br/>

<div align="center">
  <img src="assets/readme/failure-modes.svg" alt="Vinho-Lab Correções 故障与边缘场景" width="100%"/>
</div>

<br/>

### 常见故障与应对策略

<details>
<summary><strong>1. 免费公共 AI 模型触发 HTTP 429 请求超频限流</strong></summary>
<br/>

OpenRouter 上的免费共享模型在访问高峰期可能出现限流。`aiClient.ts` 模块内置了指数退避自动重试机制（最多重试 3 次）。若拥堵持续，建议在设置中填入自备的 Gemini、Claude 或 OpenAI 私有密钥。

</details>

<details>
<summary><strong>2. 浏览器 CORS 跨域预检失败</strong></summary>
<br/>

由于 API 请求从浏览器直接发出而未通过后端中继代理，携带类似 `X-Title` 或 `Referer` 的非标请求头可能导致部分 AI 接口的 OPTIONS 预检被拒。Vinho-Lab Correções 严格剔除一切多余请求头，仅保留 `Content-Type: application/json` 与 `Authorization: Bearer <key>`。

</details>

<details>
<summary><strong>3. 高 pH 状态下补硫失效陷阱</strong></summary>
<br/>

当酒液 pH 超过 3.70 时，超过 98% 的游离二氧化硫解离为无抑菌能力的亚硫酸氢根离子（$\text{HSO}_3^-$）。盲目增加焦亚硫酸钾添加量会导致总硫超标而仍无法建立抗菌屏障。计算器将自动锁定此临界状态并提示应优先使用酒石酸降低 pH，或改用真菌源壳聚糖。

</details>

<details>
<summary><strong>4. 跨境流通时特定添加剂合规冲突</strong></summary>
<br/>

部分符合巴西 MAPA 规定的工艺添加剂在欧盟常规或有机酒规范中可能被禁用或受严格限制（例如磷酸氢二铵添加限量或特定山梨酸盐）。系统对比引擎会在推荐处置方案前交叉比对目标市场的准入法规。

</details>

---

## 11 / 项目渊源与技术沿革

<br/>

<div align="center">
  <img src="assets/readme/provenance.svg" alt="Vinho-Lab Correções 项目渊源" width="100%"/>
</div>

<br/>

### 依据法规标准

- **欧洲联盟与葡萄牙：** 葡萄与葡萄酒研究所（IVV）—— *欧洲议会和理事会 (EU) 第 1308/2013 号规例*、*欧盟委员会授权规例 (EU) 2019/934* 及 *规例 (EU) 2024/3085*。
- **巴西联邦共和国：** 农业、畜牧与供应部（MAPA）—— *规范性指令 IN n.º 14/2018*、*MAPA 第 723/2024 号法令* 及 *联邦第 7.678/1988 号法律*。
- **国际技术通则：** 国际葡萄与葡萄酒组织（OIV）—— *国际酿酒常规法典*。

### 姊妹应用生态关系

- **Vinho-Lab Companheiro (`vinho-lab-comp`)：** 用于化验台物理分析测量与基础 OIV 指标计算，并出具双重法规合规出口证明。
- **Vinho-Lab Correções (`vinho-lab-correcoes`)：** 用于感官与生化缺陷诊断，精确模拟校正添加剂量，并严格防范法规违禁风险。
- **研发与系统架构：** Master Maiolo · MAIOLO / SYSTEMS LAB。

### 开源许可证

遵循 **MIT 开源许可证**。完整条款请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">
<sub>MAIOLO / SYSTEMS LAB · VINHO-LAB CORREÇÕES · AI 辅助葡萄酒缺陷诊断系统</sub>
</div>
