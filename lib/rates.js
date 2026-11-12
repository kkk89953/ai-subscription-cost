/**
 * 实时 USD→CNY 汇率
 * 三源并行取中位数；全失败时回落到本地缓存，再失败用 FALLBACK_RATE。
 * 不依赖任何 API key。
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export const FALLBACK_RATE = 6.67 // 2026-11 实测区间下沿，仅在全部数据源失败时使用

const CACHE_DIR = join(homedir(), '.ai-cost')
const CACHE_FILE = join(CACHE_DIR, 'rate.json')
const TTL_MS = 60 * 60 * 1000 // 缓存 1 小时

const SOURCES = [
  {
    name: 'open.er-api.com',
    url: 'https://open.er-api.com/v6/latest/USD',
    pick: (j) => j?.rates?.CNY,
  },
  {
    name: 'frankfurter.app',
    url: 'https://api.frankfurter.app/latest?from=USD&to=CNY',
    pick: (j) => j?.rates?.CNY,
  },
  {
    name: 'jsdelivr/currency-api',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    pick: (j) => j?.usd?.cny,
  },
]

async function fetchWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: 'application/json', 'user-agent': 'ai-subscription-cost/1.0' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

function median(nums) {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

async function readCache() {
  try {
    const raw = JSON.parse(await readFile(CACHE_FILE, 'utf8'))
    if (typeof raw.rate === 'number' && raw.rate > 0) return raw
  } catch {
    /* 无缓存 */
  }
  return null
}

async function writeCache(payload) {
  try {
    await mkdir(CACHE_DIR, { recursive: true })
    await writeFile(CACHE_FILE, JSON.stringify(payload, null, 2), 'utf8')
  } catch {
    /* 只读环境，忽略 */
  }
}

/**
 * @param {{ fresh?: boolean }} opts fresh=true 跳过缓存
 * @returns {Promise<{rate:number, source:string, fetchedAt:string, samples:Array<{name:string,rate:number}>, stale:boolean}>}
 */
export async function getUsdCnyRate(opts = {}) {
  if (!opts.fresh) {
    const cached = await readCache()
    if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < TTL_MS) {
      return { ...cached, stale: false, source: `${cached.source} (cache)` }
    }
  }

  const results = await Promise.allSettled(
    SOURCES.map(async (s) => {
      const json = await fetchWithTimeout(s.url)
      const rate = Number(s.pick(json))
      if (!Number.isFinite(rate) || rate <= 0) throw new Error('rate 字段解析失败')
      return { name: s.name, rate }
    }),
  )

  const samples = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)

  if (samples.length === 0) {
    const cached = await readCache()
    if (cached) {
      return {
        rate: cached.rate,
        source: `${cached.source} (stale cache)`,
        fetchedAt: cached.fetchedAt,
        samples: cached.samples ?? [],
        stale: true,
      }
    }
    return {
      rate: FALLBACK_RATE,
      source: 'built-in fallback',
      fetchedAt: new Date().toISOString(),
      samples: [],
      stale: true,
    }
  }

  const rate = Number(median(samples.map((s) => s.rate)).toFixed(4))
  const payload = {
    rate,
    source: `median of ${samples.length} source(s)`,
    fetchedAt: new Date().toISOString(),
    samples,
  }
  await writeCache(payload)
  return { ...payload, stale: false }
}
