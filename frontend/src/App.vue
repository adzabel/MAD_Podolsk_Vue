<!-- frontend/src/App.vue -->
<script setup>
</script>

<template>
  <div id="app-root">
    <!-- В будущем здесь будет шапка, переключатель режимов, меню и т.п. -->
    <RouterView />
  </div>
</template>

<style>
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

