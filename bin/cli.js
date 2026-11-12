#!/usr/bin/env node
/**
 * ai-cost — AI 订阅真实成本计算器
 *
 *   ai-cost chatgpt-plus            单套餐成本拆解
 *   ai-cost --all                   全部套餐对比表
 *   ai-cost --rate                  只看当前汇率
 *   ai-cost --all --json            机器可读输出
 *   ai-cost --all --months 12       年付摊薄视角
 *   ai-cost --all --fx 7.2          指定汇率（离线复算用）
 */

import { getUsdCnyRate } from '../lib/rates.js'
import { CATALOG, CARD_DEFAULTS, findPlan } from '../lib/catalog.js'

const VERSION = '1.0.0'
const SITE = 'https://www.tlsfox.com/pricing/'

// ---------- 参数解析 ----------
const argv = process.argv.slice(2)
const flag = (n) => argv.includes(n)
const opt = (n, d) => {
  const i = argv.indexOf(n)
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d
}

if (flag('--help') || flag('-h')) {
  console.log(`
ai-cost v${VERSION} — AI 订阅真实成本计算器（按实时汇率）

用法
  ai-cost <套餐>              例如：ai-cost chatgpt-plus
  ai-cost --all               全部套餐对比
  ai-cost --rate              当前 USD/CNY 汇率与数据源
  ai-cost --all --json        输出 JSON

选项
  --months <n>   按期数摊薄开卡费（默认 ${CARD_DEFAULTS.amortizeMonths}）
  --fx <rate>    手动指定汇率，跳过联网
  --fx-fee <r>   外币卡货币转换费率（默认 ${CARD_DEFAULTS.fxFeeRate}）
  --issue <cny>  开卡费（默认 ¥${CARD_DEFAULTS.issueFeeCny}）
  --fresh        忽略 1 小时缓存，强制重新取汇率
  --json         机器可读输出

套餐
${CATALOG.map((p) => `  ${p.id.padEnd(18)} ${p.name}（官方 $${p.usd ?? '按量'}${p.usd ? '/月' : ''}）`).join('\n')}

价格数据：${SITE}
`)
  process.exit(0)
}

if (flag('--version') || flag('-v')) {
  console.log(VERSION)
  process.exit(0)
}

const months = Number(opt('--months', CARD_DEFAULTS.amortizeMonths)) || CARD_DEFAULTS.amortizeMonths
const fxFee = Number(opt('--fx-fee', CARD_DEFAULTS.fxFeeRate))
const issueFee = Number(opt('--issue', CARD_DEFAULTS.issueFeeCny))
const manualFx = opt('--fx', null)

// ---------- 显示宽度（中文字符占 2 列） ----------
const width = (s) => [...String(s)].reduce((n, ch) => n + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch) ? 2 : 1), 0)
const pad = (s, w) => String(s) + ' '.repeat(Math.max(0, w - width(s)))
const padL = (s, w) => ' '.repeat(Math.max(0, w - width(s))) + String(s)
const money = (n) => '¥' + Number(n).toFixed(2)

function compute(plan, rate) {
  if (plan.usd == null) {
    return {
      id: plan.id,
      name: plan.name,
      officialUsd: null,
      officialCny: null,
      cardMonthly: null,
      rechargeCny: plan.cny,
      savingPct: null,
      savingCny: null,
      note: plan.note,
    }
  }
  const officialCny = plan.usd * rate
  const cardMonthly = officialCny * (1 + fxFee) + issueFee / months
  const savingCny = cardMonthly - plan.cny
  const savingPct = (savingCny / cardMonthly) * 100
  return {
    id: plan.id,
    name: plan.name,
    officialUsd: plan.usd,
    officialCny,
    cardMonthly,
    rechargeCny: plan.cny,
    savingPct,
    savingCny,
    promo: !!plan.promo,
    note: plan.note,
  }
}

// ---------- 主流程 ----------
const fx = manualFx
  ? { rate: Number(manualFx), source: 'manual --fx', fetchedAt: new Date().toISOString(), samples: [], stale: false }
  : await getUsdCnyRate({ fresh: flag('--fresh') })

const rows = CATALOG.map((p) => compute(p, fx.rate))
const json = flag('--json')

if (flag('--rate')) {
  if (json) {
    console.log(JSON.stringify({ rate: fx.rate, source: fx.source, fetchedAt: fx.fetchedAt, samples: fx.samples, stale: fx.stale }, null, 2))
  } else {
    console.log(`USD/CNY  ${fx.rate}`)
    console.log(`来源     ${fx.source}`)
    console.log(`取价时间 ${fx.fetchedAt}`)
    if (fx.samples.length) console.log(`各源     ${fx.samples.map((s) => `${s.name}=${s.rate}`).join('  ')}`)
    if (fx.stale) console.log('⚠️  实时取价失败，使用的是缓存或内置兜底值')
  }
  process.exit(0)
}

const target = argv.find((a) => !a.startsWith('-') && !/^\d/.test(a))

