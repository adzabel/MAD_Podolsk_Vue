<template>
  <div class="table-skeleton">
    <div class="table-skeleton__header">
      <div class="th name"></div>
      <div class="th numeric"></div>
      <div class="th numeric"></div>
      <div class="th numeric"></div>
    </div>
    <div class="table-skeleton__body">
      <div v-for="n in 6" :key="n" class="tr">
        <div class="td name"></div>
        <div class="td numeric"></div>
        <div class="td numeric"></div>
        <div class="td numeric"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// simple presentational skeleton for table-like layout
</script>

