<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #1f2937;
  background-color: #f8fafc;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f1f5f9;
}

#app {
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
}

button {
  font-family: inherit;
}

input,
select,
textarea {
  font-family: inherit;
}

a {
  color: inherit;
}
</style>
