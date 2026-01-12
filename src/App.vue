<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: #f5f7fb;
  color: #1f2a44;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f5f7fb;
}

button {
  font-family: inherit;
}

.page-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e0e5f2;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar h1 {
  font-size: 18px;
  color: #1c2b4a;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu a {
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  color: #2b3a57;
  font-weight: 600;
  background: #f0f4ff;
}

.menu a.router-link-active {
  background: #1f6fff;
  color: #ffffff;
}

.content {
  flex: 1;
  padding: 24px 32px 40px;
}

.top-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(31, 111, 255, 0.08);
  margin-bottom: 20px;
}

.top-bar .status {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #4b5a78;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(28, 50, 100, 0.08);
  margin-bottom: 20px;
}

.panel h2 {
  font-size: 18px;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid.two {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: #f6f8ff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #dfe7fb;
}

.card h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead th {
  text-align: left;
  background: #edf2ff;
  padding: 10px;
  color: #2c3a59;
}

tbody td {
  padding: 10px;
  border-bottom: 1px solid #e6ebf5;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  background: #1f6fff;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.btn.secondary {
  background: #f0f4ff;
  color: #1f2a44;
  border: 1px solid #c9d6f7;
}

.btn.ghost {
  background: #ffffff;
  color: #1f6fff;
  border: 1px solid #1f6fff;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(31, 42, 68, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  width: min(520px, 100%);
  padding: 20px;
  box-shadow: 0 16px 40px rgba(24, 40, 76, 0.2);
}

.modal h3 {
  margin-bottom: 12px;
}

.modal form {
  display: grid;
  gap: 10px;
}

.modal input,
.modal select,
.modal textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d6def2;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.progress-bar {
  height: 10px;
  border-radius: 8px;
  background: #e6ebf5;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #1f6fff, #6dd0ff);
}

@media (max-width: 960px) {
  .page-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
}
</style>
