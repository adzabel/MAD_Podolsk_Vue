<template>
  <main class="page">
    <header class="page-header">
      <div class="page-header__titles">
        <h1 class="page-title">СКПДИ · МАД · Подольск</h1>
        <p class="page-subtitle">работы в статусе «Рассмотрено»</p>
      </div>

      <nav class="mode-switch">
        <RouterLink
          to="/"
          class="mode-switch__btn"
        >
          По месяцам
        </RouterLink>
        <RouterLink
          to="/daily"
          class="mode-switch__btn mode-switch__btn--active"
        >
          По дням
        </RouterLink>
      </nav>
    </header>

    <section class="page-content">
      <!-- Здесь позже появится таблица по дням -->
      <p>Заглушка: экран «По дням».</p>
    </section>
  </main>
</template>

<script setup>
</script>
