# AI Subscription Cost Calculator — ChatGPT Plus / Claude Pro / Gemini / Grok in China

[![npm](https://img.shields.io/npm/v/ai-subscription-cost?color=blue)](https://www.npmjs.com/package/ai-subscription-cost)
[![license](https://img.shields.io/npm/l/ai-subscription-cost)](./LICENSE)

> Work out what an AI subscription **actually costs** in CNY: official USD price × live exchange rate
> + foreign-card FX fee + card issuance fee, then compare against the domestic top-up price.

Live price table: **[tlsfox.com/pricing](https://www.tlsfox.com/pricing/)**

---

## Why

ChatGPT Plus is $20/month. But the real cost in China depends on five variables stacked on top of each other:

1. USD/CNY exchange rate (moved from 7.2 to 6.67 in 2026)
2. Cross-border FX fee (~1.5% on most virtual cards)
3. One-off card issuance fee (amortised over months)
4. App Store in-app markup (up to 30%)
5. Domestic top-up service fee

Multiply the rate alone and you get the wrong answer. This tool separates every component, fetches the
**live rate on every run**, and prints a break-even analysis.

---

## Install

```bash
npm i -g ai-subscription-cost
# or
npx ai-subscription-cost --all
```

Node.js ≥ 18 (uses built-in `fetch`).

## Usage

```bash
ai-cost chatgpt-plus          # single plan breakdown
ai-cost --all                 # full comparison table
ai-cost --rate                # current rate + sources
ai-cost --all --json          # machine readable
ai-cost --all --fx 7.2        # pin a rate for offline recalculation
```

### Sample output

```
  ChatGPT Plus  ·  OpenAI
  ──────────────────────────────────────────────
  Official price     $20/mo
  FX rate            6.6743  (median of 3 sources)
  Converted          ¥133.49/mo
  FX fee             +¥2.00   (1.5%)
  Card fee amortised +¥2.50   (¥30 ÷ 12)
  ──────────────────────────────────────────────
  Self-managed cost  ¥137.99/mo
  Top-up price       ¥66.00
  Saving             ¥71.99/mo  (52.2%)
```

### Full table (2026-11-12, USD/CNY = 6.6743)

| Plan | Official USD | Official CNY | Self-managed/mo | Top-up | Verdict |
|---|---|---|---|---|---|
| ChatGPT Plus | $20 | 133.49 | 137.99 | 66.00 | save 52.2% |
| ChatGPT Pro | $200 | 1334.86 | 1357.38 | 645.00 | save 52.5% |
| Claude Pro | $20 | 133.49 | 137.99 | 143.00 | **costs 3.6% more** |
| Claude Max | $100 | 667.43 | 679.94 | 863.00 | **costs 26.9% more** |
| Gemini Advanced | $19.99 | 133.42 | 137.92 | 8.80 (promo) | save 93.6% |
| Grok | $30 | 200.23 | 205.73 | 253.00 | **costs 23.0% more** |
| Cursor Pro | $20 | 133.49 | 137.99 | 121.00 | save 12.3% |

---

## Break-even exchange rate

Top-up prices are fixed in CNY while official prices float in USD — so the cheaper option flips with the rate.

```
R* = (topUpPrice − cardFee/months) / (usdPrice × (1 + fxFeeRate))
```

| Plan | Top-up | Break-even rate | At 6.6743 |
|---|---|---|---|
| ChatGPT Plus | ¥66 | 3.13 | top-up saves 52.2% |
| ChatGPT Pro | ¥645 | 3.17 | top-up saves 52.5% |
| Cursor Pro | ¥121 | 5.84 | top-up saves 12.3% |
| Claude Pro | ¥143 | 6.92 | top-up **costs** 3.6% |
| Grok | ¥253 | 8.23 | top-up **costs** 23.0% |
| Claude Max | ¥863 | 8.48 | top-up **costs** 26.9% |

Below the break-even rate the top-up is cheaper; above it, paying with your own card wins.

---

## Assumptions

| Item | Default | Override |
|---|---|---|
| Cross-border FX fee | 1.5% | `--fx-fee` |
| Card issuance fee | ¥30 one-off | `--issue` |
| Amortisation period | 12 months | `--months` |
| Rate source | median of 3 public APIs, cached 1h | `--fx`, `--fresh` |

Rate sources: `open.er-api.com`, `api.frankfurter.app`, `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`.
No API key required. Falls back to `~/.ai-cost/rate.json`, then to a built-in constant flagged with `⚠️`.

---

## FAQ

**Is a cheap top-up a shared account?**
No — a top-up activates the subscription on *your own* account. Shared accounts are sold to multiple people
and can be taken back at any time. See [how to tell them apart](https://www.tlsfox.com/guides/ai-daichong-anquan/).

**Why is Claude Pro's top-up more expensive than doing it myself?**
Anthropic's signup requires a foreign phone number and a stable IP, which pushes the service cost up.
At 6.67 the break-even is 6.92 — not there yet.

**Does the tool call any paid API?**
No. Three free public FX endpoints, no keys, no telemetry.

---

## Related

- [Live AI subscription price table](https://www.tlsfox.com/pricing/)
- [How to pay for ChatGPT Plus from China](https://www.tlsfox.com/guides/chatgpt-plus-guochong/)
- [Virtual card vs top-up service compared](https://www.tlsfox.com/guides/xunika-vs-daichong/)

## License

MIT © [tlsfox.com](https://www.tlsfox.com)
