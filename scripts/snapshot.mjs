#!/usr/bin/env node
/**
 * 生成价格快照：data/latest.json + data/prices.md
 * 由 GitHub Actions 每天跑一次，产出可被搜索引擎收录的新内容，同时保持仓库活跃。
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

const { stdout } = await run(process.execPath, ['bin/cli.js', '--all', '--json'], {
  maxBuffer: 4 * 1024 * 1024,
})
const data = JSON.parse(stdout)

await mkdir('data', { recursive: true })

// 1. 机器可读快照
await writeFile('data/latest.json', JSON.stringify(data, null, 2) + '\n', 'utf8')

// 2. 人读快照（会被 GitHub 和搜索引擎索引）
const date = data.fx.fetchedAt.slice(0, 10)
const rows = data.plans
  .map((p) => {
    const official = p.officialCny == null ? '按量' : p.officialCny.toFixed(2)
    const card = p.cardMonthly == null ? '—' : p.cardMonthly.toFixed(2)
    const verdict =
      p.savingPct == null
        ? '—'
        : p.savingPct >= 0
          ? `代充省 ${p.savingPct.toFixed(1)}%`
          : `代充贵 ${Math.abs(p.savingPct).toFixed(1)}%`
    return `| ${p.name} | ${p.officialUsd == null ? '按量' : '$' + p.officialUsd} | ${official} | ${card} | ${p.rechargeCny.toFixed(2)} | ${verdict} |`
  })
  .join('\n')

const md = `# AI 订阅成本快照 · ${date}

> 自动生成，每天更新。汇率 USD/CNY = **${data.fx.rate}**（${data.fx.source}）
> 假设：外币卡手续费 ${(data.assumptions.fxFeeRate * 100).toFixed(1)}%，开卡费 ¥${data.assumptions.issueFeeCny} 按 ${data.assumptions.amortizeMonths} 期摊销
> 实时报价表：https://www.tlsfox.com/pricing/

| 订阅 | 官方USD | 官方¥(实时) | 自建卡月成本 | 代充价 | 结论 |
|---|---|---|---|---|---|
${rows}

## 历史快照

每日结果归档在 [\`data/latest.json\`](./latest.json)，历史记录见 git 提交历史。

## 复现

\`\`\`bash
npx ai-subscription-cost --all
\`\`\`
`

await writeFile('data/prices.md', md, 'utf8')
console.log(`快照已生成：${date}  USD/CNY ${data.fx.rate}`)
