<script setup>
import { useDashboardStore } from './store/dashboardStore.js'
import { computed } from 'vue'

const store = useDashboardStore()

// активный режим
const mode = computed(() => store.mode)

// переключение режима
function switchMode(newMode) {
  store.setMode(newMode)

  if (newMode === 'monthly') {
    window.location.href = '/'
  } else {
    window.location.href = '/daily'
  }
}
</script>

<template>
  <div id="app-layout">
    <header class="app-header">
      <div class="title-block">
        <h1 class="title">СКПДИ · МАД · Подольск</h1>
        <div class="subtitle">Работы в статусе «Рассмотрено»</div>
      </div>

      <div class="mode-switch">
        <button 
          :class="['mode-btn', mode === 'monthly' && 'active']"
          @click="switchMode('monthly')"
        >
          По месяцам
        </button>

        <button 
          :class="['mode-btn', mode === 'daily' && 'active']"
          @click="switchMode('daily')"
        >
          По дням
        </button>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}

/* ====== HEADER ====== */

.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e3e3e3;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin-top: 2px;
  font-size: 14px;
  color: #666;
}

/* ====== MODE SWITCH BUTTONS ====== */

.mode-switch {
  display: flex;
  gap: 8px;
}

.mode-btn {
  padding: 8px 14px;
  border: 1px solid #ccc;
  background: #f6f6f6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.mode-btn:hover {
  background: #eaeaea;
}

.mode-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* ====== MAIN CONTENT ====== */

.app-content {
  padding: 24px;
  flex-grow: 1;
}
</style>

