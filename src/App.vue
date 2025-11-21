<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
:root {
  font-family: 'Segoe UI', 'PingFang SC', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  background-color: #f5f7fb;
  color: #1f2d3d;
}

body {
  margin: 0;
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
