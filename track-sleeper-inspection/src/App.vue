<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
  color: #1f2a44;
  background-color: #f6f9ff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6f9ff;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

input,
select,
textarea {
  font-family: inherit;
}

.app-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(32, 61, 116, 0.08);
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.app-table th,
.app-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e6ecf6;
  text-align: left;
}

.app-table th {
  color: #4a5f86;
  font-weight: 600;
  background: #f2f6ff;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.success {
  background: #e6f8ef;
  color: #1d8f5a;
}

.badge.warning {
  background: #fff4e0;
  color: #b46912;
}

.badge.danger {
  background: #ffe7ea;
  color: #c03443;
}

.primary-btn {
  background: #2f6bff;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(47, 107, 255, 0.25);
}

.secondary-btn {
  background: #edf2ff;
  color: #2f6bff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.ghost-btn {
  background: transparent;
  border: 1px solid #c7d4f4;
  color: #2b3e69;
  padding: 9px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 24px;
}

.modal-panel {
  background: #fff;
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #5a6b8c;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 9px 10px;
  border-radius: 8px;
  border: 1px solid #d7e1f5;
  background: #fdfdff;
}

.progress-bar {
  height: 10px;
  background: #e2e9f8;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #59b7ff);
  border-radius: 999px;
  transition: width 0.3s ease;
}

@media (max-width: 900px) {
  .modal-panel {
    max-width: 92vw;
  }
}
</style>
