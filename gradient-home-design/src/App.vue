<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.08), transparent 25%),
    radial-gradient(circle at 80% 0%, rgba(6, 182, 212, 0.08), transparent 25%),
    linear-gradient(120deg, #f8fbff, #eef2ff);
}
</style>
