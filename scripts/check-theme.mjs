#!/usr/bin/env node
/* MuYun 慕云 · Typora 主题结构门禁（零依赖）
   五道检查：
     ① 文件齐全  ② 花括号平衡（剥离注释后）  ③ @import 链可解析且变体可达 muyun.css
     ④ 令牌完备性（深色/打印块颜色令牌覆盖 + var() 引用可解析）  ⑤ 对比度门禁（WCAG）
   用法：node scripts/check-theme.mjs [--report]  （--report 额外输出对比度审计表 markdown）
   约定：新增「浅色定义、深色有意继承」的颜色令牌，须显式加入 INHERITED_BY_DARK。 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['muyun.css', 'muyun-dark.css', 'muyun-wide.css', 'muyun-wide-dark.css'];
const errors = [];
const ok = (m) => console.log('  ✓ ' + m);
const fail = (m) => { errors.push(m); console.error('  ✗ ' + m); };

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const read = (f) => readFileSync(join(ROOT, f), 'utf8');

/* ---------- ① 文件齐全 ---------- */
console.log('① 文件齐全');
for (const f of FILES) existsSync(join(ROOT, f)) ? ok(f) : fail(`缺文件 ${f}`);
if (errors.length) { console.error(`\n门禁失败：${errors.length} 项`); process.exit(1); }

/* ---------- ② 花括号平衡 ---------- */
console.log('② 花括号平衡（剥离注释）');
for (const f of FILES) {
	const css = stripComments(read(f));
	const open = (css.match(/{/g) || []).length;
	const close = (css.match(/}/g) || []).length;
	open === close ? ok(`${f}（${open} 对）`) : fail(`${f} 花括号不平衡 { ${open} } ${close}`);
}

/* ---------- ③ @import 链 ---------- */
console.log('③ @import 链');
const importsOf = {};
for (const f of FILES) {
	importsOf[f] = [];
	for (const [, target] of stripComments(read(f)).matchAll(/@import\s+"([^"]+)"/g)) {
		if (/^night\//.test(target)) { ok(`${f} → ${target}（Typora 内置，跳过）`); continue; }
		if (!existsSync(join(ROOT, target))) { fail(`${f} 的 @import 目标不存在：${target}`); continue; }
		ok(`${f} → ${target}`);
		importsOf[f].push(target);
	}
}
const reaches = (f, dest, seen = new Set()) =>
	f === dest || (!seen.has(f) && (seen.add(f), importsOf[f].some((t) => reaches(t, dest, seen))));
for (const f of ['muyun-dark.css', 'muyun-wide.css', 'muyun-wide-dark.css']) {
	reaches(f, 'muyun.css') ? ok(`${f} 经 @import 可达 muyun.css`) : fail(`${f} 无法经 @import 到达 muyun.css`);
}

/* ---------- ④ 令牌完备性 ---------- */
console.log('④ 令牌完备性');

