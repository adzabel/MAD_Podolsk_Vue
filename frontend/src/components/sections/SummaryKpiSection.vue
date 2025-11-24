<template>
  <section class="summary-grid">
    <div class="summary-cards">
      <article class="summary-card">
        <div class="summary-label">План, ₽</div>
        <div class="summary-value">{{ formatMoney(kpi?.plan_total) }}</div>
      </article>

      <article class="summary-card">
        <div class="summary-label">Факт, ₽</div>
        <div class="summary-value">{{ formatMoney(kpi?.fact_total) }}</div>
      </article>

      <article class="summary-card">
        <div class="summary-label">Отклонение, ₽</div>
        <div class="summary-value" :class="{'negative': kpi && kpi.delta < 0}">{{ formatMoney(kpi?.delta) }}</div>
      </article>

      <article class="summary-card summary-card-interactive daily-average" @click="$emit('open-daily')">
        <div class="summary-label daily-average">СР.ДНЕВ. ВЫРУЧКА, ₽</div>
        <div class="summary-value">{{ formatMoney(kpi?.avg_daily_revenue) }}</div>
      </article>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ kpi: { type: Object, default: () => ({}) } })
const emit = defineEmits(['open-daily'])

function formatMoney(v){
  if (v === null || v === undefined) return '-'
  return Number(v).toLocaleString('ru-RU')
}
</script>
