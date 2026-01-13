<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f7fb;
  color: #1b1f27;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f5f7fb;
}

a {
  color: inherit;
  text-decoration: none;
}

.app {
  min-height: 100vh;
}
</style>
