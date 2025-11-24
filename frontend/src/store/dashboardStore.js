// frontend/src/store/dashboardStore.js
import { defineStore } from 'pinia'

function getCurrentMonthISO() {
  // YYYY-MM
  return new Date().toISOString().slice(0, 7)
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    // выбранный месяц в формате YYYY-MM
    selectedMonth: getCurrentMonthISO(),

    // данные сводки по месяцу (то, что придёт из API)
    monthlySummary: null,

    // флаги загрузки / ошибки
    isLoadingMonthly: false,
    monthlyError: null,
  }),

  actions: {
    // смена месяца из MonthSelector
    async setMonth(month) {
      this.selectedMonth = month
      await this.loadMonthlySummary()
    },

    // загрузка сводки по месяцу из backend
    async loadMonthlySummary() {
      this.isLoadingMonthly = true
      this.monthlyError = null

      try {
        // базовый URL API берём из env, чтобы потом легко привязать к Amvera
        const baseUrl = import.meta.env.VITE_API_URL || ''

        const url = `${baseUrl}/api/dashboard/monthly/summary?month=${this.selectedMonth}`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.status}`)
        }

        const data = await response.json()
        this.monthlySummary = data
      } catch (error) {
        console.error(error)
        this.monthlyError = error.message || 'Не удалось загрузить данные по месяцу'
      } finally {
        this.isLoadingMonthly = false
      }
    },
  },
})

