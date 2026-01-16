<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #1f2a44;
  background: #f6f8fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6f8fb;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: #f6f8fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e6ebf2;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar h2 {
  font-size: 18px;
  margin-bottom: 24px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #3b4a67;
  background: #f6f8fb;
}

.nav-item.router-link-active {
  background: #e0ecff;
  color: #1a4ed8;
  font-weight: 600;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e6ebf2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
}

.topbar .title {
  font-size: 18px;
  font-weight: 600;
}

.content {
  padding: 24px 28px 36px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(15, 35, 95, 0.06);
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #4a5a77;
}

.card .metric {
  font-size: 22px;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.action-button {
  background: #1a4ed8;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.action-button.secondary {
  background: #ffffff;
  color: #1a4ed8;
  border: 1px solid #c9d9ff;
}

.table-wrap {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
  box-shadow: 0 4px 12px rgba(15, 35, 95, 0.06);
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  padding: 10px 12px;
  border-bottom: 1px solid #edf1f7;
  text-align: left;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: #edf3ff;
  color: #1a4ed8;
}

.chart {
  display: grid;
  gap: 12px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(15, 35, 95, 0.06);
  margin-bottom: 20px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 90px;
  font-size: 13px;
  color: #4a5a77;
}

.bar-track {
  flex: 1;
  height: 12px;
  background: #edf1f7;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5aa2ff, #1a4ed8);
  border-radius: 999px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  width: min(520px, 92vw);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.2);
}

.modal header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.modal footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.modal input,
.modal select,
.modal textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d8e0ef;
  margin-top: 6px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.progress {
  width: 100%;
  height: 10px;
  background: #edf1f7;
  border-radius: 999px;
  overflow: hidden;
}

.progress > span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #34d399, #1a4ed8);
}

@media (max-width: 960px) {
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    overflow-x: auto;
  }

  .app-shell {
    flex-direction: column;
  }

  .nav-list {
    flex-direction: row;
  }
}
</style>
