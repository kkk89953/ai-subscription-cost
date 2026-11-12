# AI 订阅真实成本计算器 · ChatGPT Plus / Claude Pro / Gemini / Grok 国内价格对比

[![npm](https://img.shields.io/npm/v/ai-subscription-cost?color=blue)](https://www.npmjs.com/package/ai-subscription-cost)
[![license](https://img.shields.io/npm/l/ai-subscription-cost)](./LICENSE)
[![node](https://img.shields.io/node/v/ai-subscription-cost)](https://nodejs.org)
[![rate](https://img.shields.io/badge/USD--CNY-live-brightgreen)](https://www.tlsfox.com/pricing/)

> 一条命令算清：**ChatGPT Plus、Claude Pro、Gemini Advanced、Grok、Cursor Pro、API 额度**在国内的真实月成本。
> 按**实时汇率**折算官方美元价，加上外币卡手续费与开卡费摊销，再和代充参考价比出到底哪个划算。

价格数据每月核对，实时报价表见 **[tlsfox.com/pricing](https://www.tlsfox.com/pricing/)**。

---

## 为什么需要这个工具

ChatGPT Plus 官方标价 20 美元。但国内用户实际到手要花多少？

汇率、跨境货币转换费、虚拟卡开卡费、苹果内购抽成、代充服务费——**五个变量叠在一起，同样一个订阅的成本能差 2 倍**。而大部分人算账时只乘一个汇率，得出「¥140 左右」，然后被 ¥66 的代充价吓一跳，或者被 ¥8.8 的活动价骗进去。

这个工具把每一项拆开，给出可复核的数字，并且**每次运行都取当时的真实汇率**——因为汇率从 7.2 跌到 6.67，结论会直接反转。

---

## 安装

```bash
npm i -g ai-subscription-cost
```

或者不安装，直接跑：

```bash
npx ai-subscription-cost --all
```

要求 Node.js ≥ 18（用到内置 fetch）。

---

## 用法

```bash
ai-cost chatgpt-plus          # 单套餐成本拆解
ai-cost --all                 # 全部套餐对比表
ai-cost --rate                # 当前汇率与数据源
ai-cost --all --json          # 机器可读，方便接自己的表格
ai-cost --all --months 12     # 开卡费按 12 期摊销
ai-cost --all --fx 7.2        # 手动指定汇率（离线复算）
```

### 单套餐输出

```
  ChatGPT Plus  ·  OpenAI
  ──────────────────────────────────────────────
  官方定价        $20/月
  汇率            6.6743  (median of 3 source(s))
  官方折算        ¥133.49/月
  外币卡手续费    +¥2.00  (1.5%)
  开卡费摊销      +¥2.50  (¥30 ÷ 12 期)
  ──────────────────────────────────────────────
  自建卡月成本    ¥137.99
  代充参考价      ¥66.00
  省              ¥71.99/月  (52.2%)
  年度差额        ¥863.86/年
```

### 全套餐对比

```
  订阅                  官方USD    官方¥(实时)    自建卡月成本      代充价     代充省
  ──────────────────  ─────────  ─────────────  ──────────────  ──────────  ─────────
  ChatGPT Plus              $20         133.49          137.99       66.00   省 52.2%
  ChatGPT Pro              $200        1334.86         1357.38      645.00   省 52.5%
  Claude Pro                $20         133.49          137.99      143.00    贵 3.6%
  Claude Max               $100         667.43          679.94      863.00   贵 26.9%
  Gemini Advanced        $19.99         133.42          137.92        8.80   省 93.6%
  Grok 会员                 $30         200.23          205.73      253.00   贵 23.0%
  Cursor Pro                $20         133.49          137.99      121.00   省 12.3%
  API 额度                 按量              —               —       50.00          —
```

> 以上为 2026-11-12 实跑结果，USD/CNY = 6.6743。你自己跑会拿到当天的数字。

---

## 汇率临界点：代充在什么汇率下失去优势

这是最容易被忽略的一张表。**代充价是人民币固定、官方价是美元浮动**，所以汇率一变，划算的一方就换人。

令「自建卡月成本 = 代充价」，解出临界汇率：

```
R* = (代充价 − 开卡费/期数) / (美元价 × (1 + 手续费率))
```

| 套餐 | 代充参考价 | 临界汇率 | 当前 6.6743 下 |
|---|---|---|---|
| ChatGPT Plus | ¥66 | **3.13** | 代充省 52.2% |
| ChatGPT Pro | ¥645 | **3.17** | 代充省 52.5% |
| Cursor Pro | ¥121 | **5.84** | 代充省 12.3% |
| Claude Pro | ¥143 | **6.92** | 代充**贵** 3.6% |
| Grok 会员 | ¥253 | **8.23** | 代充**贵** 23.0% |
| Claude Max | ¥863 | **8.48** | 代充**贵** 26.9% |

**读法**：汇率低于临界值时，代充更便宜；高于临界值，自己办卡更便宜。

当前汇率 6.67 意味着：
- **ChatGPT Plus / Pro 的代充优势极大**（临界值 3.1，怎么跌都划算）
- **Claude Pro 已经翻面**——代充 ¥143 比自建卡 ¥137.99 还贵。汇率再涨 3.7% 就会更明显
- **Grok、Claude Max 的代充价本身就高于自建卡成本**，买它们不是为了省钱，是为了省「办卡、充值失败、账号风控」这些麻烦

### 汇率敏感性（代充相对自建卡）

| 套餐 | 6.0 | 6.3 | 6.5 | 6.67 | 7.0 | 7.2 |
|---|---|---|---|---|---|---|
| ChatGPT Plus | 省47% | 省49% | 省51% | 省52% | 省54% | 省56% |
| ChatGPT Pro | 省47% | 省50% | 省51% | 省52% | 省55% | 省56% |
| Claude Pro | 贵15% | 贵10% | 贵6% | 贵4% | 省1% | 省4% |
| Claude Max | 贵41% | 贵34% | 贵30% | 贵27% | 贵21% | 贵18% |
| Grok 会员 | 贵37% | 贵30% | 贵26% | 贵23% | 贵17% | 贵14% |
| Cursor Pro | 省3% | 省7% | 省10% | 省12% | 省16% | 省19% |

> 这张表也解释了为什么很多站点的「官方参考价」看着偏高：它们按 7.2 折算。按 7.2 算，Claude Pro 代充是「省 4%」；按真实 6.67 算，是「贵 3.6%」。**汇率口径不同，结论完全相反。**

---

## 计算口径

| 项 | 取值 | 可覆盖 |
|---|---|---|
| 官方美元价 | 各厂商官网公示月付价 | — |
| 汇率 | 三个公开汇率源并行取中位数，缓存 1 小时 | `--fx` |
| 跨境货币转换费 | 1.5%（主流虚拟卡的常见档） | `--fx-fee` |
| 开卡费 | ¥30 一次性 | `--issue` |
| 摊销期数 | 12 期 | `--months` |

**代充参考价的含义**：人民币固定报价，随汇率浮动，仅作对比基准。实际成交价以发卡网当日页面为准。

---

## 汇率数据源

三源并行，取中位数，任一源失败不影响结果：

- `open.er-api.com`
- `api.frankfurter.app`（欧洲央行口径）
- `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`

全部失败时回落到本地缓存（`~/.ai-cost/rate.json`），再失败用内置兜底值并在输出里标注 `⚠️`。

不依赖任何 API key。

---

## 常见问题

**Q：代充价这么低，是不是共享账号？**
不是。代充是走官方订阅通道把会员开在**你自己账号**上，账号始终归你；共享账号是一个号卖给多人，随时可能被改密。判断标准见 [AI 代充安全吗：6 个判断标准](https://www.tlsfox.com/guides/ai-daichong-anquan/)。

**Q：Gemini Advanced 显示 ¥8.8，比官方便宜 93%，可信吗？**
不可信，那是活动/期次价，不是稳定月付价。工具里已标记为 `promo`，计算时按活动价展示但会加提示。真实稳定价请查 [实时价格表](https://www.tlsfox.com/pricing/)。

**Q：为什么 Claude Pro 代充比我自己买还贵？**
因为 Anthropic 的订阅渠道成本高（需要海外手机号 + 稳定 IP），代充服务费压不下来。汇率 6.67 时它的临界点是 6.92，还没到。想省钱就自己办卡，想省事就代充。

**Q：年付会更便宜吗？**
看商品。年付能摊薄开卡费，但一次性预付会放大商家履约风险。建议先用月付验证稳定性。

**Q：能不能算 API 额度？**
API 按 token 计费，没有固定月价，工具只显示起充金额。具体单价见 [OpenAI API 价格](https://www.tlsfox.com/guides/openai-api-jiage/) 和 [Claude API 价格](https://www.tlsfox.com/guides/claude-api-jiage/)。

---

## 相关资源

- [AI 代充实时价格表（每月更新）](https://www.tlsfox.com/pricing/)
- [ChatGPT Plus 国内充值完整教程](https://www.tlsfox.com/guides/chatgpt-plus-guochong/)
- [Claude Pro 订阅失败的 5 个原因](https://www.tlsfox.com/guides/claude-pro-guochong/)
- [虚拟信用卡 vs 代充：成本、成功率、风险三维对比](https://www.tlsfox.com/guides/xunika-vs-daichong/)
- [ChatGPT Plus vs Claude Pro 深度对比](https://www.tlsfox.com/compare/chatgpt-plus-vs-claude-pro/)

---

## 贡献

汇率源失效、官方调价、计算口径有误——都欢迎开 issue 或 PR。

新增套餐只需要在 `lib/catalog.js` 里加一条：

```js
{
  id: 'your-plan',
  name: '套餐名',
  vendor: '厂商',
  usd: 20,        // 官方月付美元价；按量计费填 null
  cny: 120,       // 代充参考起售价
  unit: '月',
  promo: false,   // 活动价标 true
  url: '商品页',
  guide: '教程页',
  note: '一句话说明',
}
```

## License

MIT © [AI代充优选](https://www.tlsfox.com)