if (!flag('--all') && !target) {
  console.error('缺少参数。试试：ai-cost --all  或  ai-cost --help')
  process.exit(1)
}

if (target) {
  const plan = findPlan(target)
  if (!plan) {
    console.error(`没找到套餐「${target}」。可用：${CATALOG.map((p) => p.id).join(', ')}`)
    process.exit(1)
  }
  const r = compute(plan, fx.rate)

  if (json) {
    console.log(JSON.stringify({ ...r, fx: { rate: fx.rate, source: fx.source, fetchedAt: fx.fetchedAt } }, null, 2))
    process.exit(0)
  }

  console.log('')
  console.log(`  ${plan.name}  ·  ${plan.vendor}`)
  console.log(`  ${'─'.repeat(46)}`)
  if (r.officialUsd == null) {
    console.log(`  计费方式        按量计费`)
    console.log(`  代充起充        ${money(r.rechargeCny)}`)
    console.log(`  说明            ${plan.note}`)
  } else {
    console.log(`  官方定价        $${r.officialUsd}/月`)
    console.log(`  汇率            ${fx.rate}  (${fx.source})`)
    console.log(`  官方折算        ${money(r.officialCny)}/月`)
    console.log(`  外币卡手续费    +${money(r.officialCny * fxFee)}  (${(fxFee * 100).toFixed(1)}%)`)
    console.log(`  开卡费摊销      +${money(issueFee / months)}  (¥${issueFee} ÷ ${months} 期)`)
    console.log(`  ${'─'.repeat(46)}`)
    console.log(`  自建卡月成本    ${money(r.cardMonthly)}`)
    console.log(`  代充参考价      ${money(r.rechargeCny)}${plan.promo ? '  (活动起售价)' : ''}`)
    const sign = r.savingCny >= 0 ? '省' : '贵'
    console.log(`  ${sign}              ${money(Math.abs(r.savingCny))}/月  (${Math.abs(r.savingPct).toFixed(1)}%)`)
    console.log(`  年度差额        ${money(Math.abs(r.savingCny) * 12)}/年`)
    console.log('')
    console.log(`  说明            ${plan.note}`)
  }
  console.log(`  商品页          ${plan.url}`)
  console.log(`  教程            ${plan.guide}`)
  console.log(`  实时价格表      ${SITE}`)
  console.log('')
  process.exit(0)
}

// ---------- --all ----------
if (json) {
  console.log(
    JSON.stringify(
      {
        fx: { rate: fx.rate, source: fx.source, fetchedAt: fx.fetchedAt, stale: fx.stale },
        assumptions: { fxFeeRate: fxFee, issueFeeCny: issueFee, amortizeMonths: months },
        plans: rows,
      },
      null,
      2,
    ),
  )
  process.exit(0)
}

const cols = [
  { k: 'name', t: '订阅', w: 18 },
  { k: 'officialUsd', t: '官方USD', w: 9, align: 'r', fmt: (v) => (v == null ? '按量' : `$${v}`) },
  { k: 'officialCny', t: '官方¥(实时)', w: 13, align: 'r', fmt: (v) => (v == null ? '—' : v.toFixed(2)) },
  { k: 'cardMonthly', t: '自建卡月成本', w: 14, align: 'r', fmt: (v) => (v == null ? '—' : v.toFixed(2)) },
  { k: 'rechargeCny', t: '代充价', w: 10, align: 'r', fmt: (v) => v.toFixed(2) },
  { k: 'savingPct', t: '代充省', w: 9, align: 'r', fmt: (v) => (v == null ? '—' : `${v >= 0 ? '' : '+'}${(v * -1).toFixed(1)}%`.replace('-', '')) },
]

const line = cols.map((c) => '─'.repeat(c.w)).join('  ')
console.log('')
console.log(`  AI 订阅真实成本对比  ·  USD/CNY ${fx.rate}  ·  ${fx.fetchedAt.slice(0, 10)}`)
console.log(`  假设：外币卡手续费 ${(fxFee * 100).toFixed(1)}%，开卡费 ¥${issueFee} 按 ${months} 期摊销`)
console.log('')
console.log('  ' + cols.map((c) => (c.align === 'r' ? padL(c.t, c.w) : pad(c.t, c.w))).join('  '))
console.log('  ' + line)

for (const r of rows) {
  const cells = cols.map((c) => {
    const raw = c.fmt ? c.fmt(r[c.k]) : r[c.k]
    const text = c.k === 'savingPct' && r[c.k] != null ? (r[c.k] >= 0 ? `省 ${r[c.k].toFixed(1)}%` : `贵 ${Math.abs(r[c.k]).toFixed(1)}%`) : raw
    return c.align === 'r' ? padL(text, c.w) : pad(text, c.w)
  })
  console.log('  ' + cells.join('  '))
}

console.log('')
console.log(`  「代充价」为参考起售价，随汇率浮动；实时报价见 ${SITE}`)
console.log(`  活动价标记：${rows.filter((r) => r.promo).map((r) => r.name).join('、') || '无'}`)
console.log('')
