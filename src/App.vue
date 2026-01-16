<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  color-scheme: light;
  background-color: #f1f5f9;
  color: #0f172a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f1f5f9;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
