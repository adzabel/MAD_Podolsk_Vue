<template>
  <section class="contract-execution">
    <div class="contract-execution__cards">
      <div class="summary-card">
        <div class="summary-label">Контракт</div>
        <div class="summary-value">{{ formatMoney(contract?.summa_contract) }}</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Выполнено</div>
        <div class="summary-value">{{ formatMoney(contract?.fact_total) }}</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Исполнение</div>
        <div class="summary-value">{{ percent(contract?.contract_planfact_pct) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ contract: { type: Object, default: () => ({}) } })

function formatMoney(v){
  if (!v && v !== 0) return '-'
  return Number(v).toLocaleString('ru-RU')
}

function percent(v){
  if (v === undefined || v === null) return '-'
  return Math.round(v * 100) + ' %'
}
</script>
