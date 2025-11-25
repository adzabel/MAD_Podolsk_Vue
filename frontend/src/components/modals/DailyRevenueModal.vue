<template>
  <div v-if="visible" class="modal-backdrop visible" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3 class="modal-title">Выручка по дням</h3>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </header>

      <div class="modal-body">
        <div v-if="loading">Загрузка…</div>
        <table v-else class="smeta-breakdown-table modal-table">
          <colgroup>
            <col class="col-date" />
            <col class="col-amount" />
          </colgroup>
          <thead>
            <tr>
              <th>Дата</th>
              <th class="numeric">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.date">
              <td class="modal-row-date">{{ formatDate(r.date) }}</td>
              <td class="numeric modal-row-value">{{ formatMoney(r.amount) }}</td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="2" class="muted">Нет данных за выбранный месяц</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep modal content readable on narrow screens: allow horizontal scroll but keep two columns side-by-side */
.modal {
  max-width: min(92vw, 820px);
  width: auto;
}
.modal-body { overflow-x: auto; }
.modal-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.modal-table col.col-date { width: 45%; }
.modal-table col.col-amount { width: 55%; }
.modal-table th, .modal-table td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modal-row-date { text-align: left; padding-right: 12px; }
.modal-row-value { text-align: right; font-variant-numeric: tabular-nums; }
.modal-table .muted { text-align: center; }
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import * as api from '../../api/dashboard.js'

const props = defineProps({ visible: Boolean, month: String })
const emit = defineEmits(['close'])

const rows = ref([])
const loading = ref(false)

function formatDate(d){
  if (!d) return '-'
  // expected input: YYYY-MM-DD or ISO date string
  const s = String(d).slice(0,10)
  const parts = s.split('-')
  if (parts.length !== 3) return s
  return `${parts[2]}.${parts[1]}.${parts[0]}`
}

async function load(){
  if (!props.month) return
  loading.value = true
  try{
    const res = await api.getMonthlyDailyRevenue(props.month)
    rows.value = res.rows || []
  }finally{ loading.value = false }
}

watch(()=>props.visible, v=>{ if (v) load() })

function formatMoney(v){ if (v === null || v === undefined) return '-'; return Number(v).toLocaleString('ru-RU') }
</script>
