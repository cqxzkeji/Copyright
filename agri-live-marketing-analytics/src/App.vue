<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
:root {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #1f2a44;
  background-color: #f5f7fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f5f7fb;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 12px 24px rgba(31, 42, 68, 0.08);
}

.card-title {
  font-size: 16px;
  margin: 0 0 12px;
  color: #23304d;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef0f6;
  text-align: left;
}

.table th {
  color: #6b7a99;
  font-weight: 600;
  background: #f6f8fc;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  border: none;
  background: #e8f0ff;
  color: #2856c3;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn.primary {
  background: #377dff;
  color: #fff;
}

.btn.warning {
  background: #ffe7c7;
  color: #b25a00;
}

.progress {
  width: 100%;
  background: #eef2f9;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #5ac8fa, #377dff);
  transition: width 0.3s ease;
}

.chart {
  display: grid;
  gap: 10px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-bar {
  flex: 1;
  height: 10px;
  background: #eef2f9;
  border-radius: 999px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  background: linear-gradient(90deg, #66d9a3, #2ec27e);
}

@media (max-width: 900px) {
  .section-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
