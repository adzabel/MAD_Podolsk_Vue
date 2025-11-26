<template>
  <main class="page">
    <section class="page-content">
      
      <div v-if="dailyLoading">Загрузка...</div>
      <DailyTable v-else :rows="dailyRows" :total-amount="dailyTotal" :date="selectedDate" />
    </section>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '../store/dashboardStore.js'
import { storeToRefs } from 'pinia'
import DailyTable from '../components/sections/DailyTable.vue'

const store = useDashboardStore()
const { dailyLoading, dailyRows, dailyTotal, selectedDate } = storeToRefs(store)

onMounted(()=>{
  // пометить режим и загрузить данные за текущую выбранную дату
  store.setMode && store.setMode('daily')
  store.fetchDaily(selectedDate.value)
  // при открытии страницы По дням ставим класс на body, чтобы можно было
  // менять фон страницы локально (и вернуть при размонтировании)
  try { document && document.body && document.body.classList.add('page-daily-bg') } catch(e){}
})

onUnmounted(() => {
  try { document && document.body && document.body.classList.remove('page-daily-bg') } catch(e){}
})
</script>
