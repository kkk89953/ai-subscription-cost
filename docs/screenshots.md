# 截图方案（README 里放 2–3 张，必应图片搜索会单独收录）

README 里有图 vs 没图，Star 转化率差一倍以上，而且 GitHub 的图片会被必应图片搜索抓走，等于多一条流量入口。

## 要哪三张

| 文件 | 内容 | 用途 |
|---|---|---|
| `docs/screenshot-cli.png` | 终端跑 `ai-cost --all` 的彩色输出 | README 首屏 |
| `docs/screenshot-table.png` | 汇率敏感性表（6.0 → 7.2 六列） | 正文中段 |
| `docs/screenshot-breakeven.png` | 临界汇率散点图 | 正文后段 |

## 怎么生成

**1. 终端截图**

Windows Terminal / iTerm 里跑：

```bash
ai-cost --all
```

用 [carbon.now.sh](https://carbon.now.sh) 或 Windows 的 `Win+Shift+S` 截图。carbon 的好处是背景干净、可导出 PNG，尺寸建议 1200×800。

**2. 表格图**

直接用 Excel/飞书表格做，套深色主题，导出 PNG 1200×600。

**3. 临界汇率散点图**

横轴汇率 5.5–8.5，纵轴各套餐，画一条「代充 / 自建卡」分界线。用 Excel 散点图或 Python matplotlib 都行。

## 放进去

```
ai-subscription-cost/
└── docs/
    ├── screenshot-cli.png
    ├── screenshot-table.png
    └── screenshot-breakeven.png
```

README 里引用：

```markdown
![ai-cost CLI 输出](docs/screenshot-cli.png)
```

## 图片 SEO 要点

GitHub 会给图片生成 CDN URL（`user-images.githubusercontent.com`），必应图片搜索能抓到。为了提高命中率：

- 文件名用英文关键词：`ai-subscription-cost-cli.png`，不要 `1.png`
- 图里的文字要清晰可读（必应会 OCR 图片文字）
- 截图里的关键数字（`¥66`、`¥137.99`、`52.2%`）越大越好
