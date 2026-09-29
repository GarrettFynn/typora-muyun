---
title: MuYun 慕云 · Typora 主题完全演示
author: GarrettFynn
version: 0.3.2
description: 设计思路、设计步骤与 Markdown 全格式演练
---

# 慕云 MuYun · Typora 主题完全演示

> *A snug theme for long-form reading, fast writing & quick navigation.*
> 一款为**长文阅读、高效写作、快速定位**而生的 Typora 主题。

**MuYun**（慕云，"admiring the clouds"）移植自同作者的 Obsidian 主题 [obsidian-muyun](https://github.com/GarrettFynn/obsidian-muyun)，共享同一套设计令牌：纸感底色、降饱和不偏色的锚点色系、克制的动效纪律。本文件既是主题的**设计说明书**，也是一份**全格式演练文档**——你现在看到的每一种 Markdown 元素，都已由本主题精心着色。

[TOC]

---

## 一、设计思路

### 1.1 三支柱

主题的一切决策都回到三根支柱上：

1. **阅读舒适（Reading Comfort）**——底色与正文的对比度压在 **≈10:1 舒适带**而非最大值。实测数据：浅色「晨光暖纸」正文 10.09:1，深色「墨蓝夜空」10.89:1。长时间阅读不累眼，是这个支柱的唯一判据。
2. **写作高效（Writing Efficiency）**——所见即所得、源码模式与 PDF 导出共用同一套 CSS 变量，模式切换零视觉跳变；输入光标、勾选弹入、行悬停高亮等微反馈全部 ≤200ms，只动颜色、透明度与位移。
3. **快速定位（Quick Navigation）**——三级标题锚点色（H1 沙金 / H2 慕云紫 / H3 链接蓝）、H2 路标条、大纲面板层级色条、文件树当前项左条与父链高亮。所有设计都为了让「几百篇文档里一瞥定位」成立。

### 1.2 调色哲学：降饱和，不偏色

全部语义色取自同一 **11 色池**：沙金、慕云紫、链接蓝、慕云灰紫、墨紫、蓝紫、苔绿、陶土、暗红……每种强调色相对高饱和方案**降饱和 30–40%，但保留色相**。这样做的效果是：色块依然一眼可辨，而视线扫过时不会被任何一个颜色"叫住"。

*一个有趣的细节*：深色模式的大纲 H2 色条并未沿用正文的 `#525288`——它在深底上只有 2.5:1 的对比度，小面积几乎不可见。主题为此引入独立令牌 `--muyun-outline-h2`，按「色相不变、亮度抬升」取 `#8383B8`（≈4.7:1）。**正文标题忠于原设计，导航色条忠于可读性**，两者各得其所。

### 1.3 动效四纪律

- 时长 ≤200ms（标准档 120ms）；
- 只动 `color` / `opacity` / `transform`，绝不动布局属性；
- 系统开启「减弱动态效果」时全部关闭（`prefers-reduced-motion`）；
- 克制优先：默认动效只有反馈型（hover 渐亮、勾选弹入），装饰型一律不默认开启。

### 1.4 打印即纸

无论当前处于浅色还是深色模式，导出 PDF 恒为白纸黑字：标题防孤行、表头跨页重复、代码块防截断、`@page` 边距 18/16mm。深色主题产出暗底 PDF 是常见事故，本主题从第一版就把打印态单独设防。

---

## 二、设计步骤

移植不是抄色值。整个过程走了八步，每一步都有对应的验证手段。

### 2.1 第一步：令牌盘点与映射

先把 Obsidian 版的设计令牌全部列出（纸面 8 项、锚点色 9 项、派生面 7 项、动效 3 项），逐项映射到 Typora 的双轨体系：

| Obsidian 侧 | Typora 侧 | 说明 |
| --- | --- | --- |
| `--background-primary` | `--bg-color` | Typora 内建变量，窗口与导出共用 |
| `--text-normal` | `--text-color` | 正文 |
| `--link-color` 等 | `--muyun-*` 私有令牌 | 组件规则全部消费私有令牌 |
| `.theme-dark { }` | `muyun-dark.css` | 深色文件只覆盖令牌，不写组件规则 |

**关键架构决策**：深色文件通过 `@import "muyun.css"` 复用全部组件规则，自身只做令牌替换——单一事实源，深浅两态永不漂移。宽幅变体 `muyun-wide(-dark).css` 同理，只改 `--muyun-measure` 一个变量。

### 2.2 第二步：正文与标题系统

标题三级色是主题的门面：H1 沙金带底线、H2 慕云紫带 **3px 左侧路标条**（极速滚动时色块先于文字被捕捉）、H3 链接蓝；H4–H6 刻意保持正文色——层级信息交给颜色就不再重复占用字重。行宽默认 40rem（约 660px，长文舒适区验收档），并提供 46/52rem 放宽选项。

### 2.3 第三步：代码体系

Typora 的代码围栏与源码模式走 CodeMirror，语法高亮令牌从 MuYun 调色板派生：关键字慕云紫、字符串苔绿、数字陶土、定义墨紫、注释取灰。深色侧按同一哲学「色相不动、亮度抬升」整体提亮一档。行内代码取二级底色加 4px 圆角，无描边——纸感优先。

### 2.4 第四步：界面铬件

侧栏文件树（文件夹加粗、当前项左条、hover 渐亮、缩进引导线、父链高亮）、大纲面板（层级色条）、快速打开（选中行左条）、偏好设置与导出面板、汉堡菜单、搜索面板、上下文菜单——全部纳入令牌体系。选择器逐一取自官方内置主题的既有类名，不猜 DOM。

> **一个真机踩坑的例子**：大纲面板的层级标记最初挂在 `.outline-item` 上，真机截图发现与标题错位。翻查 Typora 安装目录的 `base.css` 才确认大纲是 **table-cell 布局**——正确挂点是 `.outline-label::before`。这正是「mock 验证不可替代真机验证」的教训。

### 2.5 第五步：排版渐进增强

正文启用 `text-autospace: normal`，中西文混排自动留出半角间隙（Chromium 120+ 生效，旧版静默降级）；代码区显式豁免以保等宽对齐。
*这里也踩过一个规范坑*：关闭关键字不是直觉的 `none`，而是 **`no-autospace`**——`none` 是无效值，浏览器静默忽略。该问题由页面内 A/B 实测抓出：正文 185px、代码区 177px，豁免恢复后才算数。

### 2.6 第六步：可选开关体系

Typora 没有 Style Settings 那样的图形开关面板，主题用「注释块」实现同款体验——默认全关，去掉注释即启用：

```css
/* S4 标题自动编号（默认关；去掉本块的注释标记即启用）
#write h2 {
	counter-reset: muyun-h3;
	counter-increment: muyun-h2;
}
#write h2::before {
	content: counter(muyun-h1) "." counter(muyun-h2) "  ";
	color: var(--muyun-h2);
}
*/
```

启用 S4 后，高特异性规则会自动收起 H2 路标条，避免「编号 + 色条」三层信息叠加——互斥逻辑与 Obsidian 版一致。有趣的是，Typora 所见即所得没有虚拟化问题，**编辑态即可稳定计数**，这一点反而强于 Obsidian 版（后者只敢在阅读视图实现）。

### 2.7 第七步：验证体系

四层验证，层层收紧：

1. **结构门禁**：零依赖脚本跑五道检查——文件齐全、花括号平衡（剥离注释）、`@import` 链可解析、令牌完备性（深色与打印块颜色令牌全对齐、`var()` 引用无悬空）、WCAG 对比度门禁（正文 ≥9:1、余项 ≥4.5:1）。已用六组人为破坏验证每道门禁真的能拦住劣化。
2. **浏览器模拟渲染**：按 Typora DOM 结构搭模拟页，计算样式断言逐项核对令牌取值。
3. **打印态模拟**：把 `@media print` 块转 `@media all` 注入（层叠关系与真实打印一致），断言白底、打印色、防孤行、表头组——深浅两态 11 项全过。
4. **真机 Win32 截图**：真实启动 Typora 应用主题后窗口截图，视觉核对。深色 `kbd` 白块、DWM 窗口边距、大纲对齐三处问题都是这一层抓出来的。

### 2.8 第八步：发布工程

GitHub 公开仓库 + tag 触发 Release（自动附四个主题文件与 README）+ gh-pages 分支提供[免安装在线预览](https://garrettfynn.github.io/typora-muyun/)；CI 在每次推送时跑结构门禁。

---

## 三、功能总览

| 类别 | 特性 | 形态 |
| --- | :--- | :---: |
| 纸面 | 晨光暖纸 / 墨蓝夜空 双态 | 内置 |
| 标题 | 三级锚点色 + H2 路标条 | 内置 |
| 代码 | 围栏 + 源码模式同源语法色 | 内置 |
| 导航 | 大纲层级色条 / 文件树左条 / 父链高亮 | 内置 |
| 排版 | 中西文自动加隙、40rem 行宽 | 内置 |
| 打印 | 强制纸底、防孤行、表头跨页 | 内置 |
| 可选 | S1 斑马纹 / S2 图片卡片 / S4 编号 / 对比度三档 | 默认关 |
| 变体 | 宽幅 46rem（浅 / 深） | 独立主题文件 |

### 版本简史

- **v0.1.0** —— 双态初版：三支柱移植 + 可选开关体系
- **v0.2.0** —— 发布门面：双语 README、实机截图、打印强化、行宽变体
- **v0.3.x** —— 深化：自动加隙、界面铬件补全、CI 门禁、对比度审计、大纲色条
- 完整历史见仓库 [CHANGELOG](https://github.com/GarrettFynn/typora-muyun/blob/main/CHANGELOG.md)

---

## 四、Markdown 全格式演练

以下章节穷尽 Typora 支持的 Markdown 元素，逐一检验主题着色。

### 4.1 行内元素全家福

**加粗沙金**、*斜体*、***粗斜体***、~~删除线~~、`行内代码()`、[行内链接](https://github.com/GarrettFynn/typora-muyun)、自动链接 <https://garrettfynn.github.io/typora-muyun/>、==高亮淡金==、脚注引用[^1]与[^note]、H<sub>2</sub>O 与 x<sup>2</sup>、<u>下划线</u>、快捷键 <kbd>Ctrl</kbd>+<kbd>K</kbd>、emoji 🎐☁️📖、以及转义演示：\*这里不是星号\*、\#也不是标题。

### 4.2 列表

无序三层嵌套：

- 三支柱
  - 阅读舒适
    - 纸感底色（一级底 / 二级底）
    - 对比度舒适带 ≈10:1
  - 写作高效
    - 模式切换零跳变
- 调色板
  - 11 色池
- 动效纪律

有序列表（含起始序号）与任务清单：

3. 从序号 3 开始的有序列表
4. 第二项
5. 第三项

- [x] 已完成任务（勾选弹入动效）
- [x] 阅读舒适 ✓
- [ ] 未完成任务
- [ ] 快速定位演练中

### 4.3 引用与提示块

普通引用，灰字、2px 左条、低刺激：

> 引用第一层——设计文档里的原话应当安静地待在纸边上。
>
> > 引用第二层——嵌套引用边条与缩进随层级递进。

GFM 提示块五类，取自 MuYun Callout 同一调色板：

> [!NOTE]
> 蓝紫 note——补充说明与背景信息。

> [!TIP]
> 苔绿 tip——把 `--muyun-measure` 改成 `46rem` 即得宽幅行宽。

> [!IMPORTANT]
> 慕云紫 important——两个主题文件必须放在同一 themes 目录。

> [!WARNING]
> 陶土 warning——深色文件末尾的打印块不可删除，否则导出暗底 PDF。

> [!CAUTION]
> 暗红 caution——勿在正式文档中开启全部装饰性开关。

### 4.4 代码栅栏

JavaScript：

```javascript
const muyun = {
  paper: ['晨光暖纸', '墨蓝夜空'],
  accent: '慕云灰紫',
  motion: { duration: '≤200ms', props: ['color', 'opacity', 'transform'] },
  pillars: 3,
};

function greet(name) {
  return `你好，${name}`; // 注释取灰
}
```

CSS（令牌示例）：

```css
:root {
  --bg-color: #F7F4ED;
  --text-color: #3B3B44;
  --muyun-h2: #525288;
}
```

Python：

```python
def contrast(fg: str, bg: str) -> float:
    """WCAG 对比度（节选自主题门禁脚本）"""
    l1, l2 = sorted((lum(fg), lum(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)
```

Bash 与 JSON：

```bash
# 下载并启用（Windows 路径示例）
cd "%APPDATA%/Typora/themes"
curl -LO https://github.com/GarrettFynn/typora-muyun/releases/latest/download/muyun.css
```

```json
{
  "name": "muyun",
  "version": "0.3.2",
  "variants": ["muyun", "muyun-dark", "muyun-wide", "muyun-wide-dark"],
  "zeroDependency": true
}
```

### 4.5 表格与对齐

| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 令牌 | 模式 | 对比度 |
| `--text-color` | 浅 / 深 | 10.09 / 10.89 |
| `--muyun-bold` | 浅 / 深 | 4.57 / 10.91 |
| `--muyun-link` | 浅 / 深 | 4.75 / 7.44 |

### 4.6 数学公式

行内公式：质能方程 $E = mc^2$，欧拉公式 $e^{i\pi} + 1 = 0$。

块级公式——高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\text{contrast}(f, b) = \frac{L(f) + 0.05}{L(b) + 0.05}
$$

### 4.7 链接形态

- 行内链接：[GitHub 仓库](https://github.com/GarrettFynn/typora-muyun)
- 引用链接：[在线预览][pages]、[Obsidian 姊妹版][sibling]
- 自动链接：<https://theme.typora.io>
- 带标题的链接：[CHANGELOG](https://github.com/GarrettFynn/typora-muyun/blob/main/CHANGELOG.md "版本历史")

[pages]: https://garrettfynn.github.io/typora-muyun/
[sibling]: https://github.com/GarrettFynn/obsidian-muyun

### 4.8 图片

网络图片（主题实机截图，需联网加载）：

![MuYun 浅色实机截图](https://raw.githubusercontent.com/GarrettFynn/typora-muyun/main/screenshots/light.png)

引用式图片语法：

![MuYun 深色实机截图][dark]

[dark]: https://raw.githubusercontent.com/GarrettFynn/typora-muyun/main/screenshots/dark.png

### 4.9 分隔线与杂项

三条分隔线形态（渲染为同款细灰线）：

---

***

___

缩进即代码（四空格）与极简栅栏：

    这是缩进代码块（4 空格缩进）

```
无语言标注的代码栅栏
```

### 4.10 标题层级纵览

以下六个层级依次渲染（H1 沙金底线 / H2 慕云紫路标条 / H3 链接蓝 / H4–H6 正文色）：

###### 六级标题 · 最深层

##### 五级标题

#### 四级标题

### 三级标题 · 链接蓝

## 二级标题 · 慕云紫路标条

---

## 五、安装与使用

1. 从 [Releases](https://github.com/GarrettFynn/typora-muyun/releases) 下载主题文件（浅色 `muyun.css` / 深色 `muyun-dark.css`，可选宽幅变体）。
2. 放入 themes 目录：**文件 → 偏好设置 → 外观 → 打开主题文件夹**（Windows 为 `%APPDATA%\Typora\themes\`，macOS 为 `~/Library/Application Support/abnerworks.Typora/themes/`）。
3. 重启 Typora，在菜单 **主题** 中选择 `Muyun` 或 `Muyun Dark`。
4. 可选：偏好设置中把字号调到 **17px**（最接近 Obsidian 版 16.5px 的观感）。

> [!TIP]
> 想先看看效果？打开[在线预览][pages]，无需安装任何东西。

---

## 六、结语

慕云的主题文件是纯 CSS、零脚本、零外部字体；深色与宽幅变体经 `@import` 复用基础文件，永不漂移。设计上它忠于三支柱，工程上它有门禁、有审计、有真机验证——希望你在长文里读得舒服，写得顺畅，找得到每一段。

> 云在青天水在瓶。
> *Long-form reading, fast writing & quick navigation — that's all MuYun wants to be.*

[^1]: 脚注一：对比度数据由主题仓库的结构门禁脚本实测生成，见 PALETTE.md。
[^note]: 命名脚注：主题以 MIT 协议开源，欢迎衍生与反馈。
