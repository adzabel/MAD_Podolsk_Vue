// frontend/src/store/dashboardStore.js
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    mode: 'monthly',          // режим: по месяцам / по дням
    selectedMonth: null,      
    selectedDate: null,       
    selectedSmeta: null,      
    selectedDescription: null,

    monthlySummary: null,
    dailyRevenue: null,
    smetaCards: null,
    smetaDetails: null,
    smetaDescriptionDaily: null,
    dailyRows: null,

    isLoading: false,
    error: null,
  }),

  actions: {
    setMode(mode) {
      this.mode = mode
    },
    setMonth(month) {
      this.selectedMonth = month
    },
    setDate(date) {
      this.selectedDate = date
    }
  }
})
