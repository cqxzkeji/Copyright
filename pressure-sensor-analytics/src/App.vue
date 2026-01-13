<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f6f8fb;
  color: #1f2937;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6f8fb;
}

.app-shell {
  min-height: 100vh;
}

button {
  font-family: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
