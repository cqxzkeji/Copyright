<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
:root {
  color-scheme: light;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2937;
  background-color: #f4f6fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f6fb;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f4f6fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 18px;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  color: #16a34a;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link {
  padding: 10px 14px;
  border-radius: 10px;
  background: #f8fafc;
  color: #374151;
  font-weight: 500;
}

.nav-link.active {
  background: #dcfce7;
  color: #15803d;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 68px;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar h2 {
  margin: 0;
  font-size: 18px;
}

.content-area {
  padding: 24px 28px 36px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  background: #16a34a;
  color: white;
}

.btn.secondary {
  background: #3b82f6;
}

.btn.ghost {
  background: #e5e7eb;
  color: #111827;
}

.btn.warn {
  background: #f97316;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 600;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2000;
}

.modal-card {
  width: 100%;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 0 20px 8px;
  overflow-y: auto;
}

.modal-footer {
  padding: 8px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-family: inherit;
}

.progress-wrap {
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  height: 12px;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #86efac);
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
