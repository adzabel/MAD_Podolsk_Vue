<template>
  <section class="panel contract-execution">
    <div class="panel-header">
      <div class="panel-title-group">
        <h3 class="panel-title">Исполнение контракта</h3>
      </div>
      <div class="panel-meta">
        <div class="panel-meta-row panel-meta-labels">
          <div class="panel-meta-item"><div class="panel-meta-label">Контракт</div></div>
          <div class="panel-meta-item"><div class="panel-meta-label">Выполнено</div></div>
          <div class="panel-meta-item"><div class="panel-meta-label">Исполнение</div></div>
        </div>
        <div class="panel-meta-row panel-meta-values">
          <div class="panel-meta-item"><div class="panel-meta-value">{{ formatMoney(contract?.summa_contract) }}</div></div>
          <div class="panel-meta-item"><div class="panel-meta-value">{{ formatMoney(contract?.fact_total) }}</div></div>
          <div class="panel-meta-item"><div class="panel-meta-value">{{ percent(contract?.contract_planfact_pct) }}</div></div>
        </div>
      </div>
    </div>

    <div class="contract-execution__body">
      <div class="contract-progress">
        <div class="contract-progress__bar">
          <div class="contract-progress__fill" :style="{ width: progressPercent + '%' }" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ contract: { type: Object, default: () => ({}) } })

function formatMoney(v){
  if (v === null || v === undefined) return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return '-'
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 0, minimumFractionDigits: 0 })
}

function percent(v){
  if (v === undefined || v === null) return '-'
  return Math.round(v * 100) + ' %'
}

const progressPercent = computed(()=>{
  const v = props.contract && props.contract.contract_planfact_pct
  if (v === undefined || v === null) return 0
  return Math.round(v * 100)
})

import { computed } from 'vue'
</script>

<style scoped>
.panel.contract-execution {
  width: 100%;
  box-sizing: border-box;
}

.panel.contract-execution .panel-header{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

  /* Use global .panel-title from components.css for unified typography */

.panel.contract-execution .panel-meta{
  gap: 6px;
}

.panel-meta-row{
  gap: 20px;
}

.panel-meta-item{
  min-width: 120px;
  overflow: hidden;
}

/* Mobile: keep the flex layout and right-aligned labels/values for small screens */
@media (max-width: 768px) {
  .panel.contract-execution .panel-meta{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .panel-meta-row{
    display: flex;
    gap: 20px;
  }

  .panel-meta-item{
    text-align: right;
  }
}

.panel-meta-label{
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.panel-meta-value{
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Left-align numeric values so they line up with the title */
.panel-meta-row.panel-meta-values .panel-meta-item{
  text-align: left;
  min-width: 0;
  flex: 1 1 0;
}

/* Align labels with numeric values on desktop so left edges match */
@media (min-width: 769px) {
  .panel-meta-row.panel-meta-labels .panel-meta-item {
    text-align: left;
    min-width: 0;
    flex: 1 1 0;
  }
}

.contract-execution__body{
  margin-top: 12px;
}

.contract-progress__bar{
  width: 100%;
  height: 12px;
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
}

.contract-progress__fill{
  height: 100%;
  --progress-color: var(--accent);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--progress-color) 75%, #ffffff) 0%,
    var(--progress-color) 100%
  );
  box-shadow: 0 6px 12px color-mix(in srgb, var(--progress-color) 30%, transparent);
  transition: width .35s ease;
}

@supports not (color-mix(in srgb, red, blue)) {
  .contract-progress__fill {
    background: var(--progress-color);
  }
}

/* Mobile adjustments */
@media (max-width: 768px){
  .panel.contract-execution .panel-header{
    flex-direction: column;
    align-items: flex-start;
  }

  .panel.contract-execution .panel-meta{
    align-items: stretch;
    width: 100%;
  }

  .panel-meta-row{
    justify-content: space-between;
    width: 100%;
  }

  .panel-meta-item{
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
  }

  /* Try to shrink labels to fit a single line */
  .panel-meta-label{
    font-size: clamp(11px, 3.5vw, 14px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .panel-meta-value{
    font-size: clamp(12px, 3.6vw, 14px);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contract-execution__body{
    margin-top: 10px;
  }

  .contract-progress__bar{
    height: 10px;
  }
}
</style>
