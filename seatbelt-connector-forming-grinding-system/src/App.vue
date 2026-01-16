<template>
  <div class="app-root">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
:root {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  color: #1f2a44;
  background: #f6f8fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6f8fb;
}

.app-root {
  min-height: 100vh;
}

button {
  font-family: inherit;
}
</style>
