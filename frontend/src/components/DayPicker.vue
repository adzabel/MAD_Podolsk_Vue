<template>
  <div class="day-picker" ref="root">
    <button
      type="button"
      class="day-picker__toggle"
      @click="openNative()"
      :aria-label="`Выбор даты, текущая: ${currentLabel}`"
    >
      <span class="day-picker__label">ДАТА</span>
      <span class="day-picker__current">{{ currentLabel }}</span>
      <span class="day-picker__arrow">▾</span>
    </button>

    <!-- native date input opened programmatically -->
    <input ref="inputDate" class="day-picker__input" type="date" :value="value" @input="onInput" :min="monthStart" :max="monthEnd" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardStore } from '../store/dashboardStore.js'

const store = useDashboardStore()
const inputDate = ref(null)

const value = computed(() => store.selectedDate)
const currentLabel = computed(() => {
  const v = store.selectedDate
  if (!v) return ''
  const d = new Date(v)
  return d.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Restrict picker to current calendar month
const monthStart = computed(() => {
  const t = new Date()
  const s = new Date(t.getFullYear(), t.getMonth(), 1)
  return s.toISOString().slice(0,10)
})
const monthEnd = computed(() => {
  const t = new Date()
  const e = new Date(t.getFullYear(), t.getMonth() + 1, 0)
  return e.toISOString().slice(0,10)
})

function openNative(){
  try{ inputDate.value && inputDate.value.showPicker && inputDate.value.showPicker(); }catch(e){}
  try{ inputDate.value && inputDate.value.focus(); }catch(e){}
}

async function onInput(e){
  const v = e.target.value
  if (!v) return
  // ignore selections outside current month
  if (v < monthStart.value || v > monthEnd.value) return
  store.setSelectedDate(v)
  await store.fetchDaily(v)
}
</script>

<style scoped>
.day-picker { position: relative; display: inline-block; }
.day-picker__toggle { display:inline-flex; align-items:center; gap:12px; background:var(--bg-card); border:1px solid var(--border-soft); padding:0 12px; border-radius:10px; cursor:pointer; min-width:160px; height:var(--control-height); }
.day-picker__label { font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; margin-right:6px; }
.day-picker__current { font-weight:700; color:var(--text-main); flex:1; text-align:left }
.day-picker__arrow { color:var(--text-muted) }
.day-picker__input { position:absolute; left:0; top:0; width:1px; height:1px; opacity:0; pointer-events:none }
</style>
