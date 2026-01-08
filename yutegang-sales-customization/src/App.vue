<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f8ff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f8ff;
  color: #1c2b4a;
}

a {
  text-decoration: none;
  color: inherit;
}

.app-shell {
  min-height: 100vh;
}
</style>
