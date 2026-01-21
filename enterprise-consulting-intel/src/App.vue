<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f4f7fb;
  color: #1f2a44;
}

.app-shell {
  min-height: 100vh;
}
</style>
