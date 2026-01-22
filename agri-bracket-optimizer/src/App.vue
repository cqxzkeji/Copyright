<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  --primary: #1b7cff;
  --primary-soft: #e8f2ff;
  --accent: #32c18c;
  --bg: #f6f9ff;
  --text: #1d2a3a;
  --muted: #5f6b7a;
  --border: #dbe5f3;
  --shadow: 0 10px 30px rgba(18, 38, 63, 0.12);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

.app-shell {
  min-height: 100vh;
}

button {
  font-family: inherit;
}

img {
  max-width: 100%;
  display: block;
}
</style>
