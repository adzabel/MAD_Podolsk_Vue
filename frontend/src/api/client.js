// Простая обёртка над fetch с базовым URL и обработкой ошибок
// В development можно переопределить базу через Vite: VITE_API_BASE
//
// Прод-домен бэкенда используется как значение по умолчанию, чтобы UI,
// размещённый на podolsk.mad.moclean.ru, ходил сразу на рабочий API
// mad-podolsk-karinausadba.amvera.io и не пытался слать запросы на свой
// собственный origin.
const DEFAULT_BASE = 'https://mad-podolsk-vue-karinausadba.amvera.io'

const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : DEFAULT_BASE

const RETRY_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 500

function isRetryableStatus(status) {
  if (!status) return false
  // Бэкенд на "просыпающейся" базе может вернуть 5xx; считаем такие ответы временными
  // и повторяем попытку.
  return status >= 500 || status === 425
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`

  // Only set Content-Type when there's a JSON body to send.
  const cfg = { headers: {}, ...options }

  if (cfg.body && typeof cfg.body === 'object') {
    cfg.headers['Content-Type'] = 'application/json'
    cfg.body = JSON.stringify(cfg.body)
  }

  let lastError

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    let res
    try {
      res = await fetch(url, cfg)
    } catch (fetchErr) {
      // Сетевые ошибки — частый симптом "заснувшей" базы; пробуем ещё раз.
      lastError = new Error(`Network error while fetching ${url}: ${fetchErr && fetchErr.message ? fetchErr.message : String(fetchErr)}`)
      lastError.cause = fetchErr
      if (attempt < RETRY_ATTEMPTS - 1) {
        await wait(RETRY_BASE_DELAY_MS * (attempt + 1))
        continue
      }
      throw lastError
    }

    if (!res.ok) {
      if (isRetryableStatus(res.status) && attempt < RETRY_ATTEMPTS - 1) {
        await wait(RETRY_BASE_DELAY_MS * (attempt + 1))
        continue
      }
      const text = await res.text().catch(() => '')
      const message = text || `${res.status} ${res.statusText}`
      const err = new Error(message)
      err.status = res.status
      err.url = url
      throw err
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return res.json()
    }

    return res.text()
  }

  // теоретически недостижимо, но чтобы тайпчекеры были спокойны
  if (lastError) throw lastError
  throw new Error('Unknown request error')
}

export { request }
