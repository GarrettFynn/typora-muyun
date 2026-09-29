# MuYun 调色板与设计令牌

全部语义色取自同一 **11 色池**（与 [obsidian-muyun](https://github.com/GarrettFynn/obsidian-muyun) 共享），原则：**降饱和 30–40%、保留色相**，正文对比度压 ≈10:1 舒适带而非最大值。本表给出「色池 → Typora 变量」对照，供衍生主题参考。

## 纸面与文字

| 角色 | Light 晨光暖纸 | Dark 墨蓝夜空 | 变量 |
| --- | --- | --- | --- |
| 主底 | `#F7F4ED` | `#16161D` | `--bg-color` |
| 二级底 | `#EFEBE3` | `#1D1D27` | `--muyun-bg-secondary` · `--side-bar-bg-color` |
| 正文 | `#3B3B44` | `#C6C9D4` | `--text-color` |
| 弱文字 | `#6B6F80` | `#8A8FA3` | `--muyun-text-muted` |
| 极弱 | `#A0A3B0` | `#565B6E` | `--muyun-text-faint` |
| 边框 | `rgba(0,0,0,.10)` | `rgba(255,255,255,.10)` | `--muyun-border`（strong 为 2.2 倍不透明度） |
| 悬停 | `rgba(0,0,0,.05)` | `rgba(255,255,255,.05)` | `--muyun-hover` |

## 锚点色（11 色池）

| 色 | Light | Dark | 用途 |
| --- | --- | --- | --- |
| 沙金 | `#8A6A30` | `#DDC79C` | 加粗、H1 |
| 慕云紫 | `#525288` | `#525288`（双态同值） | H2、路标条、abstract/example |
| 链接蓝 | `#4A6CAB` | `#93A5DE` | 链接、H3 |
| 灰紫 | `#6760A6` | `#B1AAD8` | 文字强调、悬停、导航标记 |
| 墨紫 | `#4A3A7E` | `#B1AAD8`* | 交互强调（`--primary-color`）、公式源码 |
| 蓝紫 | `#7375AE` | 同左 | note / info / todo 提示块 |
| 苔绿 | `#3F8566` | 同左 | tip / success 提示块、代码字符串 |
| 陶土 | `#A0644C` | 同左 | warning 提示块、代码数字/标签 |
| 暗红 | `#7E3232` | 同左 | caution 提示块（唯一池外例外：danger 红系） |

\* 深色交互强调跟随主题内建变量（基准 `#B1AAD8`），与 Obsidian 版 Q2 决策一致。

## 代码语法（`--muyun-cm-*`，色相不动、深色抬亮度）

| 令牌 | Light | Dark |
| --- | --- | --- |
| 关键字 `--muyun-cm-keyword` | `#525288` | `#9B97D6` |
| 字符串 `--muyun-cm-string` | `#3F8566` | `#7CB99A` |
| 数字/原子 `--muyun-cm-number` | `#A0644C` | `#C79578` |
| 定义 `--muyun-cm-def` | `#4A3A7E` | `#B1AAD8` |
| 注释 `--muyun-cm-comment` | `#6B6F80` | `#8A8FA3` |
| 标签 `--muyun-cm-tag` | `#A0644C` | `#C79578` |
| 属性 `--muyun-cm-attr` | `#8A6A30` | `#DDC79C` |
| 链接 `--muyun-cm-link` | `#4A6CAB` | `#93A5DE` |

## GFM 提示块（Callout 同源）

| 类型 | 左条/标题 | 底色 |
| --- | --- | --- |
| note | 蓝紫 `#7375AE` | 8% / 12%（深色）不透明度 |
| tip | 苔绿 `#3F8566` | 同上 |
| important | 慕云紫 `#525288` | 同上 |
| warning | 陶土 `#A0644C` | 同上 |
| caution | 暗红 `#7E3232` | 同上 |

## 动效令牌

| 令牌 | 值 | 说明 |
| --- | --- | --- |
| `--muyun-d1` | `120ms` | 反馈动效标准档（≤200ms 纪律） |
| `--muyun-ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | 缓出曲线 |
| `--muyun-measure` | `40rem` | 行宽验收档（Wide 变体 46rem） |

对比度三档（柔和/标准/扎实）取值与启用方法见主 README 的 Options 段。
