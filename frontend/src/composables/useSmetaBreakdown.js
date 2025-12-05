import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore, isVneregKey } from '../store/dashboardStore.js'

// Re-export isVneregKey for backward compatibility
export { isVneregKey }

/**
 * Composable для работы с данными расшифровки сметы
 * @param {import('vue').ComputedRef<string>} smetaKeyRef - реактивный ключ сметы
 * @returns {Object} - filteredRows, totals, smetaLabel, loading
 */
export function useSmetaBreakdown(smetaKeyRef) {
  const store = useDashboardStore()
  const { smetaDetailsLoading, smetaDetails, selectedSmetaLabel } = storeToRefs(store)

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
   * Человекочитаемое название сметы - теперь берём из стора
   */
  const smetaLabel = computed(() => selectedSmetaLabel.value)

  return {
    loading,
    filteredRows,
    totals,
    smetaLabel
  }
}
