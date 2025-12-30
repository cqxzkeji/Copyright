<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<style>
:root {
  --primary: #3b82f6;
  --accent: #22c55e;
  --bg: #f6f9ff;
  --card: #ffffff;
  --text: #0f172a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  font-family: 'Segoe UI', 'PingFang SC', system-ui, -apple-system, sans-serif;
  color: var(--text);
}

.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 25%),
    radial-gradient(circle at 80% 10%, #dcfce7, transparent 22%),
    radial-gradient(circle at 40% 90%, #e5e7eb, transparent 20%),
    var(--bg);
}

.card {
  background: var(--card);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: var(--primary);
  color: white;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn.secondary {
  background: #0ea5e9;
}

.btn.success {
  background: var(--accent);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.25);
}

.grid {
  display: grid;
  gap: 16px;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 12px;
}

.modal {
  background: #fff;
  border-radius: 14px;
  width: min(520px, 100%);
  padding: 20px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  background: #eff6ff;
}

th,
 td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #e0f2fe;
  color: #0284c7;
}

.tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  background: #dbeafe;
  color: #1d4ed8;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
}
</style>
