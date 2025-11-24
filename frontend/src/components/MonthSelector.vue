<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Месяц'
  }
})

const emit = defineEmits(['update:modelValue'])

const onChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <label class="month-selector">
    <span class="month-selector__label">{{ label }}</span>
    <input
      :value="modelValue"
      type="month"
      class="month-selector__input"
      @input="onChange"
    />
  </label>
</template>

<style scoped>
.month-selector {
  display: inline-flex;
  flex-direction: column;
  font-size: 13px;
}

.month-selector__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #777;
}

.month-selector__input {
  display: block;
  margin-top: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
}
</style>
