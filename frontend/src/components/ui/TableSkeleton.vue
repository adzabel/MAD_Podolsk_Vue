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

<style scoped>
.table-skeleton{display:flex;flex-direction:column;gap:12px}
.table-skeleton__header{display:grid;grid-template-columns:1fr 120px 120px 120px;gap:12px;margin-bottom:6px}
.table-skeleton__body{display:flex;flex-direction:column;gap:10px}
.tr{display:grid;grid-template-columns:1fr 120px 120px 120px;gap:12px;align-items:center}
.th,.td{height:18px;border-radius:6px;background:linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.06) 100%);}
.th.name,.td.name{height:20px;width:100%}
.th.numeric,.td.numeric{height:18px;width:100%;justify-self:end}
.table-skeleton__body .tr .td{opacity:0.9}
</style>
