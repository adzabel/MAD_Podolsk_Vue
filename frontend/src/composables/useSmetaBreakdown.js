import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '../store/dashboardStore.js'

/**
 * Проверяет, является ли ключ сметы "внерегламентом"
 * @param {string} key - ключ сметы
 * @returns {boolean}
 */
export function isVneregKey(key) {
  if (!key) return false
  const k = String(key).toLowerCase()
  return k.includes('vne') || k === 'vnereg' || k === 'vner1' || k === 'vner2' || k === 'vnereglement'
}

/**
 * Маппинг ключей смет на человекочитаемые названия
 */
const SMETA_LABELS = {
  leto: 'Лето',
  zima: 'Зима',
  vnereg: 'Внерегламент',
  vner1: 'Внерегламент',
  vner2: 'Внерегламент',
  vnereglement: 'Внерегламент'
}

/**
 * Composable для работы с данными расшифровки сметы
 * @param {import('vue').ComputedRef<string>} smetaKeyRef - реактивный ключ сметы
 * @returns {Object} - filteredRows, totals, smetaLabel, loading
 */
export function useSmetaBreakdown(smetaKeyRef) {
  const store = useDashboardStore()
  const { smetaDetailsLoading, smetaDetails, smetaCards } = storeToRefs(store)

  const loading = computed(() => smetaDetailsLoading.value)

  /**
   * Отфильтрованные строки сметы:
   * - Для внерегламента Plan = 0
   * - Показываем только строки где plan > 1 или fact > 1
   */
  const filteredRows = computed(() => {
    const key = smetaKeyRef.value
    const isVnereg = isVneregKey(key)
    const src = smetaDetails.value || []

    return src
      .map(r => {
        const plan = Number(r.plan || 0)
        const fact = Number(r.fact || r.fact_amount_done || 0)
        return {
          ...r,
          plan: isVnereg ? 0 : plan,
          fact
        }
      })
      .filter(r => (Number(r.plan || 0) > 1) || (Number(r.fact || 0) > 1))
  })

  /**
   * Итоги по План / Факт / Дельта
   */
  const totals = computed(() => {
    const arr = filteredRows.value || []
    const plan = arr.reduce((s, r) => s + (Number(r.plan) || 0), 0)
    const fact = arr.reduce((s, r) => s + (Number(r.fact) || 0), 0)
    const delta = fact - plan
    return { plan, fact, delta }
  })

  /**
   * Человекочитаемое название сметы
   */
  const smetaLabel = computed(() => {
    const key = smetaKeyRef.value
    if (SMETA_LABELS[key]) return SMETA_LABELS[key]
    const found = (smetaCards.value || []).find(c => c.smeta_key === key)
    return found?.label || key
  })

  return {
    loading,
    filteredRows,
    totals,
    smetaLabel
  }
}
