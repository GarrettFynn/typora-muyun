# MuYun 慕云 · Typora Edition

> The MuYun design (obsidian-muyun) ported to Typora — same paper surfaces, same anchor colors, same restrained motion. MuYun 设计的 Typora 移植版——同款纸面、同款锚点色系、同款克制动效。

**Light 晨光暖纸** → `muyun.css` · **Dark 墨蓝夜空** → `muyun-dark.css`

姊妹仓库：[obsidian-muyun](https://github.com/GarrettFynn/obsidian-muyun)（Obsidian 版，已上架社区目录）。Typora 版为纯 CSS、零脚本依赖；Typora 内建的打字机模式与专注模式补足 Obsidian 版需配套插件才能实现的写作向特性。

## What carries over 设计映射

| Obsidian 版 | Typora 版 |
| --- | --- |
| 晨光暖纸 / 墨蓝夜空纸面 | `muyun.css` / `muyun-dark.css`（组件规则共用，深色只换令牌） |
| H1 沙金 / H2 慕云紫路标条 / H3 链接蓝 | 同款三级标题色 + H2 左侧 3px 路标条 |
| 加粗沙金 / 高亮淡金 / 标签灰紫淡底 | 同款 `strong` / `mark` / `#tag` |
| Callout 语义调色板（蓝紫/苔绿/慕云紫/陶土/暗红） | GFM alerts（note/tip/important/warning/caution）同源色 |
| 40rem 行宽（验收档） | `#write` 默认 40rem，改 `--muyun-measure` 可切 46/52rem |
| 表格 hover 行高亮、勾选弹入、滚动条 hover 变强调色 | 同款 |
| PDF 导出强制白纸黑字 | 两态 `@media print` 均强制纸底 |
| 动效 ≤200ms / reduced-motion 全关 | 同款纪律 |

Typora 专属补全：代码围栏与源码模式语法高亮取自 MuYun 调色板（慕云紫/苔绿/陶土/墨紫/沙金），TOC 层级着色对应大纲圆点（金/紫/蓝），快速打开选中行左条、专注模式弱化到 faint 而非死灰。

## Install 安装

**两个文件必须放在同一个 themes 目录**（`muyun-dark.css` 通过 `@import` 复用 `muyun.css` 的组件规则）。Both files must sit in the same themes folder — `muyun-dark.css` imports `muyun.css`.

- Windows：`%APPDATA%\Typora\themes\`（文件 → 偏好设置 → 外观 → 打开主题文件夹）
- macOS：`~/Library/Application Support/abnerworks.Typora/themes/`

放入后在菜单栏 **主题 Theme → Muyun（浅色）/ Muyun Dark（深色）** 切换。Typora 按文件名识别深色主题（`-dark` 后缀），会自动适配窗口铬件。

## Options 可选开关（默认关）

打开 `muyun.css` 搜「锦上添花批」——三个可选特性各为一个注释块，去掉注释标记即启用，重新包上即关闭：

- **S1 表格斑马纹**：偶数行微底（打印态经 `--muyun-hover: transparent` 自动豁免）。
- **S2 图片圆角卡片**：内容图片加细边框 + 8px 圆角 + 二级底色。
- **S4 标题自动编号**：H1→1 / H2→1.1 / H3→1.1.1，仅正文区；Typora 所见即所得无虚拟化，**编辑态即稳定计数**（优于 Obsidian 版的仅阅读视图）；启用后 `#write h2` 的高特异性规则会自动收起 H2 路标条，无需手动处理。

**正文对比度三档**（默认标准档 ≈10:1，不启用任何块即为标准）：浅色在 `muyun.css`「正文对比度三档」注释区（柔和 `#55555F` / 扎实 `#2C2C33`），深色配套在 `muyun-dark.css` 末尾同名区块（柔和 `#AFB3C2` / 扎实 `#D6D8E0`），与 Obsidian 版同值。

**已内置（无需开关）**：大纲面板层级圆点（金/紫/蓝 = 标题色系，H4 以下取灰）、文件树三件套（文件夹加粗 / 当前项左条 / hover 渐亮 / 缩进引导线）、父链高亮（`:has()`，旧内核静默降级）；文件列表视图（去分隔线 / 摘要取灰 / 信息条 tab / 底栏与路径条 hover / 排序钮强调色 / 搜索面板输入框）、偏好设置与导出面板（导航选中左条 + 控件边框随令牌）、数学公式配色（TeX 源码定义紫 / 渲染式随正文 / 中缝预览条随二级底色）、输入光标随交互色（所见即所得 `caret-color` + 源码模式 3px 光标，仅改取色沿用官方宽度）。

## Notes 说明

- 行宽三档：`muyun.css` 顶部 `--muyun-measure: 40rem` → `46rem` / `52rem`。
- 正文字号在 偏好设置 → 外观 → 字号 调整（17px 最接近 Obsidian 版 16.5px 的观感）。
- `muyun-dark.css` 依赖 Typora 自带的 `night/mermaid.dark.css`（官方内置，随应用分发）。
- 可选开关见上方 Options 段（S1 斑马纹 / S2 图片卡片 / S4 自动编号 / 对比度三档，均默认关）。
- 已内置（无需开关）：大纲层级圆点、文件树三件套 + 父链高亮、文件列表与信息条、偏好设置/导出面板、数学公式配色、输入光标随交互色——明细见 Options 段「已内置」条目。
