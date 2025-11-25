<template>
  <div class="last-updated" v-if="display">
    <span class="last-updated__dot" aria-hidden="true"></span>
    <div class="last-updated__text">
      <div class="last-updated__label">ДАННЫЕ ОБНОВЛЕНЫ</div>
      <div class="last-updated__time">{{ formatted }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../store/dashboardStore.js'
import { storeToRefs } from 'pinia'

const props = defineProps({ loadedAt: { type: [String, Date], default: null } })

const store = useDashboardStore()
const { loadedAt, monthlySummary } = storeToRefs(store)

const source = computed(() => {
  // Prefer explicit prop when provided
  if (props.loadedAt) return props.loadedAt

  // Check store-level timestamp set by explicit endpoint
  if (loadedAt.value) return loadedAt.value

  // Accept several possible shapes from backend responses
  const s = monthlySummary.value || {}
  return s.loaded_at || s.last_updated || s.updated_at || s.lastUpdated || s.timestamp || (s.meta && (s.meta.loaded_at || s.meta.last_updated)) || null
})

const display = computed(()=> !!source.value)

const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']

function pad(n){ return String(n).padStart(2,'0') }

const formatted = computed(()=>{
  const v = source.value
  if (!v) return ''
  const d = (typeof v === 'string') ? new Date(v) : new Date(v)
  if (isNaN(d)) return String(v)
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${day}.${month}.${year}, ${hh}:${mm}`
})
</script>
