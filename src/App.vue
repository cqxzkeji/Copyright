<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  --primary: #2f6bff;
  --accent: #22c55e;
  --bg: #f5f7fb;
  --text: #1f2a37;
  --muted: #6b7280;
  --border: #e5e7eb;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
}

.app {
  min-height: 100vh;
}

button {
  border: none;
  background: none;
  font: inherit;
  cursor: pointer;
}
</style>
