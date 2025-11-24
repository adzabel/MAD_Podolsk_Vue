<template>
  <section class="smeta-details">
    <h3 class="smeta-details__title">Расшифровка работ по смете {{ selectedLabel ? `«${selectedLabel}»` : '' }}</h3>

    <div v-if="loading" class="empty-state">Загрузка...</div>

    <div v-else>
      <div v-if="!rows || rows.length === 0" class="empty-state">Нет данных по смете</div>

      <table v-else class="smeta-details__table">
        <thead>
          <tr>
            <th>Работы</th>
            <th>План</th>
            <th>Факт</th>
            <th>Отклонение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.description" @click="$emit('select', r.description)" class="smeta-details__row">
            <td class="desc">{{ r.description }}</td>
            <td class="num">{{ formatMoney(r.plan) }}</td>
            <td class="num">{{ formatMoney(r.fact) }}</td>
            <td :class="['num', {'delta-negative': r.delta < 0}]">{{ formatMoney(r.delta) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useDashboardStore } from '../../store/dashboardStore'

const emit = defineEmits(['select'])

const store = useDashboardStore()

const loading = computed(() => store.smetaDetailsLoading)
const rows = computed(() => store.smetaDetails || [])

const selectedLabel = computed(() => {
  const key = store.selectedSmeta
  if (!key) return ''
  const found = (store.smetaCards || []).find(c => c.smeta_key === key)
  return found ? found.label : ''
})

function formatMoney(v){
  if (v === null || v === undefined) return '-'
  return Number(v).toLocaleString('ru-RU')
}

onMounted(() => {
  if (store.selectedSmeta && (!store.smetaDetails || !store.smetaDetails.length)) {
    store.fetchSmetaDetails(store.selectedSmeta)
  }
})

watch(() => store.selectedSmeta, (newKey) => {
  if (newKey) store.fetchSmetaDetails(newKey)
})
</script>

<style scoped>
.smeta-details__title { margin: 0 0 12px 0; font-size: 1rem; }
.smeta-details__table { width: 100%; border-collapse: collapse; }
.smeta-details__table th, .smeta-details__table td { padding: 8px 12px; border-bottom: 1px solid var(--muted-border, #eee); text-align: left; }
.smeta-details__table th { font-weight: 600; }
.smeta-details__row { cursor: pointer; }
.smeta-details__row:hover { background: var(--hover, #fafafa); }
.smeta-details__table .num { text-align: right; white-space: nowrap; }
.delta-negative { color: var(--danger, #b00020); }
.empty-state { color: var(--muted, #888); padding: 12px 0; }
</style>
