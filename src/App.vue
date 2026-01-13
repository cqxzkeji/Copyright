<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "Noto Sans SC", system-ui, sans-serif;
  background: #f5f7fb;
  color: #1c2333;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-shell {
  min-height: 100vh;
  background: #f5f7fb;
}

button {
  font-family: inherit;
}

input,
select,
textarea {
  font-family: inherit;
}
</style>
