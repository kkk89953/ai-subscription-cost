# 发布清单（照着做，约 40 分钟）

> 这个目录已经是一个完整可发布的项目，CLI 实测可跑通，价格取自 tlsfox.com/pricing（2026-11-12）。

---

## 第 0 步：先决定一件事

`lib/catalog.js` 里的 `gemini-advanced.cny = 8.8`，来自你站上的价格表，但它是**活动起售价**，不是稳定月付价（官方 $19.99，¥8.8 等于省 93%）。

已在代码里标了 `promo: true`，README 里也写明了「活动价，非稳定月付价」。但对外发布前建议你确认一次：

- 如果 ¥8.8 是「首月 / 限时」→ 保持现状，代码已正确标注
- 如果是填错了（比如本应是 ¥88）→ 改 `lib/catalog.js` 里的 `cny`，同时改 README 表格那一行

**这是唯一需要你拍板的数据。** 其它七个价格都与价格表一致。

---

## 第 1 步：建仓库（5 分钟）

```bash
cd gh-repo/ai-subscription-cost
git init -b main
git add .
git commit -m "feat: AI subscription cost calculator with live FX rate"
```

GitHub 上新建仓库，名字必须是：

```
ai-subscription-cost
```

**Description（这一栏会变成页面 title，前 60 字符最关键）：**

```
AI subscription cost calculator — ChatGPT Plus / Claude Pro / Gemini / Grok / Cursor 国内真实成本（实时汇率）
```

**Topics（20 个，逐个粘）：**

```
chatgpt-plus  claude-pro  gemini-advanced  grok  cursor-pro
ai-subscription  subscription-cost  cost-calculator  price-comparison
usd-cny  exchange-rate  alipay  china  openai  anthropic
cli  pricing  ai-tools  llm  awesome-list
```

然后：

```bash
git remote add origin https://github.com/YOURNAME/ai-subscription-cost.git
git push -u origin main
```

**发布后立刻做**：进 Settings → 把 **Discussions 打开**（默认关闭），这样后面能发问答页。

---

## 第 2 步：发 npm（10 分钟，拿第二个高权重页面）

```bash
npm login          # 一次性
npm publish
```

发布成功的判据：

```bash
npm view ai-subscription-cost
# 能看到 homepage: https://www.tlsfox.com/pricing/
```

npmjs.com 的包页会自动带上 `homepage` 和 `repository` 两个链接，这个页面 DR 很高，而且长期稳定。

**注意**：包名 `ai-subscription-cost` 如果已被占用，改 `ai-cost-cn` 或加前缀 `@yourname/ai-subscription-cost`（scoped 包也能发，但权重略低）。

---

## 第 3 步：补截图（10 分钟）

按 `docs/screenshots.md` 做 3 张图，放 `docs/`，然后 commit：

```bash
git add docs/*.png && git commit -m "docs: add CLI screenshots" && git push
```

README 里已经有引用位置，图放进去就生效。

---

## 第 4 步：提 PR（每周 3 个）

`awesome-pr/PR-文案.md` 里三份文案，直接复制。把里面的 `YOURNAME` 换成你的 GitHub 用户名。

---

## 第 5 步：GitHub Pages + 自己的子域（进阶，拿 IndexNow）

这是整套打法里唯一能「立刻被必应收录」的一环：

```bash
# 1. 建一个 gh-pages 分支，放一个静态落地页
git checkout -b gh-pages
# 放 index.html（把 README 的表格做成网页版）
git push origin gh-pages
```

```
2. 仓库 Settings → Pages → Source: gh-pages
3. Custom domain 填：tools.tlsfox.com
4. 你的 DNS（阿里云）加一条 CNAME：
     主机记录  tools
     记录类型  CNAME
     记录值    YOURNAME.github.io
5. 等 GitHub 签发证书（约 10 分钟），勾上 Enforce HTTPS
```

**为什么这一步值钱**：`tools.tlsfox.com` 是你自己的域名，所以可以用 IndexNow 推送——改完页面立刻通知必应，分钟级收录。GitHub 仓库页本身推不了。

推一次：

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://www.bing.com/indexnow?url=https://tools.tlsfox.com/&key=YOUR_KEY"
```

---

## 第 6 步：验收（发布后 1–7 天）

```bash
# 1. 必应是否收录了仓库页
#    在 bing.com 搜：site:github.com ai subscription cost

# 2. GitHub 站内搜索
#    https://github.com/search?q=ai+subscription+cost&type=repositories
#    看你的仓库在第几页

# 3. npm 包页是否可访问
curl -sI https://www.npmjs.com/package/ai-subscription-cost | head -1

# 4. Pages 子域是否通
curl -sI https://tools.tlsfox.com/ | head -1

# 5. CLI 在干净环境能不能跑（模拟别人第一次用）
npx ai-subscription-cost --all
```

---

## 顺带：跑这套东西时发现的你站上的三个问题

做工具时把价格抓下来核对，顺手发现三处会影响必应排名的：

### 1. 官方参考价按 7.2 折算，实际汇率 6.67（差 8%）

你价格表的脚注写「按 7.2 汇率折算」，但 2026-11-12 实际是 6.6743。这导致：

- ChatGPT Plus 官方参考价写 ¥148，实际应为 ¥133.49
- 整个「相对官方」的省百分比都偏大

**影响**：用户拿计算器一算发现对不上，信任受损；必应也会交叉验证价格数据。
**修法**：把脚注改成「按当日实时汇率折算」，或直接改成按 6.7 折算。

### 2. 价格页内部有两套价格

| 位置 | ChatGPT Plus | Gemini Advanced |
|---|---|---|
| 表格 + JSON-LD | ¥66 | ¥8.8 |
| meta 描述 + 组合建议 | ¥118 | ¥98 |

同一页出现两套数字，必应会取较低值展示，用户点进来看到另一个数就是欺骗性点击。
**修法**：选定一套，全站统一（表格、meta、组合建议、产品页、JSON-LD 五处）。

### 3. Organization 结构化数据里是占位符

```json
"email": "support@ai-daichong.example.com"
"sameAs": ["https://t.me/your_channel"]
```

`.example.com` 是保留域名，`your_channel` 是模板残留。必应读实体信号时会把这两条当成「这个组织不存在」。
**修法**：换成 `support@tlsfox.com` 和真实的 Telegram 频道地址；没有就整段删掉 `sameAs`。

---

## 发布后的预期

| 时间 | 预期 |
|---|---|
| D1 | 仓库上线，npm 包页可访问 |
| D1–D7 | 必应收录 `github.com/YOURNAME/ai-subscription-cost` |
| D7–D14 | GitHub 站内搜 `ai subscription cost` 进前 5 页 |
| D14–D28 | 第一个 awesome PR 被合并 |
| D28–D56 | 必应搜 `AI 订阅 价格对比` / `ChatGPT Plus 多少钱` 出现该仓库 |
| 持续 | Actions 每天生成 `data/prices.md` 快照，365 次/年提交，仓库活跃度信号不断 |

---

## 不要做的事

- 不要改仓库名去堆关键词（`chatgpt-plus-claude-gemini-ai-subscription-cheap-calculator`）→ 判堆砌，搜索排名归零
- 不要买 star → GitHub 有异常检测，掉 star 且降权
- 不要在 PR 正文里写「代充」「优惠」「下单」→ 维护者直接关
- 不要一天提 5 个 PR → 新账号限流
- 不要 fork 别人的仓库改 README 塞链接 → fork 页面权重极低，白做
