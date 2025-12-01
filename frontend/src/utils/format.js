/**
 * Утилиты форматирования чисел и валют
 */

/**
 * Форматирует число как денежную сумму в русской локали
 * @param {number|string|null|undefined} value - значение для форматирования
 * @returns {string} отформатированная строка или '-' если значение невалидно
 */
export function formatMoney(value) {
  if (value === null || value === undefined) return '-'
  const n = Number(value)
  if (Number.isNaN(n)) return '-'
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 0, minimumFractionDigits: 0 })
}

/**
 * Форматирует число в русской локали (алиас для formatMoney)
 * @param {number|string|null|undefined} value - значение для форматирования
 * @returns {string} отформатированная строка или '-' если значение невалидно
 */
export function formatNumber(value) {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString('ru-RU')
}

/**
 * Форматирует число как процент
 * @param {number|null|undefined} value - значение (0-1 или 0-100)
 * @param {boolean} isDecimal - если true, умножает на 100
 * @returns {string} отформатированный процент или '-'
 */
export function formatPercent(value, isDecimal = true) {
  if (value === undefined || value === null) return '-'
  const n = isDecimal ? Math.round(value * 100) : Math.round(value)
  return n + ' %'
}
