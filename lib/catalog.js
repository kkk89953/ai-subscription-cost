/**
 * 订阅目录
 *
 * usd  = 官方美元定价（月付，官方公示价）
 * cny  = 国内代充参考起售价（人民币，来自 tlsfox.com/pricing 价格表，随汇率浮动）
 * promo= true 表示该价为期次/活动价，不是稳定月付价，展示时需带提示
 *
 * 价格核对时间：2026-11-12
 * 数据来源：https://www.tlsfox.com/pricing/
 */

export const CATALOG = [
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    nameEn: 'ChatGPT Plus',
    vendor: 'OpenAI',
    usd: 20,
    cny: 66,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/chatgpt-plus/',
    guide: 'https://www.tlsfox.com/guides/chatgpt-plus-guochong/',
    note: '生态最全：Agent、语音、Deep Research 都在一个订阅里',
  },
  {
    id: 'chatgpt-pro',
    name: 'ChatGPT Pro',
    nameEn: 'ChatGPT Pro',
    vendor: 'OpenAI',
    usd: 200,
    cny: 645,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/chatgpt-pro/',
    guide: 'https://www.tlsfox.com/compare/chatgpt-plus-vs-claude-pro/',
    note: '顶配套餐，适合每天高强度跑推理、写代码、做研究',
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    nameEn: 'Claude Pro',
    vendor: 'Anthropic',
    usd: 20,
    cny: 143,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/claude-pro/',
    guide: 'https://www.tlsfox.com/guides/claude-pro-guochong/',
    note: '200K 上下文，长文档与代码场景首选',
  },
  {
    id: 'claude-max',
    name: 'Claude Max',
    nameEn: 'Claude Max',
    vendor: 'Anthropic',
    usd: 100,
    cny: 863,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/claude-max/',
    guide: 'https://www.tlsfox.com/guides/claude-code-jiaocheng/',
    note: '官方分 5x（$100）与 20x（$200）两档，此处按 5x 计',
  },
  {
    id: 'gemini-advanced',
    name: 'Gemini Advanced',
    nameEn: 'Gemini Advanced (Google AI Pro)',
    vendor: 'Google',
    usd: 19.99,
    cny: 8.8,
    unit: '月',
    promo: true,
    url: 'https://www.tlsfox.com/products/gemini-advanced/',
    guide: 'https://www.tlsfox.com/guides/gemini-advanced-guochong/',
    note: '含 2TB Google One 空间与 NotebookLM Plus；¥8.8 为活动起售价，非稳定月付价',
  },
  {
    id: 'grok',
    name: 'Grok 会员',
    nameEn: 'SuperGrok / X Premium+',
    vendor: 'xAI',
    usd: 30,
    cny: 253,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/grok-premium/',
    guide: 'https://www.tlsfox.com/guides/grok-huiyuan-guochong/',
    note: '接 X 实时数据流；X Premium+ 官方为 $40/月，此处按 SuperGrok $30 计',
  },
  {
    id: 'cursor-pro',
    name: 'Cursor Pro',
    nameEn: 'Cursor Pro',
    vendor: 'Anysphere',
    usd: 20,
    cny: 121,
    unit: '月',
    promo: false,
    url: 'https://www.tlsfox.com/products/cursor-pro/',
    guide: 'https://www.tlsfox.com/compare/cursor-vs-copilot/',
    note: '把 Claude / GPT 塞进编辑器的 AI IDE，500 次快速请求',
  },
  {
    id: 'api-credit',
    name: 'API 额度',
    nameEn: 'OpenAI / Claude / Gemini API credit',
    vendor: '多家',
    usd: null,
    cny: 50,
    unit: '起充',
    promo: false,
    url: 'https://www.tlsfox.com/products/api-credit/',
    guide: 'https://www.tlsfox.com/guides/api-edu-chongzhi/',
    note: '按量计费，给官方 API 账户充余额，不改 key、不换 base_url',
  },
]

/** 自建外币卡的成本假设，可用 CLI 参数覆盖 */
export const CARD_DEFAULTS = {
  fxFeeRate: 0.015, // 跨境货币转换费 1.5%
  issueFeeCny: 30, // 虚拟卡一次性开卡费（人民币）
  amortizeMonths: 12, // 开卡费按月摊销的期数
}

export function findPlan(id) {
  const key = String(id).toLowerCase().replace(/[\s_]+/g, '-')
  return (
    CATALOG.find((p) => p.id === key) ||
    CATALOG.find((p) => p.name.toLowerCase() === String(id).toLowerCase()) ||
    CATALOG.find((p) => p.id.replace(/-/g, '') === key.replace(/-/g, ''))
  )
}
