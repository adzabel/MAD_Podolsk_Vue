<!-- frontend/src/components/MonthSelector.vue -->
<template>
  <div class="month-selector">
    <label class="month-selector__label" for="month">
      Месяц:
    </label>

    <select
      id="month"
      class="month-selector__select"
      v-model="localMonth"
    >
      <option
        v-for="month in months"
        :key="month.value"
        :value="month.value"
      >
        {{ month.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../store/dashboardStore'

const store = useDashboardStore()

// список месяцев – пока простая «лесенка» из 12 последних месяцев
const months = computed(() => {
  const result = []
  const now = new Date()

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = d.toISOString().slice(0, 7) // YYYY-MM

    const formatter = new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    })

    result.push({
      value,
      label: formatter.format(d), // например: "ноябрь 2025 г."
    })
  }

  return result
})

// локальное значение, связанное со store.selectedMonth
const localMonth = computed({
  get() {
    return store.selectedMonth
  },
  async set(value) {
    // при смене месяца в селекте обновляем store и грузим данные
    await store.setMonth(value)
  },
})
</script>

<style scoped>
.month-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.month-selector__label {
  font-size: 14px;
  color: #555;
}

.month-selector__select {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
