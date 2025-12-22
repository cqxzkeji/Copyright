<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
:root {
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #1f2937;
  background: #f8fafc;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f8fafc;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

button {
  font-family: inherit;
}
</style>
