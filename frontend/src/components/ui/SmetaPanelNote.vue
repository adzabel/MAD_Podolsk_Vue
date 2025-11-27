<template>
  <div>
    <div v-if="isMobile" class="panel-title-mobile panel-title-mobile-left">
      <div class="panel-title-mobile-label">Работы по смете {{ label }}</div>
      <p class="panel-note">Детали по виду работы при нажатии</p>
    </div>
    <p v-else class="panel-note">Детали по виду работы при нажатии</p>
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import { useIsMobile } from '../../composables/useIsMobile.js'

const props = defineProps({
  label: { type: String, default: '' }
})

const label = toRef(props, 'label')
const { isMobile } = useIsMobile()
</script>

<style scoped>
/* Ensure mobile title+note stack and take full width inside header */
.panel-title-mobile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.panel-title-mobile-label {
  /* Match dashboard panel title (one-to-one) */
  font-family: var(--font-din);
  font-size: var(--font-size-h3);
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 calc(var(--gap-sm));
  line-height: 1.12;
  letter-spacing: -0.02em;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.panel-note {
  margin: 0;
  color: var(--text-muted, #777);
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  /* allow wrapping on small screens for long smeta names */
  .panel-title-mobile-label {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
}

</style>
