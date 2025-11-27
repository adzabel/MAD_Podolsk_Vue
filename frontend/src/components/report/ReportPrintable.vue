<template>
  <div id="report-to-print" class="report-root">
    <header class="report-header">
      <div>
        <div class="report-title">Отчёт по работам</div>
        <div class="report-subtitle">Период: {{ date || '—' }}</div>
      </div>
      <div class="report-meta">
        <div>Город: Подольск</div>
        <div>Сформировано: {{ generatedAt }}</div>
      </div>
    </header>

    <section class="report-summary">
      <div class="report-card">
        <div class="card-label">Всего позиций</div>
        <div class="card-value">{{ rows.length }}</div>
      </div>
      <div class="report-card">
        <div class="card-label">Итого</div>
        <div class="card-value">{{ formattedTotal }}</div>
      </div>
      <div class="report-card">
        <div class="card-label">Источник</div>
        <div class="card-value">Дашборд</div>
      </div>
    </section>

    <section>
      <table class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Наименование</th>
            <th>Объём</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, idx) in rows" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.volume }}</td>
            <td>{{ formatMoney(r.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <footer class="report-footer">
      <div>Подпись: ____________________</div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  date: { type: String, default: '' },
  total: { type: [Number, String], default: 0 }
})

const generatedAt = new Date().toLocaleString()

function formatMoney(v) {
  const n = Number(v || 0)
  return n.toLocaleString('ru-RU')
}

const formattedTotal = computed(() => formatMoney(props.total))
</script>

<style scoped>
.report-root {
  /* keep the printable report in the DOM but visually out of the page */
  position: absolute;
  left: -9999px;
  top: 0;
  width: 210mm; /* keep A4 width for consistent PDF layout */
  box-sizing: border-box;
}

@media print {
  .report-root { position: static; left: auto; top: auto; }
}

.card-label { font-size: 12px; color: #6b7684; }
.card-value { font-weight: 600; font-size: 16px; }
</style>
