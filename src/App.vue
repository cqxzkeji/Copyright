<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(110, 193, 228, 0.15), transparent 30%),
    radial-gradient(circle at 80% 0%, rgba(245, 165, 36, 0.12), transparent 26%),
    radial-gradient(circle at 50% 80%, rgba(60, 123, 230, 0.12), transparent 28%),
    var(--bg);
}
</style>