// 取 :root 块的令牌表；printOnly=true 时仅取 @media print 内的块
function rootTokens(css, printOnly = false) {
	const map = new Map();
	for (const m of css.matchAll(/:root\s*\{/g)) {
		const before = css.slice(Math.max(0, m.index - 80), m.index).trimEnd();
		const inPrint = /@media\s+print\s*\{\s*$/.test(before);
		if (inPrint !== printOnly) continue;
		let depth = 1, i = m.index + m[0].length;
		while (i < css.length && depth > 0) {
			if (css[i] === '{') depth++;
			else if (css[i] === '}') depth--;
			i++;
		}
		for (const d of css.slice(m.index + m[0].length, i - 1).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
			map.set(d[1], d[2].trim());
		}
	}
	return map;
}

const isColor = (v) => /^\s*(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(v);
// 浅色定义、深色有意继承的颜色令牌（双态同值：GFM 提示块色相）
const INHERITED_BY_DARK = new Set([
	'--muyun-alert-note', '--muyun-alert-tip', '--muyun-alert-important',
	'--muyun-alert-warning', '--muyun-alert-caution',
]);

const light = rootTokens(stripComments(read('muyun.css')), false);
const dark = rootTokens(stripComments(read('muyun-dark.css')), false);
const lightPrint = rootTokens(stripComments(read('muyun.css')), true);
const darkPrint = rootTokens(stripComments(read('muyun-dark.css')), true);

let darkCover = 0, darkMiss = 0;
for (const [tok, val] of light) {
	if (!isColor(val) || INHERITED_BY_DARK.has(tok)) continue;
	if (dark.has(tok)) darkCover++;
	else { darkMiss++; fail(`深色 :root 缺颜色令牌 ${tok}（浅色值 ${val}；若有意继承请加入 INHERITED_BY_DARK）`); }
}
if (!darkMiss) ok(`深色 :root 覆盖浅色全部颜色令牌（${darkCover}/${darkCover}）`);

let printMiss = 0;
for (const [tok, val] of lightPrint) {
	if (!isColor(val)) continue;
	if (!darkPrint.has(tok)) { printMiss++; fail(`深色打印块缺颜色令牌 ${tok}（浅色打印值 ${val}）`); }
}
if (!printMiss) ok(`深色打印块颜色令牌与浅色一致（${lightPrint.size} 项全对齐，防暗底 PDF）`);

// var() 引用可解析：有效定义 = 自身声明（任意位置）∪ 传递 @import 方的声明
const defsOf = {};
for (const f of FILES) {
	const s = new Set();
	for (const d of stripComments(read(f)).matchAll(/--[\w-]+\s*:/g)) s.add(d[0].slice(0, -1));
	defsOf[f] = s;
}
const effective = (f, seen = new Set()) => {
	if (seen.has(f)) return new Set();
	seen.add(f);
	const out = new Set(defsOf[f]);
	for (const t of importsOf[f]) for (const d of effective(t, seen)) out.add(d);
	return out;
};
let usageMiss = 0, usageCount = 0;
for (const f of FILES) {
	const eff = effective(f);
	for (const [, tok] of stripComments(read(f)).matchAll(/var\(\s*(--[\w-]+)/g)) {
		usageCount++;
		if (!eff.has(tok)) { usageMiss++; fail(`${f} 引用了未定义令牌 var(${tok})`); }
	}
}
if (!usageMiss) ok(`var() 引用全部可解析（${usageCount} 处 / 4 文件）`);

/* ---------- ⑤ 对比度门禁 ---------- */
console.log('⑤ 对比度门禁（WCAG）');

const hexLum = (hex) => {
	const n = hex.replace('#', '');
	const [r, g, b] = [0, 2, 4]
		.map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (fgHex, bgHex) => {
	const [l1, l2] = [hexLum(fgHex), hexLum(bgHex)].sort((a, b) => b - a);
	return (l1 + 0.05) / (l2 + 0.05);
};
const hexOf = (map, tok) => {
	const v = map.get(tok) || light.get(tok) || ''; // 深色缺省回落浅色值（与 CSS 继承同语义）
	const m = v.match(/#[0-9a-f]{6}/i);
	return m ? m[0] : null;
};

// [标签, 前景令牌, 背景令牌, 门档, 备注]（darkExempt: 深色侧设计例外，仅记录不断言）
const PAIRS = [
	['正文', '--text-color', '--bg-color', 9.0, ''],
	['弱文字 muted', '--muyun-text-muted', '--bg-color', 4.5, ''],
	['链接 / H3', '--muyun-link', '--bg-color', 4.5, ''],
	['加粗 / H1', '--muyun-bold', '--bg-color', 4.5, ''],
	['H2 路标条', '--muyun-h2', '--bg-color', 4.5, '深色 ≈2.5:1，双态同值的设计例外'],
	['强调色 accent', '--muyun-accent', '--bg-color', 4.5, ''],
	['正文（代码底）', '--text-color', '--muyun-bg-secondary', 9.0, ''],
];
const REPORT_ONLY = [
	['极弱 faint', '--muyun-text-faint', '--bg-color', '装饰性用途（占位/行号），不作正文'],
];

const modes = [
	['浅色 晨光暖纸', light, ''],
	['深色 墨蓝夜空', dark, ''],
];

const auditRows = [];
let passCount = 0, gateTotal = 0;
for (const [modeName, map] of modes) {
	for (const [label, fg, bg, min, note] of PAIRS) {
		const fgv = hexOf(map, fg), bgv = hexOf(map, bg);
		if (!fgv || !bgv) { fail(`${modeName} ${label}：令牌值缺失或非 hex（${fg}/${bg}）`); continue; }
		const r = ratio(fgv, bgv);
		const exempt = note.includes('设计例外') && map === dark;
		auditRows.push({ mode: modeName, label, fg: fgv, bg: bgv, r, min, exempt, note });
		if (exempt) { continue; }
		gateTotal++;
		if (r >= min - 1e-9) passCount++;
		else fail(`${modeName}「${label}」对比度 ${r.toFixed(2)}:1 低于门档 ${min}:1（${fgv} on ${bgv}）`);
	}
	for (const [label, fg, bg, note] of REPORT_ONLY) {
		const fgv = hexOf(map, fg), bgv = hexOf(map, bg);
		if (fgv && bgv) auditRows.push({ mode: modeName, label, fg: fgv, bg: bgv, r: ratio(fgv, bgv), min: null, exempt: true, note });
	}
}
if (passCount === gateTotal) ok(`对比度门禁 ${passCount}/${gateTotal} 通过（faint 与深色 H2 仅记录）`);

/* ---------- 结果 ---------- */
if (errors.length) {
	console.error(`\n门禁失败：${errors.length} 项（见上）`);
	process.exit(1);
}
console.log('\n门禁全部通过 ✓');

/* ---------- --report：对比度审计表（PALETTE.md 的数据源） ---------- */
if (process.argv.includes('--report')) {
	const round = (x) => x.toFixed(2).replace(/\.?0+$/, '');
	const f2 = (x) => x.toFixed(2);
	console.log('\n<!-- 以下由 scripts/check-theme.mjs --report 生成，粘贴进 PALETTE.md 前请勿手改 -->\n');
	console.log('## 对比度审计 Contrast Audit（WCAG 2.x，脚本实测）\n');
	console.log('门档：正文 ≥9:1（AAA 之上、贴合「≈10:1 舒适带」主张）；正文余 ≥4.5:1（AA）。faint 与深色 H2 为记录项（装饰用途 / 双态同值设计例外）。\n');
	console.log('| 模式 | 角色 | 前景 | 底色 | 实测 | 门档 | 判定 |');
	console.log('| --- | --- | --- | --- | --- | --- | --- |');
	for (const r of auditRows) {
		const verdict = r.min == null || r.exempt ? '记录' : `${f2(r.r)} ≥ ${r.min} ✓`;
		console.log(`| ${r.mode} | ${r.label}${r.note ? `（${r.note}）` : ''} | \`${r.fg}\` | \`${r.bg}\` | ${f2(r.r)}:1 | ${r.min == null ? '—' : r.exempt ? '豁免' : `${r.min}:1`} | ${verdict} |`);
	}
	const PRESETS = [
		['浅色', '柔和 Soft', '#55555F', '#F7F4ED'],
		['浅色', '扎实 Firm', '#2C2C33', '#F7F4ED'],
		['深色', '柔和 Soft', '#AFB3C2', '#16161D'],
		['深色', '扎实 Firm', '#D6D8E0', '#16161D'],
	];
	console.log('| 模式 | 对比度预设（默认关） | 前景 | 底色 | 实测 |');
	console.log('| --- | --- | --- | --- | --- |');
	for (const [mode, name, fg, bg] of PRESETS) console.log(`| ${mode} | ${name} | \`${fg}\` | \`${bg}\` | ${round(ratio(fg, bg))}:1 |`);
	const PRINT = [
		['正文', '#1F1F24', '#ffffff'],
		['链接', '#2F5AA8', '#ffffff'],
		['加粗', '#6B5200', '#ffffff'],
		['弱文字', '#5A5A64', '#ffffff'],
		['正文（代码底）', '#1F1F24', '#F5F5F0'],
	];
	console.log('| 打印/PDF 角色 | 前景 | 底色 | 实测 |');
	console.log('| --- | --- | --- | --- |');
	for (const [name, fg, bg] of PRINT) console.log(`| ${name} | \`${fg}\` | \`${bg}\` | ${round(ratio(fg, bg))}:1 |`);
}
