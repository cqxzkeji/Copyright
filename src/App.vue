<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f7fb;
  color: #1f2a44;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f7fb;
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

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
  background: #2f6fed;
  color: #fff;
}

.btn.secondary {
  background: #ecf1ff;
  color: #2f6fed;
}

.btn.ghost {
  background: transparent;
  color: #2f6fed;
  border: 1px solid #c9d6ff;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(47, 111, 237, 0.18);
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(31, 42, 68, 0.08);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eef1f7;
  text-align: left;
}

.table th {
  color: #6c7a96;
  font-weight: 600;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #e9f0ff;
  color: #2f6fed;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: min(680px, 92vw);
  padding: 24px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-body {
  display: grid;
  gap: 12px;
}

.input,
.select,
.textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbe3f7;
  font-size: 14px;
  background: #fff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #eef2ff;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6fed, #5f8fff);
}

.grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 960px) {
  .grid.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
