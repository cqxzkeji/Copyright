<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: #f6f8fb;
  color: #1f2a37;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6f8fb;
}

button {
  font-family: inherit;
}
</style>
