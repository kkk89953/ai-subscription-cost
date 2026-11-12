# 三个 awesome 列表的 PR 文案（可直接复制）

> 提交前先做三件事：仓库有真实内容、README 有截图、CLI 能跑通。
> 维护者会点进去看，看到纯导流页会直接关 PR。

---

## 1. awesome-chatgpt-zh

**仓库**：`https://github.com/awesome-chatgpt-zh/awesome-chatgpt-zh`（或同类中文 awesome 列表，先在 GitHub 搜 `awesome chatgpt zh` 找 star 最多的那个）

**PR 标题**

```
添加 AI 订阅成本计算器（ChatGPT Plus / Claude Pro / Gemini 国内真实成本）
```

**PR 正文**

```markdown
## 添加内容

- **项目**：ai-subscription-cost
- **仓库**：https://github.com/YOURNAME/ai-subscription-cost
- **一句话**：按实时汇率计算 ChatGPT Plus、Claude Pro、Gemini Advanced、Grok、Cursor Pro
  在国内的真实月成本，并对比代充价，输出汇率临界点分析。

## 为什么值得收录

1. 解决了「官方 $20，国内到底花多少」这个具体问题——把汇率、跨境手续费、开卡费、
   苹果抽成拆开算，不是只乘一个汇率。
2. **每次运行都取实时汇率**（三个公开汇率源取中位数），不是写死一个数。
3. 给出了「汇率临界点」这个可复用的分析方法：汇率低于临界值时代充更便宜，
   高于则自建卡更便宜。当前 6.67 下 Claude Pro 已经翻面。
4. 纯 CLI，无依赖，`npx ai-subscription-cost --all` 即可复现。

## 建议位置

「工具 / Tools」分类下，按字母序插入。

已按 CONTRIBUTING.md 检查格式，链接可访问，无推广性质。
```

---

## 2. awesome-ai-tools

**仓库**：`https://github.com/mahseema/awesome-ai-tools` 或 star 更多的同类

**PR 标题**

```
Add ai-subscription-cost — CLI to compare AI subscription cost in CNY (live FX rate)
```

**PR 正文**

```markdown
## What

`ai-subscription-cost` — a zero-dependency CLI that computes the real monthly cost of
ChatGPT Plus / Claude Pro / Gemini Advanced / Grok / Cursor Pro in CNY.

## Why it belongs here

Most "AI pricing" lists show the official USD price. That is not what users pay:
cross-border FX fee, virtual card issuance fee, and App Store markup add 10–40% on top.
This tool separates each component, fetches a **live USD/CNY rate** (median of three
public APIs, no key required), and prints a break-even table.

## Example

```
  ChatGPT Plus              $20         133.49          137.99       66.00   省 52.2%
  Claude Pro                $20         133.49          137.99      143.00    贵 3.6%
```

## Links

- Repo: https://github.com/YOURNAME/ai-subscription-cost
- Run: `npx ai-subscription-cost --all`

MIT licensed, no telemetry, no paid API.
```

---

## 3. awesome-chinese-llm

**仓库**：`https://github.com/HqWu-HITCS/Awesome-Chinese-LLM`（或同类）

**PR 标题**

```
工具补充：AI 订阅成本计算器（实时汇率 + 汇率临界点分析）
```

**PR 正文**

```markdown
## 补充一个实用小工具

- **仓库**：https://github.com/YOURNAME/ai-subscription-cost
- **类型**：CLI / 成本测算
- **适用场景**：国内开发者、研究者订阅海外 AI 服务前的成本核算

## 功能

- 按实时 USD/CNY 汇率折算官方定价（三源取中位数，无 API key）
- 叠加跨境货币转换费、虚拟卡开卡费摊销
- 与国内代充参考价对比，输出「省 / 贵」百分比
- 计算**汇率临界点**：解出代充与自建卡成本相等的汇率，判断汇率波动下哪边划算
- `--json` 输出，方便接自己的报表

## 说明

纯测算工具，不含任何推广链接以外的商业内容；MIT 协议；无网络请求除汇率接口外。

如果这个分类不适合收录工具类项目，请直接关闭，不用回复。
```

---

## 提交节奏与避坑

| 项 | 做法 |
|---|---|
| **频率** | 一周 3–5 个仓库，不要一天全提 |
| **顺序** | 先提 star 少、维护活跃的（合并快），用它作为「已被收录」的背书再提大仓库 |
| **被拒** | 换下一个，不要重复提同一个仓库 |
| **账号** | 用主账号，新号提 PR 容易被判 spam |
| **README 要求** | 必须能被 30 秒看懂是干什么的，首屏就要有截图和一行命令 |
| **不要做的** | 在 PR 正文里写「代充」「购买」「优惠」这类词；维护者一看就关 |

## 被合并之后

那个列表每次更新都会把你的链接一起重新渲染一遍，等于持续获得曝光。而且：

- 列表页本身在必应关键词排名靠前 → 你的链接跟着分到权重
- 有人 star 那个列表 → 你的仓库也可能被顺带 star
- 后续可以在这个 PR 里回复「已更新到 v1.1」，制造二次曝光
