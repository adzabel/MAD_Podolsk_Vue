<!-- frontend/src/views/MonthlyDashboard.vue -->
<template>
  <section class="dashboard-page">
    <!-- Верхняя панель: заголовок раздела + выбор месяца -->
    <header class="dashboard-header">
      <div class="dashboard-header__titles">
        <h2 class="dashboard-header__title">
          Месячный дашборд
        </h2>
        <p class="dashboard-header__subtitle">
          Выберите месяц, чтобы посмотреть план / факт и исполнение контракта
        </p>
      </div>

      <!-- MonthSelector -->
      <div class="dashboard-header__controls">
        <label class="month-selector">
          <span class="month-selector__label">Месяц</span>
          <input
            class="month-selector__input"
            type="month"
            v-model="localMonth"
            @change="onMonthChange"
          />
        </label>
      </div>
    </header>

    <!-- Основное содержимое -->
    <main class="dashboard-content">
      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="dashboard-state dashboard-state--loading">
        Загружаем данные за выбранный месяц…
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="dashboard-state dashboard-state--error">
        Произошла ошибка при загрузке данных: {{ error }}
      </div>

      <!-- Данные получены -->
      <div v-else-if="summary" class="dashboard-summary">
        <!-- Здесь временно просто выводим summary как JSON.
             Позже заменим на реальные карточки / таблицы. -->
        <pre class="dashboard-summary__debug">
{{ formattedSummary }}
        </pre>
      </div>

      <!-- Пока ничего не выбрано / нет данных -->
      <div v-else class="dashboard-state dashboard-state--empty">
        Выберите месяц, чтобы увидеть данные.
      </div>
    </main>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDashboardStore } from '../store/dashboardStore'

// подключаем store
const store = useDashboardStore()

// локальное значение для input type="month"
const localMonth = ref(store.selectedMonth || getCurrentMonth())

// вычислимые значения из стора
const summary = computed(() => store.monthlySummary)
const isLoading = computed(() => store.loadingMonthly)
const error = computed(() => store.errorMonthly)

// для временного отображения — красиво отформатированный JSON
const formattedSummary = computed(() =>
  JSON.stringify(summary.value, null, 2)
)

// утилита: текущий месяц в формате YYYY-MM (для <input type="month">)
function getCurrentMonth () {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

// обработчик изменения месяца
async function onMonthChange () {
  if (!localMonth.value) return
  store.setMonth(localMonth.value)
  await store.loadMonthlySummary()
}

// при первом открытии страницы
onMounted(async () => {
  if (!store.selectedMonth) {
    store.setMonth(localMonth.value)
  } else {
    // если месяц уже был в store (например, пришли из другого экрана)
    localMonth.value = store.selectedMonth
  }

  await store.loadMonthlySummary()
})
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Шапка */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.dashboard-header__titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dashboard-header__title {
  font-size: 1.4rem;
  font-weight: 600;
}

.dashboard-header__subtitle {
  font-size: 0.9rem;
  color: #666;
}

/* MonthSelector */
.dashboard-header__controls {
  display: flex;
  align-items: center;
}

.month-selector {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.month-selector__label {
  color: #555;
}

.month-selector__input {
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Основной блок */
.dashboard-content {
  min-height: 200px;
}

/* Состояния */
.dashboard-state {
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.95rem;
}

.dashboard-state--loading {
  background: #f5f7ff;
}

.dashboard-state--error {
  background: #ffecec;
  color: #b00020;
}

.dashboard-state--empty {
  color: #777;
}

/* Временный вывод summary */
.dashboard-summary__debug {
  padding: 1rem;
  border-radius: 4px;
  background: #f6f6f6;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.85rem;
  overflow-x: auto;
}
</style>
