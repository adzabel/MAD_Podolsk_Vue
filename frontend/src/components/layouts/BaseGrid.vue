<template>
  <div
    class="base-grid"
    :class="[variantClass, { 'base-grid--gap-sm': gap === 'sm', 'base-grid--gap-lg': gap === 'lg' }]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Количество колонок или 'auto' для auto-fit
   * @values 1, 2, 3, 4, 'auto'
   */
  cols: { type: [Number, String], default: 'auto' },
  /**
   * Минимальная ширина колонки (для auto-fit)
   */
  minColWidth: { type: String, default: null },
  /**
   * Размер gap
   * @values 'sm', 'md', 'lg'
   */
  gap: { type: String, default: 'md' },
  /**
   * Выравнивание по высоте
   */
  equalHeight: { type: Boolean, default: false }
})

const variantClass = computed(() => {
  if (props.cols === 'auto') return 'base-grid--auto'
  return `base-grid--cols-${props.cols}`
})

const customStyle = computed(() => {
  const style = {}
  if (props.cols === 'auto' && props.minColWidth) {
    style['--grid-min-col'] = props.minColWidth
  }
  return style
})
</script>

<style scoped>
.base-grid {
  display: grid;
  gap: var(--card-frame-gap);
  width: 100%;
}

/* Фиксированные колонки */
.base-grid--cols-1 { grid-template-columns: 1fr; }
.base-grid--cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.base-grid--cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.base-grid--cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Auto-fit для адаптивных колонок */
.base-grid--auto {
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-col, var(--card-min-width, 280px)), 1fr));
}

/* Gap варианты */
.base-grid--gap-sm { gap: var(--gap-sm); }
.base-grid--gap-lg { gap: var(--gap-xl); }

/* Одинаковая высота строк */
.base-grid:has(> *) {
  grid-auto-rows: 1fr;
}
</style>
