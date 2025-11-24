<template>
  <div class="modal" v-if="visible">
    <div class="modal__backdrop" @click="$emit('close')"></div>
    <div class="modal__dialog">
      <header class="modal__header">
        <h3>Выручка по дням — {{ month }}</h3>
        <button class="modal__close" @click="$emit('close')">✕</button>
      </header>

      <div class="modal__body">
        <div v-if="loading">Загрузка…</div>
        <table v-else class="modal-table">
          <thead>
            <tr><th>Дата</th><th>Сумма</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.date">
              <td>{{ r.date }}</td>
              <td>{{ formatMoney(r.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import * as api from '../../api/dashboard.js'

const props = defineProps({ visible: Boolean, month: String })
const emit = defineEmits(['close'])

const rows = ref([])
const loading = ref(false)

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
