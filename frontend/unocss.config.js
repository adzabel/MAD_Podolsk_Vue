import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  // Safelist critical classes that are generated dynamically by JS templates
  safelist: ['smeta-breakdown-table', 'numeric', 'panel', 'panel-body', 'muted']
})
