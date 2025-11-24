import { request } from './client.js'

// Функции API: пробуем старые конкретные пути, а при 404 фолбэчим на единый эндпойнт
function ensureMonthFull(month) {
  // ожидаем формат YYYY-MM или YYYY-MM-01; приводим к YYYY-MM-01
  if (!month) return month
  if (/^\d{4}-\d{2}$/.test(month)) return `${month}-01`
  return month
}

function smetaKeyFromLabel(label) {
  if (!label) return label
  const map = { 'лето': 'leto', 'зима': 'zima', 'внерегламент': 'vnereglement', 'вне регламент': 'vnereglement' }
  if (map[label]) return map[label]
  // fallback: ascii-safe slug
  return label.toString().toLowerCase().replace(/[^a-z0-9]+/gi, '-')
}

export async function getMonthlySummary(month) {
  const m = ensureMonthFull(month)
  try {
    return await request(`/api/dashboard/monthly/summary?month=${encodeURIComponent(m)}`)
  } catch (err) {
    // fallback to combined endpoint
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      const res = await request(`/api/dashboard?month=${encodeURIComponent(m)}`)
      return res && res.summary ? res.summary : res
    }
    throw err
  }
}

export async function getLastLoaded() {
  try {
    return await request(`/api/dashboard/last-loaded`)
  } catch (err) {
    // if not present, combined endpoint contains last_updated
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      return await request(`/api/dashboard`)
    }
    throw err
  }
}

export async function getBySmeta(month) {
  const m = ensureMonthFull(month)
  try {
    return await request(`/api/dashboard/monthly/by-smeta?month=${encodeURIComponent(m)}`)
  } catch (err) {
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      const res = await request(`/api/dashboard?month=${encodeURIComponent(m)}`)
      // aggregate items by smeta label
      const items = (res && res.items) || []
      const grouped = {}
      for (const it of items) {
        const key = smetaKeyFromLabel(it.smeta)
        if (!grouped[key]) grouped[key] = { smeta_key: key, label: it.smeta, plan: 0, fact: 0 }
        grouped[key].plan += Number(it.planned_amount || it.planned || 0)
        grouped[key].fact += Number(it.fact_amount || it.fact || 0)
      }
      return { cards: Object.values(grouped) }
    }
    throw err
  }
}

export async function getSmetaDetails(month, smeta_key) {
  const m = ensureMonthFull(month)
  try {
    return await request(`/api/dashboard/monthly/smeta-details?month=${encodeURIComponent(m)}&smeta_key=${encodeURIComponent(smeta_key)}`)
  } catch (err) {
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      const res = await request(`/api/dashboard?month=${encodeURIComponent(m)}`)
      const items = (res && res.items) || []
      const rows = items
        .filter(it => smetaKeyFromLabel(it.smeta) === smeta_key)
        .map(it => ({ work_name: it.work_name || it.description || '', plan: it.planned_amount || it.planned || 0, fact: it.fact_amount || it.fact || 0 }))
      return { rows }
    }
    throw err
  }
}

export async function getMonthlyDailyRevenue(month) {
  const m = ensureMonthFull(month)
  try {
    return await request(`/api/dashboard/monthly/daily-revenue?month=${encodeURIComponent(m)}`)
  } catch (err) {
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      // not available in combined endpoint
      return { rows: [] }
    }
    throw err
  }
}

export async function getDaily(date) {
  // backend accepts `day` query param on production host
  try {
    return await request(`/api/dashboard/daily?day=${encodeURIComponent(date)}`)
  } catch (err) {
    // try legacy param name
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      return await request(`/api/dashboard/daily?date=${encodeURIComponent(date)}`)
    }
    throw err
  }
}

export async function getSmetaDescriptionDaily(month, smeta_key, description) {
  const m = ensureMonthFull(month)
  try {
    return await request(`/api/dashboard/monthly/smeta-description-daily?month=${encodeURIComponent(m)}&smeta_key=${encodeURIComponent(smeta_key)}&description=${encodeURIComponent(description)}`)
  } catch (err) {
    if (err && (err.status === 404 || (err.message && err.message.includes('Not Found')))) {
      // try to emulate using combined endpoint (not available) — return empty
      return { rows: [] }
    }
    throw err
  }
}
