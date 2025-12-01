<template>
  <div
    class="cards-grid"
    :class="{ 'is-loading': loading }"
    :style="gridStyle"
  >
    <slot />
    <div v-if="loading && showOverlay" class="cards-grid__overlay">
      <span>{{ loadingText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Минимальная ширина карточки
   */
  minWidth: { type: String, default: '280px' },
  /**
   * Состояние загрузки
   */
  loading: { type: Boolean, default: false },
  /**
   * Показывать оверлей при загрузке
   */
  showOverlay: { type: Boolean, default: true },
  /**
   * Текст загрузки
   */
  loadingText: { type: String, default: 'Обновляем данные…' }
})

const gridStyle = computed(() => ({
  '--cards-min-width': props.minWidth
}))
</script>

<style scoped>
.cards-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--cards-min-width, 280px), 1fr));
  gap: var(--grid-gap, var(--card-frame-gap));
  align-items: start;
}

.cards-grid.is-loading {
  opacity: 0.9;
  filter: saturate(0.9);
  transition: opacity 160ms ease;
}

.cards-grid__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface-base) 80%, transparent);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  pointer-events: none;
}
</style>
