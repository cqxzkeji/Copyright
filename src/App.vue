<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
:root {
  color-scheme: light;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --primary: #2f6bff;
  --primary-soft: #e7efff;
  --accent: #12b981;
  --warning: #f9a23c;
  --danger: #ff5c5c;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #e5e7eb;
  --bg: #f5f7fb;
  --card: #ffffff;
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

.app-shell {
  min-height: 100vh;
}

button {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #d8dde7;
  border-radius: 999px;
}
</style>
